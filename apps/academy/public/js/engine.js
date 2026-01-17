const agriEngine = {
    // --- MODULE: DATA ---
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1,
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true'
    },
    chapters: [
        { id: 1, title: "Soil Chemistry", content: "Focus on Nitrogen levels for early maize growth." },
        { id: 2, title: "Seed Selection", content: "Choose certified hybrids for Kenya's Climate." }
    ],
    // --- MODULE: ADMIN LOGIC (New Append) ---
    admin: {
        stats: { totalStudents: 124, activeToday: 18, completions: 5 },
        toggle: function() {
            const pass = prompt("Enter Admin Security Key:");
            if(pass === "2026") {
                localStorage.setItem('agri_admin_mode', 'true');
                location.reload();
            }
        },
        logout: function() {
            localStorage.removeItem('agri_admin_mode');
            location.reload();
        }
    },
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f4f7f6; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        // 1. Always Render the Admin Header if in Admin Mode
        let html = '';
        if(this.state.isAdmin) {
            html += this.renderAdminDashboard();
        }
        // 2. Render Student Content or Login
        if (!this.state.user && !this.state.isAdmin) {
            html += this.renderLogin();
        } else {
            html += this.renderStudentManual();
        }
        view.innerHTML = html;
    },
    renderAdminDashboard: function() {
        return '<div style="background:#1a1a1a; color:white; padding:20px; border-bottom:4px solid #2d6a4f;">' +
            '<div style="max-width:800px; margin:auto; display:flex; justify-content:space-between; align-items:center;">' +
                '<div><h2 style="margin:0; color:#0f0;">⚡ Admin Command</h2><p style="font-size:12px; margin:0;">System Health: Optimal</p></div>' +
                '<button onclick="agriEngine.admin.logout()" style="background:#cc0000; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Exit Admin</button>' +
            '</div>' +
            '<div style="max-width:800px; margin:15px auto 0; display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">' +
                '<div style="background:#333; padding:10px; border-radius:8px; text-align:center;"><b>' + this.admin.stats.totalStudents + '</b><br><small>Students</small></div>' +
                '<div style="background:#333; padding:10px; border-radius:8px; text-align:center;"><b>' + this.admin.stats.activeToday + '</b><br><small>Active</small></div>' +
                '<div style="background:#333; padding:10px; border-radius:8px; text-align:center;"><b>' + this.admin.stats.completions + '</b><br><small>Certificates</small></div>' +
            '</div>' +
        '</div>';
    },
    renderLogin: function() {
        return '<div style="max-width:400px; margin:100px auto; background:white; padding:30px; border-radius:15px; box-shadow:0 10px 25px rgba(0,0,0,0.1); text-align:center;">' +
            '<h2>AgriMastery Login</h2>' +
            '<input type="text" id="uName" placeholder="Student Name" style="width:100%; padding:12px; margin:10px 0; border:1px solid #ddd; border-radius:8px;">' +
            '<button onclick="agriEngine.login()" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Enter Academy</button>' +
            '<p onclick="agriEngine.admin.toggle()" style="font-size:11px; color:#999; margin-top:20px; cursor:pointer;">Admin Portal</p>' +
        '</div>';
    },
    renderStudentManual: function() {
        const ch = this.chapters.find(c => c.id === this.state.page) || this.chapters[0];
        const userName = this.state.user ? this.state.user.name : "Administrator";
        return '<div style="max-width:800px; margin:20px auto; padding:0 20px;">' +
            '<div style="background:white; padding:30px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
                '<small style="color:#666;">Student: ' + userName + ' | Page ' + this.state.page + ' of 1000</small>' +
                '<h3>' + ch.title + '</h3>' +
                '<p style="line-height:1.6; color:#444;">' + ch.content + '</p>' +
                '<div style="margin-top:20px; display:flex; gap:10px;">' +
                    '<button onclick="agriEngine.move(-1)" style="padding:10px 20px; border:1px solid #ddd; background:white; border-radius:5px; cursor:pointer;">Previous</button>' +
                    '<button onclick="agriEngine.move(1)" style="padding:10px 20px; background:#2d6a4f; color:white; border:none; border-radius:5px; cursor:pointer;">Next Chapter</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    },
    login: function() {
        const n = document.getElementById('uName').value;
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n}));
            location.reload();
        }
    },
    move: function(dir) {
        this.state.page += dir;
        if(this.state.page < 1) this.state.page = 1;
        localStorage.setItem('agri_progress', this.state.page);
        this.render();
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
