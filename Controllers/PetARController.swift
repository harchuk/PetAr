import Foundation
import Combine

/// A simple controller that stores a pet profile and publishes updates.
class PetARController: ObservableObject {
    @Published var profile: PetProfile

    init(profile: PetProfile = PetProfile(name: "Fluffy")) {
        self.profile = profile
    }

    func updateProfile(_ profile: PetProfile) {
        self.profile = profile
    }
}
