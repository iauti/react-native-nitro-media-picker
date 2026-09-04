import Photos
import UniformTypeIdentifiers

extension PHAssetResource {
  /// The resource's MIME type, falling back to a usable default when the
  /// system reports a type it has no MIME mapping for.
  func mimeType(for mediaType: PHAssetMediaType) -> String {
    if let mime = UTType(uniformTypeIdentifier)?.preferredMIMEType {
      return mime
    }

    return mediaType == .video ? "video/mp4" : "image/jpeg"
  }
}
