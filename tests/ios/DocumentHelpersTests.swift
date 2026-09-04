import Foundation
import UniformTypeIdentifiers

@main
enum DocumentHelpersTests {
  static func main() throws {
    let manager = FileManager.default
    let directory = manager.temporaryDirectory.appendingPathComponent(UUID().uuidString)
    try manager.createDirectory(at: directory, withIntermediateDirectories: true)
    defer { try? manager.removeItem(at: directory) }
    let source = directory.appendingPathComponent("source.txt")
    let destination = directory.appendingPathComponent("copy.txt")
    let data = Data(repeating: 42, count: 800_000)
    try data.write(to: source)
    try Data("old".utf8).write(to: destination)
    var progress: [Double] = []
    let bytes = try DocumentFileCopy.copy(from: source, to: destination.path) { progress.append($0) }
    precondition(bytes == Double(data.count))
    precondition(tryData(destination) == data)
    precondition(progress.first == 0 && progress.last == 1)
    precondition(zip(progress, progress.dropFirst()).allSatisfy { $0 <= $1 })
    expectFailure { _ = try DocumentFileCopy.copy(from: source, to: source.path, onProgress: nil) }
    let alias = directory.appendingPathComponent("hardlink.txt")
    try manager.linkItem(at: source, to: alias)
    expectFailure { _ = try DocumentFileCopy.copy(from: source, to: alias.path, onProgress: nil) }
    let symlink = directory.appendingPathComponent("symlink.txt")
    try manager.createSymbolicLink(at: symlink, withDestinationURL: source)
    expectFailure { _ = try DocumentFileCopy.copy(from: source, to: symlink.path, onProgress: nil) }
    expectFailure { _ = try DocumentFileCopy.copy(from: source, to: "relative.txt", onProgress: nil) }
    expectFailure { _ = try DocumentFileCopy.copy(from: directory, to: destination.path, onProgress: nil) }
    precondition(tryData(source) == data)
    precondition(tryData(destination) == data)
    let remainingFiles = try manager.contentsOfDirectory(atPath: directory.path)
    precondition(remainingFiles.allSatisfy { !$0.hasPrefix(".nitro-document-") })
    let empty = directory.appendingPathComponent("empty")
    try Data().write(to: empty)
    let emptyBytes = try DocumentFileCopy.copy(from: empty, to: destination.path, onProgress: nil)
    precondition(emptyBytes == 0 && tryData(destination).isEmpty)
    let types = try DocumentContentTypes.resolve(["*/*", "image/*", "video/*", "audio/*", "text/*", "application/pdf"])
    precondition(types == [.item, .image, .movie, .audio, .text, .pdf])
    expectFailure { _ = try DocumentContentTypes.resolve([]) }
    expectFailure { _ = try DocumentContentTypes.resolve(["application/*"]) }
    expectFailure { _ = try DocumentContentTypes.resolve(["application/x-nitro-unknown-type"]) }
    try testMediaDestination(directory: directory)
    print("Document helpers: copy, overwrite, progress, aliases, invalid paths, empty files and MIME filters passed")
  }

  static func testMediaDestination(directory: URL) throws {
    let manager = FileManager.default
    let output = directory.appendingPathComponent("media.bin")
    let original = Data("original".utf8)
    try original.write(to: output)
    var abandoned: MediaFileDestination? = try MediaFileDestination(path: output.path)
    let abandonedPath = abandoned!.temporary
    try Data("partial".utf8).write(to: abandonedPath)
    abandoned = nil
    precondition(!manager.fileExists(atPath: abandonedPath.path))
    precondition(tryData(output) == original)
    let successful = try MediaFileDestination(path: output.path)
    let replacement = Data("replacement".utf8)
    try replacement.write(to: successful.temporary)
    let bytes = try successful.commit()
    precondition(bytes == Double(replacement.count))
    precondition(tryData(output) == replacement)
    let fresh = try MediaFileDestination(path: directory.appendingPathComponent("new.bin").path)
    try Data().write(to: fresh.temporary)
    let emptyBytes = try fresh.commit()
    precondition(emptyBytes == 0)
    expectFailure { _ = try MediaFileDestination(path: "relative.bin") }
    expectFailure { _ = try MediaFileDestination(path: directory.path) }
    expectFailure { _ = try MediaFileDestination(path: directory.appendingPathComponent("missing/new.bin").path) }
    let symlink = directory.appendingPathComponent("media-link")
    try manager.createSymbolicLink(at: symlink, withDestinationURL: output)
    expectFailure { _ = try MediaFileDestination(path: symlink.path) }
    print("Media destination: failed export preservation, atomic replacement, cleanup and validation passed")
  }

  static func tryData(_ url: URL) -> Data { try! Data(contentsOf: url) }

  static func expectFailure(_ operation: () throws -> Void) {
    do { try operation(); preconditionFailure("Expected operation to fail") } catch {}
  }
}
