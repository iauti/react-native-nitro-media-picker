import Foundation

/// Failures the picker reports to JavaScript.
enum MediaPickerError: LocalizedError {
  case pickInProgress
  case noPresenter
  case libraryAccessDenied
  case invalidSelectionCount
  case noMediaTypesRequested
  case assetUnavailable(id: String)
  case assetIdentifierUnavailable
  case invalidDestination

  var errorDescription: String? {
    switch self {
    case .pickInProgress:
      return "A pick is already in progress"
    case .noPresenter:
      return "No view controller is available to present the picker from"
    case .libraryAccessDenied:
      return "Access to the media library was denied — grant photo access in Settings"
    case .invalidSelectionCount:
      return "`maxSelectionCount` must be a positive integer no greater than 2147483647"
    case .noMediaTypesRequested:
      return "`mediaTypes` must name at least one type to pick"
    case .assetUnavailable(let id):
      return "The picked asset \(id) is no longer available"
    case .assetIdentifierUnavailable:
      return "A selected asset has no accessible Photos identifier; check library permissions"
    case .invalidDestination:
      return "destinationPath must be an absolute file path in an existing directory; an existing destination must be a regular file"
    }
  }
}
