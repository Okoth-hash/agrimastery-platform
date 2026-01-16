/**
 * AgriMastery Global Security Shield
 * Protects Omondi and farmers from unauthorized access
 */

const loginAttempts = {};

function secureLogin(username, password) {
    // Brute Force Check
    if (loginAttempts[username] >= 3) {
        console.log("ALERT: Account Locked for " + username + " due to too many failed attempts.");
        return { status: 403, error: "Account Locked" };
    }

    // Logic from our Identity Service
    if (username === "omondi" && password === "1234") {
        loginAttempts[username] = 0; // Reset on success
        return { status: 200, access: "GRANTED" };
    } else {
        loginAttempts[username] = (loginAttempts[username] || 0) + 1;
        return { status: 401, error: "Invalid Credentials" };
    }
}
