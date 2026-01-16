const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        // Clean and Re-build containers
        view.innerHTML = '';
        ['broadcast', 'admin-panel', 'academy', 'market'].forEach(sec => {
            const div = document.createElement('div');
            div.id = 'section-' + sec;
            view.appendChild(div);
        });
        console.log("AgriMastery: System Re-Initialized Successfully.");
        this.sync();
    },
    sync: function() {
        this.renderBroadcast();
        this.renderAdmin();
        this.renderAcademy();
        this.renderMarket();
    },
    // --- RE-INITIALIZED DASHBOARDS ---
    renderBroadcast: function() {
        const msg = localStorage.getItem('agri_global_msg');
        const el = document.getElementById('section-broadcast');
        if(el && msg) el.innerHTML = '<div style="background:#fbbf24; color:black; padding:12px; text-align:center; font-weight:bold;">📢 ALERT: ' + msg + '</div>';
    },
    renderAdmin: function() {
        const el = document.getElementById('section-admin-panel');
        if(!el) return;
        if(this.isAdmin) {
            el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981;">' +
                           '<h3 style="color:#10b981; margin:0;">👨‍✈️ Admin Center Active</h3>' +
                           '<p style="font-size:11px;">GitHub Sync: 🟢 Connected</p>' +
                           '<button class="btn" style="width:100%; background:#ef4444;" onclick="agriEngine.logoutAdmin()">Lock System</button></div>';
        } else {
            el.innerHTML = '<div class="card" style="text-align:center;"><button class="btn" style="opacity:0.2;" onclick="agriEngine.adminLogin()">Admin Access</button></div>';
        }
    },
    renderAcademy: function() {
        const el = document.getElementById('section-academy');
        if(!el) return;
        if(this.currentUser) {
            const page = this.currentUser.lastPage || 1;
            el.innerHTML = '<div class="card" style="border-left:6px solid #2d6a4f;">' +
                           '<h3>🎓 Welcome, ' + this.currentUser.name + '</h3>' +
                           '<p>📍 Current Progress: <b>Page ' + page + ' of 1000</b></p>' +
                           '<button class="btn" style="width:100%;" onclick="agriEngine.launchCourse()">Resume Learning</button></div>';
        } else {
            el.innerHTML = '<div class="card"><h3>🎓 Student Academy</h3><button class="btn" style="width:100%;" onclick="agriEngine.loginPrompt()">Login to Resume</button></div>';
        }
    },
    renderMarket: function() {
        const el = document.getElementById('section-market');
        if(el) el.innerHTML = '<div class="card" style="background:#fff7ed; border-top:5px solid #ea580c;"><h3>📈 Market Intelligence</h3><p>Price: KSh 4,200/Bag (Nairobi)</p></div>';
    },
    // --- LOGIC HANDLERS ---
    adminLogin: function() { if(prompt("Key:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    logoutAdmin: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    loginPrompt: function() { 
        const id = prompt("Enter ID:");
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const u = roster.find(x => x.id === id);
        if(u) { this.currentUser = u; localStorage.setItem('agri_logged_in_user', JSON.stringify(u)); this.sync(); }
    },
    launchCourse: function() { alert("Launching 1,000-page Immersive Mode..."); }
};
agriEngine.init();
