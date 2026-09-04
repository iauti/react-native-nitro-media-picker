import NitroModules
import Photos

extension PHAuthorizationStatus {
  /// The cross-platform status this maps onto.
  var permissionStatus: PermissionStatus {
    switch self {
    case .authorized:
      return .granted
    case .limited:
      return .limited
    case .notDetermined:
      return .notDetermined
    case .denied, .restricted:
      return .denied
    @unknown default:
      return .denied
    }
  }
}
