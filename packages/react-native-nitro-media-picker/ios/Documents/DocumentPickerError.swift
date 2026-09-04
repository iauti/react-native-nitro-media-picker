import Foundation

enum DocumentPickerError: LocalizedError {
  case invalidMimeType(String)
  case emptyMimeTypes
  case invalidDestination
  case sameSourceAndDestination
  case notRegularFile
  case coordinationFailed

  var errorDescription: String? {
    switch self {
    case .invalidMimeType(let type): return "Unsupported document MIME type: \(type)"
    case .emptyMimeTypes: return "mimeTypes must contain at least one MIME type"
    case .invalidDestination: return "destinationPath must be an absolute filesystem path"
    case .sameSourceAndDestination: return "The destination refers to the selected source document"
    case .notRegularFile: return "The selected document is not a regular file"
    case .coordinationFailed: return "The document provider did not grant coordinated access"
    }
  }
}
