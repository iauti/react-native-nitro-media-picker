import Photos

extension PHAssetResourceManager {
  /// `writeData(for:toFile:options:completionHandler:)` as an awaitable call,
  /// so callers are not threading a completion handler through their own
  /// promise plumbing.
  func writeData(
    for resource: PHAssetResource,
    toFile destination: URL,
    options: PHAssetResourceRequestOptions
  ) async throws {
    try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
      writeData(for: resource, toFile: destination, options: options) { error in
        if let error {
          continuation.resume(throwing: error)
        } else {
          continuation.resume()
        }
      }
    }
  }
}
