import Foundation

/// A simple model representing a pet profile.
struct PetProfile: Codable {
    var id: UUID = UUID()
    var name: String
    var birthDate: Date?
    var description: String?
    var favoriteBehaviors: [String] = []
}
