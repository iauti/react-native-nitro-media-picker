import UniformTypeIdentifiers

enum DocumentContentTypes {
  static func resolve(_ mimeTypes: [String]) throws -> [UTType] {
    guard !mimeTypes.isEmpty else { throw DocumentPickerError.emptyMimeTypes }
    return try mimeTypes.map { mimeType in
      switch mimeType {
      case "*/*": return .item
      case "image/*": return .image
      case "video/*": return .movie
      case "audio/*": return .audio
      case "text/*": return .text
      default:
        guard !mimeType.contains("*"), mimeType.split(separator: "/").count == 2,
          let type = UTType(mimeType: mimeType), !type.isDynamic
        else { throw DocumentPickerError.invalidMimeType(mimeType) }
        return type
      }
    }
  }
}
