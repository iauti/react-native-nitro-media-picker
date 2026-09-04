import UIKit

extension UIViewController {
  /// The controller a sheet should be presented from: presenting onto one that
  /// is already presenting fails silently.
  static var topMost: UIViewController? {
    let scene = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .first { $0.activationState == .foregroundActive }

    guard var top = scene?.windows.first(where: { $0.isKeyWindow })?.rootViewController else {
      return nil
    }

    while let presented = top.presentedViewController {
      top = presented
    }

    return top
  }
}
