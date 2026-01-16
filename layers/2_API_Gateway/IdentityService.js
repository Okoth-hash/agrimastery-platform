const adminUser = {
    username: "omondi",
    password: "1234",
    role: "SUPER_ADMIN"
};

function validateLogin(u, p) {
    if (u === adminUser.username && p === adminUser.password) {
        return { status: 200, message: "Authorized", role: adminUser.role };
    }
    return { status: 401, message: "Unauthorized" };
}
