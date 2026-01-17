const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1,
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        notices: JSON.parse(localStorage.getItem('agri_notices') || '[]'),
        // Mock Database of Registered Students
        directory: [
            { id: "S001", name: "John Doe", phone: "254712345678", progress: 45, group: "Maize" },
            { id: "S002", name: "Mary Wanjiku", phone: "254722334455", progress: 12, group: "Maize" },
            { id: "S003", name: "Robin Okoth", phone: "254742178833", progress: 98, group: "Admin" }
        ]
    },
    market: [ { id: 101, loc: "Nairobi", price: "4,200" }, { id: 102, loc: "Eldoret", price: "3,800" } ],
    chapters: [ { id: 1, title: "Soil Chemistry", content: "Focus on Nitrogen levels." } ],
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f4f7f6; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        let html = '';
        if(this.state.isAdmin) {
            html += this.renderAdminHeader();
            html += this.renderStudentDirectory(); // NEW: Manage Students
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
    // --- NEW: STUDENT DIRECTORY MODULE ---
    renderStudentDirectory: function() {
        return '<div style="max-width:900px; margin:20px auto; background:white; padding:20px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
            '<h3 style="color:#2d6a4f;">👥 Student Directory</h3>' +
            '<table style="width:100%; border-collapse:collapse; font-size:14px;">' +
                '<tr style="background:#f0f2f5; text-align:left;">' +
                    '<th style="padding:10px;">Name</th><th style="padding:10px;">Group</th><th style="padding:10px;">Progress</th><th style="padding:10px;">Action</th>' +
                '</tr>' +
                this.state.directory.map(s => '<tr>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' + s.name + '</td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' + s.group + '</td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">Page ' + s.progress + '</td>' +
                    '<td style="padding:10px; border-bottom:1px solid #eee;">' +
                        '<button onclick="agriEngine.targetStudent(\''+s.name+'\')" style="color:#007bff; border:none; background:none; cursor:pointer; font-weight:bold;">Message</button>' +
                    '</td>' +
                '</tr>').join('') +
            '</table>' +
        '</div>';
    },
    renderBroadcastPanel: function() {
        return '<div style="max-width:900px; margin:20px auto; background:#1a1a1a; color:white; padding:20px; border-radius:15px;">' +
            '<h3>📢 Broadcast / Private Message</h3>' +
            '<p style="font-size:12px; color:#aaa;">To send a private message, click "Message" in the directory above.</p>' +
            '<input id="targetInput" placeholder="Target: All Students" style="width:100%; padding:10px; border-radius:5px; margin-bottom:10px; background:#333; color:white; border:1px solid #444;">' +
            '<textarea id="noticeMsg" placeholder="Type message..." style="width:100%; padding:10px; border-radius:5px; min-height:80px; box-sizing:border-box;"></textarea>' +
            '<button onclick="agriEngine.sendNotice()" style="width:100%; margin-top:10px; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Send Message</button>' +
        '</div>';
    },
    targetStudent: function(name) {
        document.getElementById('targetInput').value = name;
        document.getElementById('noticeMsg').focus();
    },
    sendNotice: function() {
        const target = document.getElementById('targetInput').value || 'all';
        const msg = document.getElementById('noticeMsg').value;
        if(msg) {
            const allNotices = this.state.notices;
            allNotices.push({ target, msg, date: new Date().toLocaleDateString() });
            localStorage.setItem('agri_notices', JSON.stringify(allNotices));
            alert("Sent to: " + target);
            location.reload();
        }
    },
    renderStudentView: function() {
        const myNotices = this.state.notices.filter(n => n.target.toLowerCase() === 'all' || (this.state.user && n.target === this.state.user.name));
        let noticeHtml = myNotices.map(n => '<div style="background:#fff3cd; padding:15px; border-radius:10px; border-left:5px solid #ffc107; margin-bottom:15px;"><b>🔔 Admin Message:</b> ' + n.msg + '</div>').join('');
        const ch = this.chapters[0];
        return '<div style="max-width:800px; margin:20px auto; padding:0 20px;">' + noticeHtml +
            '<div style="background:white; padding:30px; border-radius:15px; border-left:10px solid #2d6a4f;">' +
                '<h3>' + ch.title + '</h3><p>' + ch.content + '</p>' +
            '</div>' +
        '</div>';
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
