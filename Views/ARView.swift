import SwiftUI
import ARKit
import RealityKit

/// A basic AR view displaying a placeholder 3D object.
struct PetARViewContainer: UIViewRepresentable {
    func makeUIView(context: Context) -> ARView {
        let arView = ARView(frame: .zero)
        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = [.horizontal]
        arView.session.run(configuration)

        // Load a placeholder entity
        let box = MeshResource.generateBox(size: 0.2)
        let material = SimpleMaterial(color: .orange, isMetallic: false)
        let modelEntity = ModelEntity(mesh: box, materials: [material])
        let anchor = AnchorEntity(plane: .horizontal)
        anchor.addChild(modelEntity)
        arView.scene.addAnchor(anchor)
        return arView
    }

    func updateUIView(_ uiView: ARView, context: Context) {}
}

struct ARViewWrapper: View {
    var body: some View {
        PetARViewContainer()
            .edgesIgnoringSafeArea(.all)
    }
}

#Preview {
    ARViewWrapper()
}
