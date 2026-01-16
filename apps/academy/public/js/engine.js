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
        // Tools and Weather remain stable
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white; border: 1px solid #333;">';
        if(this.isAdmin) {
            h += '<h3 style="color:lime; margin-top:0;">👨‍✈️ Admin Intelligence</h3>';
            // SEARCH BAR
            h += '<div style="margin-bottom:10px;">';
            h += '<input type="text" id="admin-search" onkeyup="agriEngine.filterRoster()" placeholder="Search Name or ID..." style="width:92%; padding:8px; background:#111; color:lime; border:1px solid #333; border-radius:4px; font-family:monospace;">';
            h += '</div>';
            // ROSTER TABLE
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<div id="roster-container" style="font-size:11px; max-height:200px; overflow-y:auto; border:1px solid #222; background:#050505;">';
            h += '<table style="width:100%; border-collapse:collapse;" id="roster-table">';
            h += '<tr style="background:#111; color:#888;"><th align="left" style="padding:5px;">ID</th><th align="left">Name</th><th>%</th></tr>';
            roster.forEach(u => {
                const p = Math.round(((u.month * 4 + u.step) / 16) * 100);
                h += '<tr class="roster-row" style="border-bottom:1px solid #111;">';
                h += '<td style="padding:5px; color:#666;">' + u.id + '</td>';
                h += '<td style="font-weight:bold;">' + u.name + '</td>';
                h += '<td align="center" style="color:lime;">' + p + '%</td></tr>';
            });
            h += '</table></div>';
            h += '<div style="display:flex; gap:5px; margin-top:10px;">';
            h += '<button class="btn" style="flex:1; background:#4361ee; font-size:10px;" onclick="agriEngine.exportData()">📥 Export</button>';
            h += '<button class="btn" style="flex:1; background:#d00000; font-size:10px;" onclick="agriEngine.adminLogout()">Logout</button>';
            h += '</div>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        }
        return h + '</div>';
    },
    filterRoster: function() {
        const input = document.getElementById("admin-search").value.toUpperCase();
        const table = document.getElementById("roster-table");
        const tr = table.getElementsByClassName("roster-row");
        for (let i = 0; i < tr.length; i++) {
            const idCell = tr[i].getElementsByTagName("td")[0];
            const nameCell = tr[i].getElementsByTagName("td")[1];
            if (idCell || nameCell) {
                const txtValue = (idCell.textContent || idCell.innerText) + (nameCell.textContent || nameCell.innerText);
                if (txtValue.toUpperCase().indexOf(input) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    },
    // --- RE-ACTIVATED PORTAL & LOGIN LOGIC ---
    adminLogin: function() {
        if(prompt("User:") === "robin" && prompt("Pass:") === "1234") {
            this.isAdmin = true;
            localStorage.setItem('agri_admin_active', 'true');
            this.sync();
        }
    },
    adminLogout: function() {
        this.isAdmin = false;
        localStorage.setItem('agri_admin_active', 'false');
        this.sync();
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal Login</h3><input type="number" id="login-id" placeholder="ID Number" style="width:90%; padding:10px; margin-bottom:5px;"><button class="btn" onclick="agriEngine.portalLogin()">Enter Portal</button></div>';
        return '<div class="card"><h3>👋 ' + this.currentUser.name + '</h3><button class="btn" onclick="agriEngine.portalLogout()">Logout</button></div>';
    },
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) { this.currentUser = user; localStorage.setItem('agri_logged_in_user', JSON.stringify(user)); this.sync(); }
        else alert("ID Not Found.");
    },
    portalLogout: function() { localStorage.removeItem('agri_logged_in_user'); this.currentUser = null; this.sync(); },
    exportData: function() { alert("CSV Export Triggered."); }
};
agriEngine.init();
