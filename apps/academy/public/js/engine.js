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
        // Connectivity Monitoring
        window.addEventListener('online', () => this.updateConnectivity());
        window.addEventListener('offline', () => this.updateConnectivity());
        this.sync();
        this.updateConnectivity();
    },
    updateConnectivity: function() {
        const statusBox = document.getElementById('section-broadcast');
        if(!statusBox) return;
        if (navigator.onLine) {
            statusBox.innerHTML = '<div style="background:#2d6a4f; color:white; padding:5px; font-size:10px; text-align:center;">🌐 SYSTEM ONLINE | Cloud Sync Active</div>';
        } else {
            statusBox.innerHTML = '<div style="background:#333; color:orange; padding:5px; font-size:10px; text-align:center;">📴 OFFLINE MODE | Data Saving to Device Memory</div>';
        }
    },
    sync: function() {
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal</h3><p>Login to enable offline access.</p></div>';
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<h3>👋 Welcome, ' + this.currentUser.name + '</h3>' +
               '<div style="background:#eee; height:10px; border-radius:5px;"><div style="width:'+prog+'%; background:#409167; height:100%; border-radius:5px;"></div></div>' +
               '<p style="font-size:12px; margin-top:5px;">Lessons are cached for offline use.</p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Complete Lesson</button>' +
               '</div>';
    },
    nextStep: function() {
        this.currentUser.step++;
        if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        // Save locally - this works without internet!
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === this.currentUser.id);
        if(idx !== -1) { roster[idx] = this.currentUser; localStorage.setItem('agri_master_roster', JSON.stringify(roster)); }
        this.sync();
    },
    // --- ADMIN CONTROLS ---
    getAdminHtml: function() {
        if(this.isAdmin) {
            return '<div class="card" style="background:#000; color:white;">' +
                   '<h4>Admin Controller</h4>' +
                   '<button class="btn" onclick="agriEngine.exportDatabase()" style="width:100%; background:#2d6a4f;">Download Data Backup</button>' +
                   '<button class="btn" onclick="agriEngine.adminLogout()" style="width:100%; background:red; margin-top:5px;">Logout</button></div>';
        }
        return '<button class="btn" style="opacity:0.3;" onclick="agriEngine.adminLogin()">Admin</button>';
    },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    exportDatabase: function() { /* Previous backup logic */ alert("Backup starting..."); }
};
agriEngine.init();
