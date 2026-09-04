import Darwin
import Foundation

/// A sibling staging path lets a failed Photos/iCloud export leave an existing
/// destination intact. Photos requires that the staging file does not exist.
final class MediaFileDestination {
  let temporary: URL
  private let destination: URL

  init(path: String) throws {
    guard path.hasPrefix("/"), !path.contains("\0") else {
      throw MediaPickerError.invalidDestination
    }
    destination = URL(fileURLWithPath: path).standardizedFileURL
    let parent = destination.deletingLastPathComponent()
    let parentMetadata = try parent.resourceValues(forKeys: [.isDirectoryKey])
    guard parentMetadata.isDirectory == true else {
      throw MediaPickerError.invalidDestination
    }
    temporary = parent.appendingPathComponent(".nitro-media-\(UUID().uuidString).tmp")
    try validateExistingDestination()
  }

  deinit { try? FileManager.default.removeItem(at: temporary) }

  func commit() throws -> Double {
    // Validate again after a potentially long cloud download.
    try validateExistingDestination()
    let metadata = try temporary.resourceValues(forKeys: [.isRegularFileKey, .fileSizeKey])
    guard metadata.isRegularFile == true, let size = metadata.fileSize else {
      throw MediaPickerError.invalidDestination
    }
    guard rename(temporary.path, destination.path) == 0 else {
      throw NSError(domain: NSPOSIXErrorDomain, code: Int(errno))
    }
    return Double(size)
  }

  private func validateExistingDestination() throws {
    do {
      let attributes = try FileManager.default.attributesOfItem(atPath: destination.path)
      guard attributes[.type] as? FileAttributeType == .typeRegular else {
        throw MediaPickerError.invalidDestination
      }
    } catch let error as NSError where error.domain == NSCocoaErrorDomain && error.code == NSFileReadNoSuchFileError {
      // A new destination is valid; all other inspection errors propagate.
    }
  }
}
