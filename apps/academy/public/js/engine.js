const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')) || { name: "Sample Student", email: "test@agri.com", gender: "Male", pin: "0000" },
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[{"name":"John Doe","email":"john@maize.com","course":"Maize","progress":45}]')
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
    // --- TOP SECTION: ADMIN COMMAND ---
    renderAdminZone: function() {
        const zone = document.getElementById('admin-zone');
        if (!this.state.isAdmin) {
            zone.innerHTML = '<div style="background:#1a1a1a; color:#555; padding:10px; text-align:center; font-size:12px; cursor:pointer;" ondblclick="agriEngine.unlockAdmin()">GHOST MODE ACTIVE (Double-click to Login)</div>';
            return;
        }
        zone.innerHTML = '<div style="background:#111; color:white; padding:20px; border-bottom:4px solid #2d6a4f; font-family:sans-serif;">' +
            '<div style="max-width:1100px; margin:auto; display:flex; justify-content:space-between; align-items:center;">' +
                '<h2 style="color:#0f0; margin:0;">⚡ ADMIN COMMAND CENTER</h2>' +
                '<div>' +
                    '<button onclick="agriEngine.exportCSV()" style="background:#2d6a4f; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold; margin-right:10px;">Export Data</button>' +
                    '<button onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();" style="background:#ef4444; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Logout Admin</button>' +
                '</div>' +
            '</div>' +
            '<div style="max-width:1100px; margin:15px auto 0; background:#222; padding:15px; border-radius:10px;">' +
                '<h4 style="margin:0 0 10px 0;">Student Registry</h4>' +
                '<div style="max-height:150px; overflow-y:auto;">' +
                    this.state.directory.map(s => '<div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:5px; font-size:13px;">' +
                        '<span>' + s.name + ' (' + s.email + ')</span>' +
                        '<span style="color:#2d6a4f;">' + s.course + '</span>' +
                    '</div>').join('') +
                '</div>' +
            '</div>' +
        '</div>';
    },
    // --- BOTTOM SECTION: STUDENT DASHBOARD ---
    renderStudentZone: function() {
        const zone = document.getElementById('student-zone');
        const u = this.state.user;
        zone.innerHTML = '<div style="background:#f0f4f8; padding:40px 20px; min-height:100vh; font-family:sans-serif;">' +
            '<div style="max-width:1100px; margin:auto;">' +
                '<div style="background:linear-gradient(135deg, #2d6a4f, #1b4332); color:white; padding:40px; border-radius:20px; margin-bottom:30px; box-shadow:0 10px 20px rgba(0,0,0,0.1);">' +
                    '<h1>Welcome back, ' + u.name + '</h1>' +
                    '<p style="opacity:0.9;">Profile: ' + u.email + ' | Gender: ' + u.gender + ' | Student PIN: ****</p>' +
                '</div>' +
                '<h2 style="color:#1b4332; margin-bottom:20px;">Your Professional Learning Path</h2>' +
                '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:25px;">' +
                    this.courses.map(c => '<div style="background:white; padding:30px; border-radius:20px; box-shadow:0 4px 15px rgba(0,0,0,0.05); border-top:6px solid #2d6a4f;">' +
                        '<span style="font-size:40px;">' + c.icon + '</span>' +
                        '<h3 style="margin:15px 0 5px; color:#1b4332;">' + c.title + '</h3>' +
                        '<p style="color:#666; font-size:14px;">Duration: ' + c.duration + '</p>' +
                        '<button onclick="alert(\'Loading ' + c.title + ' Curriculum...\')" style="width:100%; margin-top:20px; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">CONTINUE LEARNING</button>' +
                    '</div>').join('') +
                '</div>' +
            '</div>' +
        '</div>';
    },
    unlockAdmin: function() {
        const p = prompt("Enter Admin PIN:");
        if(p === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }
    },
    exportCSV: function() {
        let csv = "Name,Email,Course\n" + this.state.directory.map(s => s.name + "," + s.email + "," + s.course).join("\n");
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'students.csv'; a.click();
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
