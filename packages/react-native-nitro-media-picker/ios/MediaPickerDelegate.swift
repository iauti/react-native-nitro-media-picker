import PhotosUI

/// Forwards one picking session's outcome back to the HybridObject.
///
/// Kept apart from the HybridObject so the delegate has a lifetime of its own
/// and so a `NSObject` conformance is not forced onto the module.
final class MediaPickerDelegate: NSObject, PHPickerViewControllerDelegate,
  UIAdaptivePresentationControllerDelegate
{
  private var onFinish: (([PHPickerResult]) -> Void)?

  init(onFinish: @escaping ([PHPickerResult]) -> Void) {
    self.onFinish = onFinish
  }

  func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
    // A cancel arrives as an empty selection rather than its own callback.
    guard let onFinish else { return }
    self.onFinish = nil
    if picker.isBeingDismissed, let transition = picker.transitionCoordinator {
      transition.animate(alongsideTransition: nil) { _ in onFinish(results) }
    } else {
      picker.dismiss(animated: true) { onFinish(results) }
    }
  }

  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    // Swiping the sheet away never reaches the picker delegate above.
    guard let onFinish else { return }
    self.onFinish = nil
    onFinish([])
  }
}
