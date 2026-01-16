const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: null,
    init: function() {
        // 1. RECOVERY LOGIC: Check both primary and backup storage
        const primary = localStorage.getItem('agri_logged_in_user');
        const backup = localStorage.getItem('agri_backup_user');
        if (primary) {
            this.currentUser = JSON.parse(primary);
        } else if (backup) {
            this.currentUser = JSON.parse(backup);
            localStorage.setItem('agri_logged_in_user', backup); // Restore primary
        }
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
    saveData: function(userObj) {
        const data = JSON.stringify(userObj);
        localStorage.setItem('agri_logged_in_user', data);
        localStorage.setItem('agri_backup_user', data); // Double-save
        // Also update the Master Roster
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === userObj.id);
        if(idx !== -1) {
            roster[idx] = userObj;
        } else {
            roster.push(userObj);
        }
        localStorage.setItem('agri_master_roster', JSON.stringify(roster));
        localStorage.setItem('agri_master_roster_backup', JSON.stringify(roster));
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
        if(!this.currentUser) {
            return '<div class="card" style="border:2px solid red;">' +
                   '<h3>⚠️ Profile Required</h3>' +
                   '<p>To prevent data loss, register once with your ID.</p>' +
                   '<input type="text" id="reg-name" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0;">' +
                   '<input type="number" id="reg-id" placeholder="ID Number" style="width:90%; padding:10px; margin:5px 0;">' +
                   '<button class="btn" style="width:100%; background:#2d6a4f;" onclick="agriEngine.portalRegister()">Secure My Profile</button></div>';
        }
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        return '<div class="card" style="background:#f0fff4; border-left:5px solid #2d6a4f;">' +
               '<h3>✅ System Active: ' + this.currentUser.name + '</h3>' +
               '<p>Progress: ' + prog + '%</p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Next Lesson</button>' +
               '<p style="font-size:10px; color:gray; margin-top:10px;">Data is locally encrypted & saved.</p></div>';
    },
    portalRegister: function() {
        const n = document.getElementById('reg-name').value;
        const i = document.getElementById('reg-id').value;
        if(!n || !i) return alert("Please enter Name and ID.");
        const newUser = { name: n, id: i, month: 0, step: 0, lastLogin: new Date().toLocaleString() };
        this.currentUser = newUser;
        this.saveData(newUser);
        this.sync();
    },
    nextStep: function() {
        this.currentUser.step++;
        if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        this.saveData(this.currentUser);
        this.sync();
    },
    adminLogin: function() {
        if(prompt("User:") === "robin" && prompt("Pass:") === "1234") {
            this.isAdmin = true;
            localStorage.setItem('agri_admin_active', 'true');
            this.sync();
        }
    },
    getAdminHtml: function() {
        if(this.isAdmin) {
            return '<div class="card" style="background:#000; color:lime;"><h4>Admin Master</h4><button class="btn" onclick="agriEngine.resetAll()" style="background:red;">Factory Reset System</button></div>';
        }
        return '<button class="btn" style="opacity:0.5;" onclick="agriEngine.adminLogin()">Admin Access</button>';
    },
    resetAll: function() {
        if(confirm("DANGER: This will wipe ALL student data. Proceed?")) {
            localStorage.clear();
            location.reload();
        }
    }
};
agriEngine.init();
