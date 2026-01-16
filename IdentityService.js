/**
 * AgriMastery Identity Service
 * Handles secure login for the platform
 */

const users = [
    { username: "omondi", password: "1234", role: "ADMIN" }
];

function login(inputUser, inputPass) {
    console.log("--- Login Attempt ---");
    const user = users.find(u => u.username === inputUser && u.password === inputPass);

    if (user) {
        console.log("ACCESS GRANTED: Welcome " + user.username);
        return { success: true, role: user.role, token: "JWT_SECURE_HASH_99" };
    } else {
        console.log("ACCESS DENIED: Invalid Credentials");
        return { success: false };
    }
}

// Test the login
login("omondi", "1234");
