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
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- ENHANCED PORTAL LOGIC ---
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === id);
        if(idx !== -1) {
            // Update last login timestamp
            roster[idx].lastLogin = new Date().toLocaleString();
            localStorage.setItem('agri_master_roster', JSON.stringify(roster));
            this.currentUser = roster[idx];
            localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
            this.sync();
        } else {
            alert("ID not found.");
        }
    },
    portalRegister: function() {
        const n = document.getElementById('reg-name').value;
        const i = document.getElementById('reg-id').value;
        if(!n || !i) return alert("Fields required.");
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const newUser = { 
            name: n, 
            id: i, 
            month: 0, 
            step: 0, 
            lastLogin: new Date().toLocaleString() 
        };
        roster.push(newUser);
        localStorage.setItem('agri_master_roster', JSON.stringify(roster));
        this.currentUser = newUser;
        localStorage.setItem('agri_logged_in_user', JSON.stringify(newUser));
        this.sync();
    },
    // --- ADMIN DASHBOARD WITH TIMESTAMPS ---
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white; border: 1px solid #333;">';
        if(this.isAdmin) {
            h += '<h3 style="color:lime; margin-top:0;">👨‍✈️ Admin Intelligence</h3>';
            h += '<input type="text" id="admin-search" onkeyup="agriEngine.filterRoster()" placeholder="Filter Students..." style="width:92%; padding:8px; background:#111; color:lime; border:1px solid #333; margin-bottom:10px;">';
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<div id="roster-container" style="font-size:10px; max-height:250px; overflow-y:auto; background:#050505;">';
            h += '<table style="width:100%; border-collapse:collapse;" id="roster-table">';
            h += '<tr style="background:#111; color:#888;"><th align="left">Name</th><th>%</th><th>Last Active</th></tr>';
            roster.forEach(u => {
                const p = Math.round(((u.month * 4 + u.step) / 16) * 100);
                const activeTime = u.lastLogin ? u.lastLogin.split(',')[0] : "N/A";
                h += '<tr class="roster-row" style="border-bottom:1px solid #111;">';
                h += '<td style="padding:8px 2px;"><b>' + u.name + '</b><br><span style="color:#555;">ID: '+u.id+'</span></td>';
                h += '<td align="center" style="color:lime;">' + p + '%</td>';
                h += '<td align="right" style="color:#888;">' + activeTime + '</td></tr>';
            });
            h += '</table></div>';
            h += '<button class="btn" style="width:100%; margin-top:10px; background:#d00000;" onclick="agriEngine.adminLogout()">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        }
        return h + '</div>';
    },
    filterRoster: function() {
        const input = document.getElementById("admin-search").value.toUpperCase();
        const tr = document.getElementById("roster-table").getElementsByClassName("roster-row");
        for (let i = 0; i < tr.length; i++) {
            const txt = tr[i].innerText || tr[i].textContent;
            tr[i].style.display = txt.toUpperCase().indexOf(input) > -1 ? "" : "none";
        }
    },
    adminLogin: function() { if(prompt("User:") === "robin" && prompt("Pass:") === "1234") { this.isAdmin = true; localStorage.setItem('agri_admin_active', 'true'); this.sync(); } },
    adminLogout: function() { this.isAdmin = false; localStorage.setItem('agri_admin_active', 'false'); this.sync(); },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal</h3><input type="number" id="login-id" placeholder="ID"><button class="btn" onclick="agriEngine.portalLogin()">Login</button><hr><input type="text" id="reg-name" placeholder="Name"><input type="number" id="reg-id" placeholder="ID"><button class="btn" onclick="agriEngine.portalRegister()">Register</button></div>';
        return '<div class="card"><h3>👋 ' + this.currentUser.name + '</h3><button class="btn" onclick="agriEngine.portalLogout()">Logout</button></div>';
    },
    portalLogout: function() { localStorage.removeItem('agri_logged_in_user'); this.currentUser = null; this.sync(); }
};
agriEngine.init();
