/**
 * AgriMastery Graduation Engine
 * Links Course Completion to Marketplace Reputation
 */

class GraduationEngine {
    static checkGraduation(farmerProfile) {
        const TOTAL_MODULES = 5;
        
        if (farmerProfile.currentModule > TOTAL_MODULES) {
            console.log("--- GRADUATION DETECTED ---");
            console.log(Farmer: \ has completed all modules.);
            
            // Trigger Layer 5 to update the 'isCertified' flag
            return {
                status: "GRADUATED",
                marketplaceBadge: "GOLD_MASTER",
                platformDiscount: "10%"
            };
        } else {
            return {
                status: "IN_PROGRESS",
                modulesRemaining: TOTAL_MODULES - farmerProfile.currentModule + 1
            };
        }
    }
}
