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
        this.updateSection('tools', this.getToolsHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        // If no one is logged in, show the Portal Entry (Login/Register)
        if(!this.currentUser) {
            return '<div class="card" style="border-top:5px solid #2d6a4f;">' +
                   '<h3>🎓 Student Portal Entry</h3>' +
                   '<p>Enter your ID to access your personal dashboard.</p>' +
                   '<input type="number" id="login-id" placeholder="Enter National ID" style="width:90%; padding:10px; margin:5px 0; border:1px solid #ccc; border-radius:4px;">' +
                   '<button class="btn" style="width:100%; background:#2d6a4f; margin-bottom:15px;" onclick="agriEngine.portalLogin()">Access Portal</button>' +
                   '<hr><p style="font-size:12px; color:#666;">New Student? Register below:</p>' +
                   '<input type="text" id="reg-name" placeholder="Full Name" style="width:90%; padding:8px; margin:5px 0;">' +
                   '<input type="number" id="reg-id" placeholder="National ID" style="width:90%; padding:8px; margin:5px 0;">' +
                   '<button class="btn" style="width:100%; background:none; border:1px solid #2d6a4f; color:#2d6a4f;" onclick="agriEngine.portalRegister()">Create New Portal</button></div>';
        }
        // Student is Logged In: Show THEIR specific progress
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f; background:#fff;">' +
               '<div style="display:flex; justify-content:space-between;"><b>MY PORTAL</b> <span onclick="agriEngine.portalLogout()" style="color:red; cursor:pointer; font-size:12px;">Logout</span></div>' +
               '<h2 style="margin:10px 0; color:#1b4332;">Welcome, ' + this.currentUser.name + '</h2>' +
               '<div style="background:#eee; height:12px; border-radius:6px; margin:10px 0;"><div style="width:'+prog+'%; background:#409167; height:100%; border-radius:6px; transition:1s;"></div></div>' +
               '<p>Current Level: <b>Month ' + (this.currentUser.month + 1) + '</b></p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Continue My Lessons →</button></div>';
    },
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) {
            this.currentUser = user;
            localStorage.setItem('agri_logged_in_user', JSON.stringify(user));
            this.sync();
        } else {
            alert("ID not found. Please register as a new student.");
        }
    },
    portalRegister: function() {
        const n = document.getElementById('reg-name').value;
        const i = document.getElementById('reg-id').value;
        if(!n || !i) return alert("Fields required.");
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        if(roster.some(u => u.id === i)) return alert("This ID is already registered.");
        const newUser = { name: n, id: i, month: 0, step: 0 };
        roster.push(newUser);
        localStorage.setItem('agri_master_roster', JSON.stringify(roster));
        this.currentUser = newUser;
        localStorage.setItem('agri_logged_in_user', JSON.stringify(newUser));
        this.sync();
    },
    nextStep: function() {
        this.currentUser.step++;
        if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        // Save to active session
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        // Sync back to Master Roster for Admin tracking
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === this.currentUser.id);
        if(idx !== -1) { roster[idx] = this.currentUser; localStorage.setItem('agri_master_roster', JSON.stringify(roster)); }
        this.sync();
    },
    portalLogout: function() {
        localStorage.removeItem('agri_logged_in_user');
        this.currentUser = null;
        this.sync();
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) {
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<h3 style="color:lime;">👨‍✈️ Admin Tracker</h3>';
            h += '<div style="font-size:11px; max-height:150px; overflow-y:auto; border:1px solid #333; padding:5px; margin-bottom:10px;">';
            h += '<table style="width:100%; border-collapse:collapse;"><tr><th align="left">Student</th><th>Prog</th></tr>';
            roster.forEach(u => {
                const p = Math.round(((u.month * 4 + u.step) / 16) * 100);
                h += '<tr style="border-bottom:1px solid #222;"><td>' + u.name + '</td><td align="center">' + p + '%</td></tr>';
            });
            h += '</table></div>';
            h += '<button class="btn" style="background:#4361ee; width:100%;" onclick="agriEngine.exportData()">📥 Export All Data</button>';
            h += '<button class="btn" style="background:red; width:100%; margin-top:5px;" onclick="agriEngine.adminLogout()">Admin Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        }
        return h + '</div>';
    },
    adminLogin: function() {
        if(prompt("User:") === this.creds.user && prompt("Pass:") === this.creds.pass) {
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
    getToolsHtml: function() { return '<div class="card"><h3>🛠️ Smart Tools</h3><p style="font-size:12px; color:#666;">Tools adjust to your progress automatically.</p></div>'; },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    exportData: function() { alert("Exporting Master Roster to CSV..."); }
};
agriEngine.init();
