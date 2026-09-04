import Photos

extension PHAsset {
  /// The resource holding the asset's full-quality bytes, preferring an edited
  /// version when the user has adjusted it.
  var primaryResource: PHAssetResource? {
    let resources = PHAssetResource.assetResources(for: self)
    let preferred: [PHAssetResourceType] =
      mediaType == .video ? [.fullSizeVideo, .video] : [.fullSizePhoto, .photo]

    for type in preferred {
      if let match = resources.first(where: { $0.type == type }) {
        return match
      }
    }

    return resources.first
  }
}
