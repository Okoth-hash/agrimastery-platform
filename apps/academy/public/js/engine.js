const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        // Build all dashboard sections
        ['broadcast', 'admin-panel', 'academy', 'market', 'tools'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        console.log("AgriMastery Engine: Systems Initialized.");
        this.sync();
    },
    sync: function() {
        this.renderBroadcast();
        this.renderAdmin();
        this.renderAcademy();
        this.renderMarket();
    },
    renderBroadcast: function() {
        const msg = localStorage.getItem('agri_global_msg');
        const el = document.getElementById('section-broadcast');
        if(el) el.innerHTML = msg ? '<div style="background:#fbbf24; color:black; padding:12px; text-align:center; font-weight:bold; border-bottom:3px solid #d97706;">📢 ' + msg + '</div>' : '';
    },
    renderAdmin: function() {
        const el = document.getElementById('section-admin-panel');
        if(!el) return;
        if(!this.isAdmin) {
            el.innerHTML = '<div class="card" style="text-align:center;"><button class="btn" style="opacity:0.3;" onclick="agriEngine.adminLogin()">Admin Command</button></div>';
        } else {
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981;">' +
                           '<h3 style="color:#10b981; margin-top:0;">👨‍✈️ Admin Active</h3>' +
                           '<p style="font-size:12px;">Active Students: ' + roster.length + '</p>' +
                           '<button class="btn" style="width:100%; background:#ef4444;" onclick="agriEngine.adminLogout()">Lock Console</button></div>';
        }
    },
    renderAcademy: function() {
        const el = document.getElementById('section-academy');
        if(!el) return;
        if(!this.currentUser) {
            el.innerHTML = '<div class="card"><h3>🎓 Student Portal</h3><input type="number" id="login-id" placeholder="Student ID"><button class="btn" style="width:100%;" onclick="agriEngine.login()">Enter Academy</button></div>';
        } else {
            const p = this.currentUser.progress || 0;
            el.innerHTML = '<div class="card" style="border-left:6px solid #2d6a4f;">' +
                           '<h3>📖 ' + this.currentUser.name + '</h3>' +
                           '<div style="background:#eee; height:10px; border-radius:5px;"><div style="width:'+p+'%; background:#2d6a4f; height:100%; border-radius:5px;"></div></div>' +
                           '<p>Progress: '+p+'%</p>' +
                           '<button class="btn" style="width:100%;" onclick="agriEngine.launchCourse()">Resume 1000-Page Course</button></div>';
        }
    },
    renderMarket: function() {
        const el = document.getElementById('section-market');
        if(el) el.innerHTML = '<div class="card" style="background:#fff7ed; border-top:5px solid #ea580c;"><h3>📈 Market Intelligence</h3><p>Nairobi: KSh 4,200 | Eldoret: KSh 3,800</p></div>';
    },
    // Logic Handlers
    adminLogin: function() { if(prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    login: function() { 
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) { this.currentUser = user; localStorage.setItem('agri_logged_in_user', JSON.stringify(user)); this.sync(); }
        else alert("ID not found.");
    },
    launchCourse: function() { alert("Entering Full-Screen Immersive Course..."); }
};
agriEngine.init();
