/**
 * AgriMastery Farmer Persistence Engine
 * Handles Registration, Progress Tracking, and Resets
 */

const farmersDatabase = []; // In production, this connects to Layer 6 SQL

class FarmerService {
    // 1. Register a new farmer
    static register(name, email, password, recoveryHint) {
        const newFarmer = {
            id: "FARMER_" + Math.random().toString(36).substr(2, 5),
            name,
            email,
            password,
            recoveryHint,
            currentModule: 1, // Start at Module 1
            lastAccessed: new Date()
        };
        farmersDatabase.push(newFarmer);
        return "Registration Successful for " + name;
    }

    // 2. Resume Course (The 'Continue' Logic)
    static getProgress(email) {
        const farmer = farmersDatabase.find(f => f.email === email);
        return farmer ? Resuming Module  : "User not found";
    }

    // 3. Password Reset Logic
    static resetPassword(email, hint, newPassword) {
        const farmer = farmersDatabase.find(f => f.email === email);
        if (farmer && farmer.recoveryHint === hint) {
            farmer.password = newPassword;
            return "Password Reset Successful!";
        }
        return "Verification Failed: Hint does not match.";
    }
}
