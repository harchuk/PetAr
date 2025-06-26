# PetAR

A simple prototype demonstrating how a pet can be visualized in AR.

This project is a SwiftUI skeleton meant for experimentation. It contains
placeholder views and models that can be expanded into a full iOS
application.

## Structure

- **Models** – Swift structs representing domain data (e.g., `PetProfile`).
- **Views** – SwiftUI views like the media `UploadView` and AR scene `ARViewWrapper`.
- **Controllers** – Simple controllers (e.g., `PetARController`) that manage state.
- **Services** – Stand-in services such as `MediaImportService` for handling media import.
- **Assets** – Place to store 3D models or UI resources.

## Getting Started

1. Open the project in Xcode on macOS.
2. Add your own Swift Package or Xcode project settings.
3. Build and run on a device that supports ARKit.

This repository only provides the basic building blocks. Feel free to
extend it with real functionality like generating 3D models from photos,
animating the pet, and responding to user interactions.
