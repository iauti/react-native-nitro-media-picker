import NitroModules
import Photos

/// One picked asset, identified now and read only when asked.
final class HybridPickedAsset: HybridPickedAssetSpec {
  private let asset: PHAsset
  private let resource: PHAssetResource

  let id: String
  let fileName: String
  let mimeType: String
  let mediaType: MediaType
  let byteSize: Double?

  init(asset: PHAsset, resource: PHAssetResource) {
    self.asset = asset
    self.resource = resource

    id = asset.localIdentifier
    fileName = resource.originalFilename
    mimeType = resource.mimeType(for: asset.mediaType)
    mediaType = asset.mediaType == .video ? .video : .image
    // Photos does not expose resource byte sizes through its public API.
    byteSize = nil

    super.init()
  }

  func saveToFile(
    destinationPath: String,
    onProgress: ((_ fraction: Double) -> Void)?
  ) throws -> Promise<Double> {
    let resource = self.resource

    return Promise.async {
      let destination = try MediaFileDestination(path: destinationPath)

      let options = PHAssetResourceRequestOptions()
      // The asset may live only in iCloud; without this the request fails with
      // PHPhotosErrorNetworkAccessRequired.
      options.isNetworkAccessAllowed = true
      onProgress?(0)
      if let onProgress {
        options.progressHandler = { fraction in
          guard fraction.isFinite else { return }
          // Download completion precedes the final atomic replacement.
          onProgress(min(max(fraction, 0), 0.99))
        }
      }

      try await PHAssetResourceManager.default().writeData(
        for: resource, toFile: destination.temporary, options: options)
      let written = try destination.commit()
      onProgress?(1)
      return written
    }
  }
}
