import Foundation

/// Balances exactly the access acquired for this selection. A false result is
/// valid for URLs already accessible inside the application sandbox.
final class ScopedDocument {
  let url: URL
  private let hasScopedAccess: Bool

  init(url: URL) {
    self.url = url
    hasScopedAccess = url.startAccessingSecurityScopedResource()
  }

  deinit {
    if hasScopedAccess { url.stopAccessingSecurityScopedResource() }
  }

  func read<T>(_ body: (URL) throws -> T) throws -> T {
    var coordinationError: NSError?
    var result: Result<T, Error>?
    NSFileCoordinator().coordinate(readingItemAt: url, options: [], error: &coordinationError) {
      coordinatedURL in
      result = Result { try body(coordinatedURL) }
    }
    if let coordinationError { throw coordinationError }
    guard let result else { throw DocumentPickerError.coordinationFailed }
    return try result.get()
  }
}
