/**
 * AgriMastery Progress Tracker
 * Ensures farmers resume exactly where they left off.
 */

class ProgressTracker {
    static updateProgress(farmerEmail, completedModule) {
        const nextModule = completedModule + 1;
        console.log([LOGIC] Farmer \ completed Module \.);
        console.log([LOGIC] Setting next checkpoint to Module \.);
        
        // This signal is sent to Layer 5 to save to the database
        return {
            email: farmerEmail,
            resumeAt: nextModule,
            timestamp: new Date().toISOString()
        };
    }
}
