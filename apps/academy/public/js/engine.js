const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1,
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        notices: JSON.parse(localStorage.getItem('agri_notices') || '[]')
    },
    // --- MARKET DATABASE ---
    market: [
        { id: 101, loc: "Nairobi", price: "4,200" },
        { id: 102, loc: "Eldoret", price: "3,800" }
    ],
    // --- ACADEMY DATABASE ---
    chapters: [
        { id: 1, title: "Soil Chemistry", content: "Focus on Nitrogen levels." },
        { id: 2, title: "Seed Selection", content: "Choose certified hybrids." }
    ],
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f4f7f6; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        let html = '';
        if(this.state.isAdmin) {
            html += this.renderAdminDashboard();
            html += this.renderDatabaseManager();
            html += this.renderBroadcastPanel();
        } else {
            html += this.renderStudentView();
        }
        view.innerHTML = html;
    },
    // --- NEW: DATABASE MANAGEMENT UI ---
    renderDatabaseManager: function() {
        return '<div style="max-width:800px; margin:20px auto; background:white; padding:20px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
            '<h3 style="color:#2d6a4f;">📂 Database Management</h3>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">' +
                '<div><h4>Market Prices</h4>' + 
                this.market.map(m => '<div style="font-size:12px; border-bottom:1px solid #eee; padding:5px 0;">' + m.loc + ': ' + m.price + ' <button style="font-size:9px; color:red; border:none; background:none; cursor:pointer;">Edit</button></div>').join('') +
                '</div>' +
                '<div><h4>Academy Chapters</h4>' + 
                this.chapters.map(c => '<div style="font-size:12px; border-bottom:1px solid #eee; padding:5px 0;">' + c.id + '. ' + c.title + ' <button style="font-size:9px; color:red; border:none; background:none; cursor:pointer;">Edit Content</button></div>').join('') +
                '</div>' +
            '</div>' +
            '<button style="margin-top:15px; background:#2d6a4f; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer; width:100%;">Add New Database Entry +</button>' +
        '</div>';
    },
    // --- NEW: BROADCAST PANEL ---
    renderBroadcastPanel: function() {
        return '<div style="max-width:800px; margin:20px auto; background:#1a1a1a; color:white; padding:20px; border-radius:15px;">' +
            '<h3>📢 Broadcast Notice</h3>' +
            '<select id="targetGroup" style="width:100%; padding:10px; border-radius:5px; margin-bottom:10px;">' +
                '<option value="all">All Students</option>' +
                '<option value="maize">Maize Group</option>' +
                '<option value="individual">Specific ID (Individual)</option>' +
            '</select>' +
            '<textarea id="noticeMsg" placeholder="Type message here..." style="width:100%; padding:10px; border-radius:5px; min-height:80px; box-sizing:border-box;"></textarea>' +
            '<button onclick="agriEngine.sendNotice()" style="width:100%; margin-top:10px; padding:12px; background:#007bff; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Send Broadcast</button>' +
        '</div>';
    },
    sendNotice: function() {
        const target = document.getElementById('targetGroup').value;
        const msg = document.getElementById('noticeMsg').value;
        if(msg) {
            const newNotice = { target, msg, date: new Date().toLocaleDateString() };
            const allNotices = this.state.notices;
            allNotices.push(newNotice);
            localStorage.setItem('agri_notices', JSON.stringify(allNotices));
            alert("Broadcast sent to: " + target);
            location.reload();
        }
    },
    renderStudentView: function() {
        // Filter notices for this specific student
        const myNotices = this.state.notices.filter(n => n.target === 'all' || (this.state.user && n.target === this.state.user.name));
        let noticeHtml = '';
        if(myNotices.length > 0) {
            noticeHtml = myNotices.map(n => '<div style="background:#fff3cd; padding:15px; border-radius:10px; border-left:5px solid #ffc107; margin-bottom:15px;"><b>🔔 Notice:</b> ' + n.msg + '</div>').join('');
        }
        const ch = this.chapters.find(c => c.id === this.state.page) || this.chapters[0];
        return '<div style="max-width:800px; margin:20px auto; padding:0 20px;">' +
            noticeHtml +
            '<div style="background:white; padding:30px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
                '<h3>' + ch.title + '</h3>' +
                '<p>' + ch.content + '</p>' +
                '<button onclick="agriEngine.move(1)" style="padding:10px 20px; background:#2d6a4f; color:white; border:none; border-radius:5px; cursor:pointer;">Next Chapter</button>' +
            '</div>' +
        '</div>';
    },
    move: function(dir) {
        this.state.page += dir;
        localStorage.setItem('agri_progress', this.state.page);
        this.render();
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
