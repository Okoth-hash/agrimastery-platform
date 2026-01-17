const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1,
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        notices: JSON.parse(localStorage.getItem('agri_notices') || '[]'),
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[{"id":"S001","name":"John Doe","course":"Maize","progress":45},{"id":"S002","name":"Mary Wanjiku","course":"Soil Science","progress":12}]')
    },
    market: [ { id: 101, loc: "Nairobi", price: "4,200" } ],
    chapters: [ { id: 1, title: "Course Introduction", content: "Welcome to your specialized professional track." } ],
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f4f7f6; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        let html = '';
        if(this.state.isAdmin) {
            html += this.renderAdminHeader();
            html += this.renderGroupedDirectory();
            html += this.renderBroadcastPanel();
        } else {
            html += this.renderStudentView();
        }
        view.innerHTML = html;
    },
    // --- HIDDEN SECURITY LOGIC ---
    secretUnlock: function() {
        const pass = prompt("Command Center Security Key:");
        if(pass === "1234") {
            localStorage.setItem('agri_admin_mode', 'true');
            location.reload();
        }
    },
    renderAdminHeader: function() {
        return '<div style="background:#1a1a1a; color:white; padding:20px; border-bottom:4px solid #2d6a4f;">' +
            '<div style="max-width:900px; margin:auto; display:flex; justify-content:space-between; align-items:center;">' +
                '<h2>⚡ Command Center</h2>' +
                '<button onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();" style="background:#ef4444; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">Logout</button>' +
            '</div>' +
        '</div>';
    },
    renderGroupedDirectory: function() {
        return '<div style="max-width:900px; margin:20px auto; background:white; padding:20px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
            '<h3 style="color:#2d6a4f;">👥 Student Directory</h3>' +
            '<table style="width:100%; border-collapse:collapse; font-size:14px;">' +
                '<tr style="background:#f0f2f5; text-align:left;">' +
                    '<th style="padding:10px;">Name</th><th style="padding:10px;">Course</th><th style="padding:10px;">Manage</th>' +
                '</tr>' +
                this.state.directory.map((s, index) => '<tr>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' + s.name + '</td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' + s.course + '</td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' +
                        '<button onclick="agriEngine.targetStudent(\''+s.name+'\')" style="color:#007bff; border:none; background:none; cursor:pointer;">Message</button>' +
                        '<button onclick="agriEngine.removeStudent('+index+')" style="color:#ef4444; border:none; background:none; cursor:pointer; margin-left:10px;">Remove</button>' +
                    '</td>' +
                '</tr>').join('') +
            '</table>' +
        '</div>';
    },
    renderBroadcastPanel: function() {
        return '<div style="max-width:900px; margin:20px auto; background:#1a1a1a; color:white; padding:20px; border-radius:15px;">' +
            '<h3>📢 Send Notice</h3>' +
            '<input id="targetInput" placeholder="Target Group or Name" style="width:100%; padding:10px; border-radius:5px; margin-bottom:10px; background:#333; color:white; border:1px solid #444;">' +
            '<textarea id="noticeMsg" placeholder="Message content..." style="width:100%; padding:10px; border-radius:5px; min-height:80px; box-sizing:border-box;"></textarea>' +
            '<button onclick="agriEngine.sendNotice()" style="width:100%; margin-top:10px; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Blast Message</button>' +
        '</div>';
    },
    renderStudentView: function() {
        const myNotices = this.state.notices.filter(n => n.target === 'all' || (this.state.user && n.target === this.state.user.name));
        let noticeHtml = myNotices.map(n => '<div style="background:#fff3cd; padding:15px; border-radius:10px; border-left:5px solid #ffc107; margin-bottom:15px;"><b>🔔 Admin:</b> ' + n.msg + '</div>').join('');
        return '<div style="max-width:800px; margin:20px auto; padding:0 20px;">' +
            noticeHtml +
            '<div style="background:white; padding:30px; border-radius:15px; border-left:10px solid #2d6a4f;">' +
                '<h3 ondblclick="agriEngine.secretUnlock()" style="cursor:default; user-select:none;">Academy Dashboard</h3>' +
                '<p>Your specialized course content is ready.</p>' +
                '<div style="height:100px;"></div>' +
            '</div>' +
        '</div>';
    },
    targetStudent: function(name) { document.getElementById('targetInput').value = name; },
    sendNotice: function() {
        const t = document.getElementById('targetInput').value || 'all';
        const m = document.getElementById('noticeMsg').value;
        if(m) {
            this.state.notices.push({ target: t, msg: m });
            localStorage.setItem('agri_notices', JSON.stringify(this.state.notices));
            location.reload();
        }
    },
    removeStudent: function(i) {
        if(confirm("Delete student record?")) { this.state.directory.splice(i, 1); localStorage.setItem('agri_directory', JSON.stringify(this.state.directory)); this.render(); }
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
