import Foundation
import NitroModules
import UniformTypeIdentifiers

final class HybridPickedDocument: HybridPickedDocumentSpec {
  private let document: ScopedDocument
  private let queue = DispatchQueue(label: "com.margelo.nitro.picked-document", qos: .userInitiated)

  let uri: String
  let fileName: String
  let mimeType: String?
  let byteSize: Double?

  /// Invoked on the document metadata queue, never the UI thread.
  init(document: ScopedDocument) throws {
    self.document = document
    uri = document.url.absoluteString
    let metadata = try document.read { url in
      try url.resourceValues(forKeys: [.nameKey, .contentTypeKey, .fileSizeKey, .isRegularFileKey])
    }
    guard metadata.isRegularFile == true else { throw DocumentPickerError.notRegularFile }
    fileName = metadata.name ?? document.url.lastPathComponent
    mimeType = metadata.contentType?.preferredMIMEType
    byteSize = metadata.fileSize.map(Double.init)
    super.init()
  }

  func saveToFile(destinationPath: String, onProgress: ((Double) -> Void)?) throws -> Promise<Double> {
    return Promise.parallel(queue) { [self] in
      try document.read { source in
        try DocumentFileCopy.copy(from: source, to: destinationPath, onProgress: onProgress)
      }
    }
  }
}
