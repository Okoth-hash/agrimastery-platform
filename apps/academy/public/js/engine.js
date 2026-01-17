const agriEngine = {
    // --- MODULE 1: GLOBAL STATE ---
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1,
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        notices: JSON.parse(localStorage.getItem('agri_notices') || '[]'),
        // Updated Directory with Course Assignment
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[{"id":"S001","name":"John Doe","course":"Maize","progress":45},{"id":"S002","name":"Mary Wanjiku","course":"Soil Science","progress":12}]')
    },
    // --- MODULE 2: CONTENT ---
    market: [ { id: 101, loc: "Nairobi", price: "4,200" } ],
    chapters: [ { id: 1, title: "Course Introduction", content: "Welcome to your specialized professional track." } ],
    // --- MODULE 3: RENDERER ---
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f4f7f6; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        let html = '';
        if(this.state.isAdmin) {
            html += this.renderAdminHeader();
            html += this.renderGroupedDirectory(); // Updated with Course Categories
            html += this.renderBroadcastPanel();
        } else {
            html += this.renderStudentView();
        }
        view.innerHTML = html;
    },
    renderAdminHeader: function() {
        return '<div style="background:#1a1a1a; color:white; padding:20px; border-bottom:4px solid #2d6a4f;">' +
            '<div style="max-width:900px; margin:auto; display:flex; justify-content:space-between; align-items:center;">' +
                '<h2>⚡ Command Center</h2>' +
                '<button onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();" style="background:#ef4444; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">Logout</button>' +
            '</div>' +
        '</div>';
    },
    // --- MODULE 4: GROUPED DIRECTORY (Course Specific) ---
    renderGroupedDirectory: function() {
        return '<div style="max-width:900px; margin:20px auto; background:white; padding:20px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
            '<h3 style="color:#2d6a4f;">👥 Student Directory by Course</h3>' +
            '<table style="width:100%; border-collapse:collapse; font-size:14px;">' +
                '<tr style="background:#f0f2f5; text-align:left;">' +
                    '<th style="padding:10px;">Student Name</th>' +
                    '<th style="padding:10px;">Course Track</th>' +
                    '<th style="padding:10px;">Progress</th>' +
                    '<th style="padding:10px;">Manage</th>' +
                '</tr>' +
                this.state.directory.map((s, index) => '<tr>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;"><b>' + s.name + '</b></td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;"><span style="background:#e8f5e9; color:#2e7d32; padding:3px 8px; border-radius:10px; font-size:11px;">' + s.course + '</span></td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">Page ' + s.progress + '</td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' +
                        '<button onclick="agriEngine.targetStudent(\''+s.name+'\')" style="color:#007bff; border:none; background:none; cursor:pointer; font-weight:bold; margin-right:10px;">PM</button>' +
                        '<button onclick="agriEngine.removeStudent('+index+')" style="color:#ef4444; border:none; background:none; cursor:pointer;">Del</button>' +
                    '</td>' +
                '</tr>').join('') +
            '</table>' +
        '</div>';
    },
    renderBroadcastPanel: function() {
        return '<div style="max-width:900px; margin:20px auto; background:#1a1a1a; color:white; padding:20px; border-radius:15px;">' +
            '<h3>📢 Targeted Broadcast</h3>' +
            '<select id="groupSelect" style="width:100%; padding:10px; border-radius:5px; margin-bottom:10px; background:#333; color:white;">' +
                '<option value="all">All Students</option>' +
                '<option value="Maize">Maize Mastery Group</option>' +
                '<option value="Soil Science">Soil Science Group</option>' +
            '</select>' +
            '<input id="targetInput" placeholder="Individual Name (Optional)" style="width:100%; padding:10px; border-radius:5px; margin-bottom:10px; background:#333; color:white; border:1px solid #444;">' +
            '<textarea id="noticeMsg" placeholder="Type group announcement..." style="width:100%; padding:10px; border-radius:5px; min-height:80px; box-sizing:border-box;"></textarea>' +
            '<button onclick="agriEngine.sendNotice()" style="width:100%; margin-top:10px; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Blast Message</button>' +
        '</div>';
    },
    targetStudent: function(name) {
        document.getElementById('targetInput').value = name;
        document.getElementById('groupSelect').value = "all";
        document.getElementById('noticeMsg').focus();
    },
    sendNotice: function() {
        const group = document.getElementById('groupSelect').value;
        const individual = document.getElementById('targetInput').value;
        const target = individual || group;
        const msg = document.getElementById('noticeMsg').value;
        if(msg) {
            this.state.notices.push({ target, msg, date: new Date().toLocaleDateString() });
            localStorage.setItem('agri_notices', JSON.stringify(this.state.notices));
            alert("Broadcast sent to: " + target);
            location.reload();
        }
    },
    removeStudent: function(index) {
        if(confirm("Permanently delete student?")) {
            this.state.directory.splice(index, 1);
            localStorage.setItem('agri_directory', JSON.stringify(this.state.directory));
            this.render();
        }
    },
    renderStudentView: function() {
        const userCourse = this.state.user ? this.state.user.course : "all";
        const myNotices = this.state.notices.filter(n => 
            n.target === 'all' || 
            n.target === userCourse || 
            (this.state.user && n.target === this.state.user.name)
        );
        let noticeHtml = myNotices.map(n => '<div style="background:#fff3cd; padding:15px; border-radius:10px; border-left:5px solid #ffc107; margin-bottom:15px;"><b>🔔 Announcement:</b> ' + n.msg + '</div>').join('');
        return '<div style="max-width:800px; margin:20px auto; padding:0 20px;">' + noticeHtml +
            '<div style="background:white; padding:30px; border-radius:15px; border-left:10px solid #2d6a4f;">' +
                '<h3>Academy Module</h3><p>Your course-specific content is loading...</p>' +
            '</div>' +
        '</div>';
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
