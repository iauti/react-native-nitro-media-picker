import Foundation
import Darwin

enum DocumentFileCopy {
  /// Never truncates the source. Atomically replaces the destination. The
  /// sibling temporary file keeps a failed copy out of the caller's final path.
  static func copy(from source: URL, to path: String, onProgress: ((Double) -> Void)?) throws -> Double {
    guard path.hasPrefix("/"), !path.contains("\0") else {
      throw DocumentPickerError.invalidDestination
    }
    let manager = FileManager.default
    let destination = URL(fileURLWithPath: path).standardizedFileURL
    guard source.resolvingSymlinksInPath() != destination.resolvingSymlinksInPath()
    else { throw DocumentPickerError.sameSourceAndDestination }
    let sourceAttributes = try manager.attributesOfItem(atPath: source.path)
    if let destinationAttributes = try? manager.attributesOfItem(atPath: destination.path),
      let sourceInode = sourceAttributes[.systemFileNumber] as? NSNumber,
      let destinationInode = destinationAttributes[.systemFileNumber] as? NSNumber,
      sourceInode == destinationInode,
      (sourceAttributes[.systemNumber] as? NSNumber) == (destinationAttributes[.systemNumber] as? NSNumber) {
      throw DocumentPickerError.sameSourceAndDestination
    }
    let metadata = try source.resourceValues(forKeys: [.isRegularFileKey, .fileSizeKey])
    guard metadata.isRegularFile == true else { throw DocumentPickerError.notRegularFile }
    let temporary = destination.deletingLastPathComponent()
      .appendingPathComponent(".nitro-document-\(UUID().uuidString).tmp")
    guard manager.createFile(atPath: temporary.path, contents: nil) else {
      throw CocoaError(.fileWriteUnknown)
    }
    defer { try? manager.removeItem(at: temporary) }
    let input = try FileHandle(forReadingFrom: source)
    defer { try? input.close() }
    let output = try FileHandle(forWritingTo: temporary)
    defer { try? output.close() }
    var written = 0
    var lastProgress = 0.0
    onProgress?(0)
    while let chunk = try input.read(upToCount: 256 * 1024), !chunk.isEmpty {
      try output.write(contentsOf: chunk)
      written += chunk.count
      if let size = metadata.fileSize, size > 0 {
        let fraction = min(Double(written) / Double(size), 0.99)
        if fraction - lastProgress >= 0.01 {
          lastProgress = fraction
          onProgress?(fraction)
        }
      }
    }
    try output.synchronize()
    try output.close()
    guard rename(temporary.path, destination.path) == 0 else {
      throw NSError(domain: NSPOSIXErrorDomain, code: Int(errno))
    }
    onProgress?(1)
    return Double(written)
  }
}
