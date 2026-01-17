const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1,
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        notices: JSON.parse(localStorage.getItem('agri_notices') || '[]'),
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]')
    },
    // --- THE 5 PROFESSIONAL COURSES ---
    courses: [
        { id: "C1", title: "Professional Maize Mastery", duration: "12 Weeks", icon: "🌽" },
        { id: "C2", title: "Advanced Soil Science", duration: "8 Weeks", icon: "🌱" },
        { id: "C3", title: "Climate-Smart Irrigation", duration: "10 Weeks", icon: "💧" },
        { id: "C4", title: "Livestock Management Pro", duration: "14 Weeks", icon: "🐄" },
        { id: "C5", title: "Agribusiness & Export", duration: "6 Weeks", icon: "📈" }
    ],
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f0f4f8; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        if (this.state.isAdmin) {
            view.innerHTML = this.renderAdminHeader() + this.renderGroupedDirectory();
            return;
        }
        if (!this.state.user) {
            this.renderAuth(view);
        } else {
            this.renderStudentDashboard(view);
        }
    },
    // --- STUDENT AUTHENTICATION (Registration & PIN) ---
    renderAuth: function(view) {
        view.innerHTML = '<div style="max-width:450px; margin:40px auto; background:white; padding:35px; border-radius:20px; box-shadow:0 15px 35px rgba(0,0,0,0.1);">' +
            '<h2 style="color:#2d6a4f; text-align:center;">Student Onboarding</h2>' +
            '<input type="text" id="regName" placeholder="Full Name" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:8px;">' +
            '<input type="email" id="regEmail" placeholder="Email Address" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:8px;">' +
            '<input type="tel" id="regPhone" placeholder="Phone Number" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:8px;">' +
            '<select id="regGender" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:8px;">' +
                '<option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option>' +
            '</select>' +
            '<input type="password" id="regPin" maxlength="4" placeholder="Create 4-Digit PIN" style="width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:8px; text-align:center; font-size:20px; letter-spacing:10px;">' +
            '<button onclick="agriEngine.registerStudent()" style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-top:15px;">CREATE PROFILE</button>' +
            '<p onclick="agriEngine.secretUnlock()" style="text-align:center; color:#ccc; font-size:10px; margin-top:20px; cursor:pointer;">ADMIN</p>' +
        '</div>';
    },
    registerStudent: function() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const gender = document.getElementById('regGender').value;
        const pin = document.getElementById('regPin').value;
        if (name && email && phone && gender && pin.length === 4) {
            const student = { name, email, phone, gender, pin, joined: new Date().toLocaleDateString(), course: "General" };
            localStorage.setItem('agri_student', JSON.stringify(student));
            // Append to directory for Admin
            const dir = this.state.directory;
            dir.push(student);
            localStorage.setItem('agri_directory', JSON.stringify(dir));
            location.reload();
        } else {
            alert("Please complete all fields and use a 4-digit PIN.");
        }
    },
    // --- STUDENT E-LEARNING DASHBOARD ---
    renderStudentDashboard: function(view) {
        const u = this.state.user;
        view.innerHTML = '<div style="background:#2d6a4f; color:white; padding:30px; text-align:center;">' +
            '<h1>Welcome, ' + u.name + '</h1>' +
            '<p>Profile Updated: ' + u.email + ' | ' + u.gender + '</p>' +
        '</div>' +
        '<div style="max-width:1000px; margin:30px auto; padding:0 20px;">' +
            '<h2 style="color:#1b4332;">Select Your Course Track</h2>' +
            '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px; margin-top:20px;">' +
                this.courses.map(c => '<div style="background:white; padding:25px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.05); text-align:center; border-bottom:5px solid #2d6a4f;">' +
                    '<div style="font-size:40px;">' + c.icon + '</div>' +
                    '<h3 style="margin:15px 0 5px;">' + c.title + '</h3>' +
                    '<p style="color:#666; font-size:14px;">' + c.duration + ' Certification</p>' +
                    '<button onclick="alert(\'Entering ' + c.title + '...\')" style="margin-top:15px; padding:10px 20px; border-radius:5px; border:none; background:#2d6a4f; color:white; cursor:pointer; font-weight:bold;">ENTER CLASSROOM</button>' +
                '</div>').join('') +
            '</div>' +
            '<button onclick="localStorage.removeItem(\'agri_student\');location.reload();" style="display:block; margin:40px auto; padding:10px 20px; background:none; border:1px solid #ccc; border-radius:5px; cursor:pointer; color:#666;">Sign Out</button>' +
        '</div>';
    },
    secretUnlock: function() {
        const p = prompt("PIN:"); if(p === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }
    },
    renderAdminHeader: function() { return '<div style="background:#1a1a1a; color:white; padding:20px;"><h2>⚡ Admin Command</h2><button onclick="localStorage.clear();location.reload();">System Reset</button></div>'; },
    renderGroupedDirectory: function() { return '<div style="padding:20px;"><h3>Registered Students</h3>' + this.state.directory.map(s => '<div>' + s.name + ' (' + s.email + ')</div>').join('') + '</div>'; }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
