const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        blacklist: JSON.parse(localStorage.getItem('agri_blacklist') || '[]')
    },
    courses: [
        { id: "C1", title: "Professional Maize Mastery", icon: "🌽" },
        { id: "C2", title: "Advanced Soil Science", icon: "🌱" },
        { id: "C3", title: "Climate-Smart Irrigation", icon: "💧" },
        { id: "C4", title: "Livestock Management Pro", icon: "🐄" },
        { id: "C5", title: "Agribusiness & Export", icon: "📈" }
    ],
    init: function() {
        // --- BLACKLIST CHECK ---
        if (this.state.user && this.state.blacklist.includes(this.state.user.email)) {
            this.renderSuspendedScreen();
            return;
        }
        document.body.innerHTML = '<div id="admin-zone"></div><div id="student-zone"></div>';
        this.render();
    },
    render: function() {
        this.renderAdminZone();
        this.renderStudentZone();
    },
    // --- ADMIN MODULE WITH ENFORCEMENT ---
    renderAdminZone: function() {
        const zone = document.getElementById('admin-zone');
        if (!this.state.isAdmin) {
            zone.innerHTML = '<div style="background:#1a1a1a; padding:10px; text-align:center; cursor:pointer;" ondblclick="agriEngine.unlock()">...</div>';
            return;
        }
        zone.innerHTML = '<div style="background:#0a0a0a; color:white; padding:20px; border-bottom:4px solid #cc0000; font-family:sans-serif;">' +
            '<h2 style="color:#ff4d4d; margin:0;">🛡️ SECURITY ENFORCEMENT PANEL</h2>' +
            '<div style="margin-top:15px; background:#111; padding:15px; border-radius:10px;">' +
                '<table style="width:100%; text-align:left; font-size:13px;">' +
                    '<tr style="color:#666;"><th>STUDENT</th><th>EMAIL</th><th>STATUS</th><th>ACTION</th></tr>' +
                    this.state.directory.map(s => {
                        const isBanned = this.state.blacklist.includes(s.email);
                        return '<tr>' +
                            '<td>' + s.name + '</td>' +
                            '<td>' + s.email + '</td>' +
                            '<td style="color:' + (isBanned ? 'red' : '#0f0') + '">' + (isBanned ? 'SUSPENDED' : 'ACTIVE') + '</td>' +
                            '<td>' +
                                (isBanned ? 
                                '<button onclick="agriEngine.restoreStudent(\''+s.email+'\')" style="background:#2d6a4f; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Restore</button>' :
                                '<button onclick="agriEngine.forceLogout(\''+s.email+'\')" style="background:#cc0000; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Force Logout</button>') +
                            '</td>' +
                        '</tr>';
                    }).join('') +
                '</table>' +
            '</div>' +
        '</div>';
    },
    // --- STUDENT MODULE ---
    renderStudentZone: function() {
        const zone = document.getElementById('student-zone');
        if (!this.state.user) { zone.innerHTML = '<div style="padding:50px; text-align:center;">Please Register or Login</div>'; return; }
        zone.innerHTML = '<div style="background:#f0f4f8; padding:40px 20px; min-height:100vh;">' +
            '<div style="max-width:1100px; margin:auto;">' +
                '<div style="background:#2d6a4f; color:white; padding:30px; border-radius:15px;">' +
                    '<h1>Dashboard: ' + this.state.user.name + '</h1>' +
                '</div>' +
                '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-top:20px;">' +
                    this.courses.map(c => '<div style="background:white; padding:20px; border-radius:10px; text-align:center;">' +
                        '<h3>' + c.icon + '</h3><h4>' + c.title + '</h4>' +
                    '</div>').join('') +
                '</div>' +
            '</div>' +
        '</div>';
    },
    // --- ENFORCEMENT LOGIC ---
    forceLogout: function(email) {
        if(confirm("Kick this student out and suspend access?")) {
            this.state.blacklist.push(email);
            localStorage.setItem('agri_blacklist', JSON.stringify(this.state.blacklist));
            location.reload();
        }
    },
    restoreStudent: function(email) {
        this.state.blacklist = this.state.blacklist.filter(e => e !== email);
        localStorage.setItem('agri_blacklist', JSON.stringify(this.state.blacklist));
        location.reload();
    },
    renderSuspendedScreen: function() {
        document.body.innerHTML = '<div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#000; color:white; font-family:sans-serif; text-align:center;">' +
            '<div><h1 style="color:red; font-size:50px;">🛑 ACCESS SUSPENDED</h1>' +
            '<p>Your account has been logged out by the Administrator.</p>' +
            '<button onclick="localStorage.removeItem(\'agri_student\');location.reload();" style="padding:10px 20px; border:none; background:white; cursor:pointer; font-weight:bold;">Return to Home</button></div>' +
        '</div>';
    },
    unlock: function() {
        if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
