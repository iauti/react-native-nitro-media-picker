import UIKit

/// UIKit owns the UI thread; all completion state stays on that thread.
final class DocumentPickerDelegate: NSObject, UIDocumentPickerDelegate, UIAdaptivePresentationControllerDelegate {
  private var completion: (([ScopedDocument]) -> Void)?

  init(completion: @escaping ([ScopedDocument]) -> Void) {
    self.completion = completion
    super.init()
  }

  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    finish(controller, documents: urls.map { ScopedDocument(url: $0) })
  }

  func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
    finish(controller, documents: [])
  }

  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    guard let completion else { return }
    self.completion = nil
    completion([])
  }

  private func finish(_ controller: UIDocumentPickerViewController, documents: [ScopedDocument]) {
    guard let completion else { return }
    self.completion = nil
    // The system may already be dismissing the picker when its delegate runs.
    // Attach to that transition instead of resolving before the UI is gone.
    if controller.isBeingDismissed, let transition = controller.transitionCoordinator {
      transition.animate(alongsideTransition: nil) { _ in completion(documents) }
    } else {
      controller.dismiss(animated: true) { completion(documents) }
    }
  }
}
