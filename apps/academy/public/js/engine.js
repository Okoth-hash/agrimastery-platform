const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'admin-panel', 'academy'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('admin-panel', this.getAdminHtml());
        this.updateSection('broadcast', this.getBroadcastHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- FULL ADMIN DASHBOARD ---
    getAdminHtml: function() {
        if(!this.isAdmin) {
            return '<div class="card" style="text-align:center; padding:40px;">' +
                   '<h2 style="color:#2d6a4f;">🔒 Admin Secure Entry</h2>' +
                   '<input type="password" id="admin-pass" placeholder="Enter Master Key" style="width:80%; padding:12px; margin:10px 0; border:2px solid #eee; border-radius:8px; text-align:center;">' +
                   '<button class="btn" style="width:85%; background:#2d6a4f;" onclick="agriEngine.verifyAdmin()">Authenticate</button></div>';
        }
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        let h = '<div class="card" style="background:#0b0f19; color:#fff; border-radius:15px; border:1px solid #1e293b;">';
        h += '<div style="display:flex; justify-content:space-between; align-items:center;">';
        h += '<h2 style="color:#10b981; margin:0;">👨‍✈️ Command Center</h2>';
        h += '<button onclick="agriEngine.logoutAdmin()" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:5px; cursor:pointer;">Exit</button>';
        h += '</div>';
        // Statistics Row
        h += '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:20px; text-align:center;">';
        h += <div style="background:#1e293b; padding:10px; border-radius:8px;"><small>Users</small><br><b style="font-size:18px;"></b></div>;
        h += <div style="background:#1e293b; padding:10px; border-radius:8px;"><small>Market Items</small><br><b style="font-size:18px;">24</b></div>;
        h += <div style="background:#1e293b; padding:10px; border-radius:8px;"><small>System</small><br><b style="color:#10b981; font-size:14px;">Stable</b></div>;
        h += '</div>';
        // Student Management
        h += '<h4 style="margin:20px 0 10px 0; border-bottom:1px solid #1e293b; padding-bottom:5px;">📋 Student Roster & Tracking</h4>';
        h += '<div style="max-height:200px; overflow-y:auto; background:#000; padding:10px; border-radius:8px;">';
        if(roster.length === 0) h += '<p style="color:#444; font-size:12px;">No students registered yet.</p>';
        roster.forEach(u => {
            h += <div style="display:flex; justify-content:space-between; font-size:12px; padding:8px 0; border-bottom:1px solid #111;">
                    <span> <small style="color:#444;">ID:</small></span>
                    <span style="color:#10b981;">%</span>
                    <button onclick="agriEngine.deleteUser('')" style="background:none; border:none; color:#ef4444; cursor:pointer;">🗑️</button>
                  </div>;
        });
        h += '</div>';
        // System Tools
        h += '<h4 style="margin:20px 0 10px 0;">🛠️ Global Controls</h4>';
        h += '<button class="btn" style="width:100%; background:#3b82f6; margin-bottom:10px;" onclick="agriEngine.triggerBroadcast()">📢 Push Global Notification</button>';
        h += '<button class="btn" style="width:100%; background:#2d6a4f;" onclick="agriEngine.exportAllData()">📤 Download Full Database Backup</button>';
        h += '</div>';
        return h;
    },
    verifyAdmin: function() {
        const pass = document.getElementById('admin-pass').value;
        if(pass === "1234") {
            this.isAdmin = true;
            localStorage.setItem('agri_admin_active', 'true');
            this.sync();
        } else { alert("Access Denied: Invalid Master Key."); }
    },
    logoutAdmin: function() {
        this.isAdmin = false;
        localStorage.setItem('agri_admin_active', 'false');
        this.sync();
    },
    deleteUser: function(id) {
        if(confirm("Are you sure you want to delete this student and all their progress?")) {
            let roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            roster = roster.filter(u => u.id !== id);
            localStorage.setItem('agri_master_roster', JSON.stringify(roster));
            this.sync();
        }
    },
    triggerBroadcast: function() {
        const msg = prompt("Enter broadcast message for all users:");
        if(msg) {
            localStorage.setItem('agri_global_msg', msg);
            this.sync();
        }
    },
    getBroadcastHtml: function() {
        const msg = localStorage.getItem('agri_global_msg');
        return msg ? <div style="background:#fbbf24; color:#000; padding:15px; text-align:center; font-weight:bold; position:relative;">
                        📢 ATTENTION: 
                        <span onclick="localStorage.removeItem('agri_global_msg'); agriEngine.sync();" style="float:right; cursor:pointer;">✖</span>
                      </div> : '';
    },
    exportAllData: function() {
        const data = localStorage.getItem('agri_master_roster');
        const blob = new Blob([data], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'AgriMastery_Master_Database.json';
        a.click();
    }
};
agriEngine.init();
