const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    creds: { user: "robin", pass: "1234" },
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'auth', 'academy', 'tools', 'weather', 'admin'].forEach(sec => {
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
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- GLOBAL BROADCAST LOGIC ---
    getBroadcastHtml: function() {
        const msg = localStorage.getItem('agri_global_msg');
        if(!msg) return '';
        return '<div style="background:#ffcc00; color:#000; padding:12px; font-weight:bold; text-align:center; border-bottom:2px solid #000; position:relative;">' +
               '📢 ADMIN NOTICE: ' + msg + 
               (this.isAdmin ? '<span onclick="agriEngine.clearBroadcast()" style="float:right; cursor:pointer; padding:0 10px;">[X]</span>' : '') +
               '</div>';
    },
    postBroadcast: function() {
        const msg = prompt("Enter the message for ALL students:");
        if(msg) {
            localStorage.setItem('agri_global_msg', msg);
            this.sync();
        }
    },
    clearBroadcast: function() {
        localStorage.removeItem('agri_global_msg');
        this.sync();
    },
    // --- ADMIN DASHBOARD ---
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white; border:1px solid #333;">';
        if(this.isAdmin) {
            h += '<h3 style="color:lime; margin-top:0;">👨‍✈️ Master Controller</h3>';
            h += '<button class="btn" style="width:100%; background:#ff9100; color:black; font-weight:bold; margin-bottom:10px;" onclick="agriEngine.postBroadcast()">📢 Send Global Broadcast</button>';
            h += '<input type="text" id="admin-search" onkeyup="agriEngine.filterRoster()" placeholder="Search Roster..." style="width:92%; padding:8px; background:#111; color:lime; border:1px solid #333; margin-bottom:10px;">';
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<div id="roster-container" style="font-size:10px; max-height:180px; overflow-y:auto; background:#050505;">';
            h += '<table style="width:100%; border-collapse:collapse;" id="roster-table">';
            roster.forEach(u => {
                const p = Math.round(((u.month * 4 + u.step) / 16) * 100);
                h += '<tr class="roster-row" style="border-bottom:1px solid #111;">';
                h += '<td style="padding:6px;">' + u.name + ' (' + p + '%)</td>';
                h += '<td align="right" style="color:#666;">' + (u.lastLogin ? u.lastLogin.split(',')[0] : 'N/A') + '</td></tr>';
            });
            h += '</table></div>';
            h += '<button class="btn" style="width:100%; margin-top:10px; background:#d00000;" onclick="agriEngine.adminLogout()">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        }
        return h + '</div>';
    },
    // --- SUPPORTING LOGIC ---
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    filterRoster: function() {
        const input = document.getElementById("admin-search").value.toUpperCase();
        const tr = document.getElementById("roster-table").getElementsByClassName("roster-row");
        for (let i = 0; i < tr.length; i++) {
            const txt = tr[i].innerText || tr[i].textContent;
            tr[i].style.display = txt.toUpperCase().indexOf(input) > -1 ? "" : "none";
        }
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal Login</h3><input type="number" id="login-id" placeholder="ID Number"><button class="btn" onclick="agriEngine.portalLogin()">Access Portal</button></div>';
        return '<div class="card"><h3>👋 Welcome, ' + this.currentUser.name + '</h3><button class="btn" onclick="agriEngine.portalLogout()">Exit Portal</button></div>';
    },
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) { this.currentUser = user; localStorage.setItem('agri_logged_in_user', JSON.stringify(user)); this.sync(); }
        else alert("ID Not Found.");
    },
    portalLogout: function() { localStorage.removeItem('agri_logged_in_user'); this.currentUser = null; this.sync(); }
};
agriEngine.init();
