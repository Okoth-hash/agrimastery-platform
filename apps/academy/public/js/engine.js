const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
    creds: { user: "robin", pass: "1234" },
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const sections = ['broadcast', 'auth', 'academy', 'tools', 'weather', 'admin'];
        sections.forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('broadcast', this.getBroadcastHtml());
        this.updateSection('auth', this.getAuthHtml());
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('tools', this.getToolsHtml());
        this.updateSection('weather', this.getWeatherHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white; border: 1px solid #333;">';
        if(this.isAdmin) {
            h += '<h3 style="color:lime; margin-top:0;">👨‍✈️ Admin Console</h3>';
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<div style="font-size:11px; max-height:120px; overflow-y:auto; background:#111; padding:10px; border-radius:5px; margin-bottom:10px;">';
            h += '<b>REGISTERED STUDENTS (' + roster.length + ')</b><hr style="border:0; border-top:1px solid #222;">';
            roster.forEach(u => {
                const prog = Math.round(((u.month * 4 + u.step) / 16) * 100);
                h += '• ' + u.name + ' (' + prog + '%)<br>';
            });
            h += '</div>';
            h += '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">';
            h += '<button class="btn" onclick="agriEngine.exportData()" style="background:#4361ee; font-size:10px;">📥 Export CSV</button>';
            h += '<button class="btn" onclick="agriEngine.postBroadcast()" style="background:#ff9100; font-size:10px; color:black;">📢 Alert</button>';
            h += '</div>';
            h += '<button class="btn" onclick="agriEngine.logout()" style="width:100%; background:#d00000; margin-top:5px; font-size:10px;">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.login()">Admin Login</button>';
        }
        h += '</div>';
        return h;
    },
    exportData: function() {
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        if(roster.length === 0) { alert("No data to export."); return; }
        let csv = "Name,ID,DOB,Email,Gender,Month,Step,Progress%\n";
        roster.forEach(u => {
            const prog = Math.round(((u.month * 4 + u.step) / 16) * 100);
            csv += "","","","","",,,%\n;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'agrimastery_students_' + new Date().toLocaleDateString() + '.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    // Standard Logic 
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) return '<div class="card"><h3>🎓 Academy</h3><button class="btn" onclick="agriEngine.sync()">Start Registration</button></div>';
        return '<div class="card"><h3>📖 Current Lesson</h3><p>' + s.name + ': Month ' + (s.month+1) + '</p></div>';
    },
    getToolsHtml: function() { return '<div class="card"><h3>🛠️ Smart Tools</h3><p>10 Tools Active</p></div>'; },
    getBroadcastHtml: function() { const m = localStorage.getItem('agri_broadcast'); return m ? '<marquee style="background:#ff9100; padding:5px;">' + m + '</marquee>' : ''; },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    getAuthHtml: function() { return ''; },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } },
    logout: function() { this.isAdmin = false; this.sync(); },
    postBroadcast: function() { const m = prompt("Message:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } }
};
agriEngine.init();
