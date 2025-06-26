import SwiftUI

/// A placeholder view that simulates media upload.
struct UploadView: View {
    @State private var showingImagePicker = false
    var body: some View {
        VStack {
            Text("Upload pet photos and videos")
                .padding()
            Button("Select Media") {
                showingImagePicker.toggle()
            }
        }
        .sheet(isPresented: $showingImagePicker) {
            Text("Media picker placeholder")
        }
    }
}

#Preview {
    UploadView()
}
