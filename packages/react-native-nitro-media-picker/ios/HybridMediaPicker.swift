import NitroModules
import PhotosUI

/// Presents the system picker and hands back identified, unread assets.
final class HybridMediaPicker: HybridMediaPickerSpec {
  /// Holds one pick's delegate and its completion for as long as the sheet is
  /// up. Released before the result is delivered, so a duplicate callback — a
  /// cancel arriving alongside a dismiss — cannot deliver twice.
  @MainActor private static var activeDelegate: MediaPickerDelegate?

  func getPermissionStatus() throws -> Promise<PermissionStatus> {
    return Promise.async {
      PHPhotoLibrary.authorizationStatus(for: .readWrite).permissionStatus
    }
  }

  func requestPermission() throws -> Promise<PermissionStatus> {
    return Promise.async {
      await PHPhotoLibrary.requestAuthorization(for: .readWrite).permissionStatus
    }
  }

  func pickAssets(options: PickOptions) throws -> Promise<PickResult> {
    guard !options.mediaTypes.isEmpty else {
      throw MediaPickerError.noMediaTypesRequested
    }

    if let limit = options.maxSelectionCount {
      guard limit.isFinite, limit >= 1, limit <= 2_147_483_647, limit.rounded(.down) == limit else {
        throw MediaPickerError.invalidSelectionCount
      }
    }

    return Promise.async {
      // Identifiers are only populated for a picker bound to the shared
      // library, and identifiers are the whole point — so access is required
      // before the sheet is worth presenting.
      let status = await PHPhotoLibrary.requestAuthorization(for: .readWrite)
      guard status == .authorized || status == .limited else {
        throw MediaPickerError.libraryAccessDenied
      }

      let results = try await self.presentPicker(options: options)

      return PickResult(
        isCanceled: results.isEmpty,
        assets: try Self.describe(results))
    }
  }

  /// Present the sheet and wait for the user to finish with it.
  @MainActor
  private func presentPicker(options: PickOptions) async throws -> [PHPickerResult] {
    guard Self.activeDelegate == nil else {
      throw MediaPickerError.pickInProgress
    }

    guard let presenter = UIViewController.topMost,
      presenter.viewIfLoaded?.window != nil,
      !presenter.isBeingDismissed, !presenter.isBeingPresented else {
      throw MediaPickerError.noPresenter
    }

    var config = PHPickerConfiguration(photoLibrary: .shared())
    config.selection = .ordered
    config.selectionLimit = Int(options.maxSelectionCount ?? 0)
    config.filter = .any(of: options.mediaTypes.map(\.pickerFilter))

    return await withCheckedContinuation { continuation in
      var hasResumed = false

      let delegate = MediaPickerDelegate { results in
        guard !hasResumed else { return }
        hasResumed = true

        Self.activeDelegate = nil
        continuation.resume(returning: results)
      }

      Self.activeDelegate = delegate

      let picker = PHPickerViewController(configuration: config)
      picker.delegate = delegate
      picker.presentationController?.delegate = delegate

      presenter.present(picker, animated: true)
    }
  }

  /// Metadata straight from the library's own records — no resource is read,
  /// so nothing is copied or downloaded here.
  private static func describe(_ results: [PHPickerResult]) throws -> [HybridPickedAssetSpec] {
    let identifiers = try results.map { result in
      guard let identifier = result.assetIdentifier else {
        throw MediaPickerError.assetIdentifierUnavailable
      }
      return identifier
    }
    let fetched = PHAsset.fetchAssets(withLocalIdentifiers: identifiers, options: nil)

    var byId: [String: PHAsset] = [:]
    fetched.enumerateObjects { asset, _, _ in byId[asset.localIdentifier] = asset }

    // Keyed back through `identifiers`, because `fetchAssets` does not preserve
    // the order the user picked in.
    return try identifiers.map { identifier in
      guard let asset = byId[identifier], let resource = asset.primaryResource else {
        throw MediaPickerError.assetUnavailable(id: identifier)
      }

      return HybridPickedAsset(asset: asset, resource: resource)
    }
  }
}
