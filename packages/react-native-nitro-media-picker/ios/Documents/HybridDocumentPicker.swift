import NitroModules
import UIKit

final class HybridDocumentPicker: HybridDocumentPickerSpec {
  // Accessed only on main. Static ownership also rejects concurrent requests
  // made through independently constructed Nitro root instances.
  private static var activeDelegate: DocumentPickerDelegate?
  private static let metadataQueue = DispatchQueue(label: "com.margelo.nitro.document-metadata", qos: .userInitiated)

  func pickDocuments(options: DocumentPickOptions) throws -> Promise<DocumentPickResult> {
    let contentTypes = try DocumentContentTypes.resolve(options.mimeTypes)
    let promise = Promise<DocumentPickResult>()
    DispatchQueue.main.async {
      guard Self.activeDelegate == nil else {
        promise.reject(withError: MediaPickerError.pickInProgress)
        return
      }
      guard let presenter = UIViewController.topMost,
        presenter.viewIfLoaded?.window != nil,
        !presenter.isBeingDismissed, !presenter.isBeingPresented
      else {
        promise.reject(withError: MediaPickerError.noPresenter)
        return
      }
      let picker = UIDocumentPickerViewController(forOpeningContentTypes: contentTypes, asCopy: false)
      picker.allowsMultipleSelection = options.allowMultiple ?? false
      let delegate = DocumentPickerDelegate { documents in
        Self.activeDelegate = nil
        Self.metadataQueue.async {
          do {
            let selected: [HybridPickedDocumentSpec] = try documents.map { try HybridPickedDocument(document: $0) }
            promise.resolve(withResult: DocumentPickResult(isCanceled: documents.isEmpty, documents: selected))
          } catch {
            promise.reject(withError: error)
          }
        }
      }
      Self.activeDelegate = delegate
      picker.delegate = delegate
      picker.presentationController?.delegate = delegate
      presenter.present(picker, animated: true)
    }
    return promise
  }
}
