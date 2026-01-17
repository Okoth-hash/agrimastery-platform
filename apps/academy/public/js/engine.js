const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')) || { name: "Guest User", email: "guest@agri.com", course: "Maize Mastery", page: 12 },
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[{"name":"John Doe","email":"john@maize.com","course":"Maize Mastery","page":45},{"name":"Mary Wanjiku","email":"mary@soil.com","course":"Advanced Soil Science","page":12}]')
    },
    courses: [
        { id: "C1", title: "Professional Maize Mastery", duration: "12 Weeks", icon: "🌽" },
        { id: "C2", title: "Advanced Soil Science", duration: "8 Weeks", icon: "🌱" },
        { id: "C3", title: "Climate-Smart Irrigation", duration: "10 Weeks", icon: "💧" },
        { id: "C4", title: "Livestock Management Pro", duration: "14 Weeks", icon: "🐄" },
        { id: "C5", title: "Agribusiness & Export", duration: "6 Weeks", icon: "📈" }
    ],
    init: function() {
        document.body.innerHTML = '<div id="admin-zone"></div><div id="student-zone"></div>';
        this.render();
    },
    render: function() {
        this.renderAdminZone();
        this.renderStudentZone();
    },
    // --- ADMIN MODULE WITH LIVE PREVIEW TRIGGER ---
    renderAdminZone: function() {
        const zone = document.getElementById('admin-zone');
        if (!this.state.isAdmin) {
            zone.innerHTML = '<div style="background:#1a1a1a; color:#444; padding:8px; text-align:center; font-size:11px; cursor:pointer;" ondblclick="agriEngine.unlockAdmin()">ADMIN SECURE ACCESS (Double-tap)</div>';
            return;
        }
        zone.innerHTML = '<div style="background:#0a0a0a; color:white; padding:20px; border-bottom:4px solid #2d6a4f; font-family:sans-serif;">' +
            '<div style="max-width:1100px; margin:auto; display:flex; justify-content:space-between; align-items:center;">' +
                '<div><h2 style="color:#0f0; margin:0;">⚡ COMMAND CENTER</h2><small style="color:#666;">Live Network Monitor Active</small></div>' +
                '<button onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();" style="background:#ef4444; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Exit Admin</button>' +
            '</div>' +
            '<div style="max-width:1100px; margin:15px auto 0; background:#111; padding:15px; border-radius:10px; border:1px solid #333;">' +
                '<table style="width:100%; text-align:left; font-size:13px;">' +
                    '<tr style="color:#888;"><th>STUDENT</th><th>COURSE</th><th>LAST PAGE</th><th>ACTION</th></tr>' +
                    this.state.directory.map(s => '<tr>' +
                        '<td style="padding:8px 0;">' + s.name + '</td>' +
                        '<td>' + s.course + '</td>' +
                        '<td>' + s.page + '</td>' +
                        '<td><button onclick="agriEngine.previewStudent(\''+s.name+'\')" style="background:#2d6a4f; color:white; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:11px;">View Live</button></td>' +
                    '</tr>').join('') +
                '</table>' +
            '</div>' +
        '</div>';
    },
    // --- STUDENT MODULE ---
    renderStudentZone: function() {
        const zone = document.getElementById('student-zone');
        const u = this.state.user;
        zone.innerHTML = '<div style="background:#f0f4f8; padding:40px 20px; min-height:100vh; font-family:sans-serif;">' +
            '<div style="max-width:1100px; margin:auto;">' +
                '<div id="student-banner" style="background:linear-gradient(135deg, #2d6a4f, #1b4332); color:white; padding:40px; border-radius:20px; margin-bottom:30px;">' +
                    '<h1>Dashboard: ' + u.name + '</h1>' +
                    '<p>Enrollment: ' + (u.course || "Select a Course below") + '</p>' +
                '</div>' +
                '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">' +
                    this.courses.map(c => '<div style="background:white; padding:25px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">' +
                        '<h3>' + c.icon + ' ' + c.title + '</h3>' +
                        '<button style="width:100%; padding:10px; background:#f0f2f5; border:none; border-radius:8px; cursor:pointer;">Enter Course</button>' +
                    '</div>').join('') +
                '</div>' +
            '</div>' +
        '</div>';
    },
    // --- APPENDED LOGIC ---
    previewStudent: function(name) {
        const found = this.state.directory.find(s => s.name === name);
        if(found) {
            this.state.user = found; // Temporarily swap the view
            this.renderStudentZone();
            document.getElementById('student-zone').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('student-banner').style.border = "4px solid #0f0";
            alert("Now viewing Live Preview for: " + name);
        }
    },
    unlockAdmin: function() {
        const p = prompt("Admin PIN:");
        if(p === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
