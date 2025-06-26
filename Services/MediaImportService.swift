import Foundation
import PhotosUI

/// A placeholder service for importing media.
final class MediaImportService: NSObject, PHPickerViewControllerDelegate {
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        // Handle the imported media here.
        picker.dismiss(animated: true)
    }

    func createPicker() -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.filter = .any(of: [.images, .videos])
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = self
        return picker
    }
}
