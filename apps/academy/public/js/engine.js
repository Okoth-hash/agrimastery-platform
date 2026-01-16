const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'academy', 'admin'].forEach(sec => {
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
    // --- BACKUP & RESTORE LOGIC ---
    exportDatabase: function() {
        const data = {
            roster: JSON.parse(localStorage.getItem('agri_master_roster') || "[]"),
            broadcast: localStorage.getItem('agri_global_msg'),
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = AgriMastery_Backup_.json;
        a.click();
        alert("Backup File Downloaded! Keep this file safe.");
    },
    importDatabase: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if(imported.roster) {
                        localStorage.setItem('agri_master_roster', JSON.stringify(imported.roster));
                        if(imported.broadcast) localStorage.setItem('agri_global_msg', imported.broadcast);
                        alert("System Restored Successfully! Refreshing...");
                        location.reload();
                    }
                } catch(err) { alert("Invalid Backup File."); }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    // --- UPDATED ADMIN UI ---
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white; border:1px solid #333;">';
        if(this.isAdmin) {
            h += '<h3 style="color:lime;">🛡️ Data Vault</h3>';
            h += '<p style="font-size:10px; color:#888;">Protect against browser data loss:</p>';
            h += '<button class="btn" style="width:100%; background:#2d6a4f; margin-bottom:5px;" onclick="agriEngine.exportDatabase()">📥 Backup All Data</button>';
            h += '<button class="btn" style="width:100%; background:#3d5a80;" onclick="agriEngine.importDatabase()">📤 Restore from File</button>';
            h += '<hr style="border:0; border-top:1px solid #222; margin:10px 0;">';
            h += '<button class="btn" style="width:100%; background:red;" onclick="agriEngine.adminLogout()">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        }
        return h + '</div>';
    },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal</h3><p>Please register or login.</p></div>';
        return '<div class="card"><h3>👋 ' + this.currentUser.name + '</h3></div>';
    }
};
agriEngine.init();
