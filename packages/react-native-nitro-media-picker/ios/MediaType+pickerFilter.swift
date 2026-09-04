import PhotosUI

extension MediaType {
  /// The picker filter that admits this kind of media.
  var pickerFilter: PHPickerFilter {
    switch self {
    case .image:
      return .images
    case .video:
      return .videos
    }
  }
}
