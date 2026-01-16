const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    // 1. INITIALIZE & CLEAN
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        view.innerHTML = ''; // Full UI Flush
        ['status-bar', 'admin-panel', 'academy', 'market', 'glossary'].forEach(sec => {
            const div = document.createElement('div');
            div.id = 'section-' + sec;
            view.appendChild(div);
        });
        // 2. ACTIVATE PERPETUAL LISTENERS
        window.onclick = () => this.pulse();
        window.onscroll = () => this.pulse();
        console.log("AgriMastery: System Hard-Reset Complete. Engine Active.");
        this.sync();
        this.pulse();
    },
    // 3. THE HEARTBEAT (Keeps writing/system active)
    pulse: function() {
        const statusEl = document.getElementById('section-status-bar');
        if(statusEl) {
            const time = new Date().toLocaleTimeString();
            statusEl.innerHTML = '<div style="background:#000; color:#0f0; font-family:monospace; font-size:10px; padding:5px 15px; display:flex; justify-content:space-between;">' +
                                 '<span>🛰️ ENGINE: ONLINE</span><span>LAST SYNC: ' + time + '</span></div>';
        }
    },
    // 4. SYNC ALL MODULES
    sync: function() {
        this.renderAdmin();
        this.renderAcademy();
        this.renderMarket();
    },
    renderAdmin: function() {
        const el = document.getElementById('section-admin-panel');
        if(!el) return;
        if(this.isAdmin) {
            el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981;">' +
                           '<h3 style="color:#10b981; margin:0;">👨‍✈️ Admin Command</h3>' +
                           '<p style="font-size:11px;">Status: All Systems Re-Initialized</p>' +
                           '<button class="btn" style="width:100%; background:#ef4444;" onclick="agriEngine.logoutAdmin()">Lock System</button></div>';
        } else {
            el.innerHTML = '<div class="card" style="text-align:center;"><button class="btn" style="opacity:0.2;" onclick="agriEngine.adminLogin()">Admin Entry</button></div>';
        }
    },
    renderAcademy: function() {
        const el = document.getElementById('section-academy');
        if(!el) return;
        if(this.currentUser) {
            const page = this.currentUser.lastPage || 1;
            el.innerHTML = '<div class="card" style="border-left:6px solid #2d6a4f;">' +
                           '<h3>🎓 Academy Portal</h3>' +
                           '<p>📍 Resuming at <b>Page ' + page + ' of 1000</b></p>' +
                           '<button class="btn" style="width:100%;" onclick="alert(\'Entering Full-Screen...\')">Continue Reading</button></div>';
        } else {
            el.innerHTML = '<div class="card"><h3>🎓 Academy</h3><button class="btn" style="width:100%;" onclick="agriEngine.loginPrompt()">Login to Start</button></div>';
        }
    },
    renderMarket: function() {
        const el = document.getElementById('section-market');
        if(el) el.innerHTML = '<div class="card" style="background:#fff7ed; border-top:5px solid #ea580c;"><h3>📈 Market Live</h3><p>Price: KSh 4,200/Bag</p></div>';
    },
    // 5. CONTROL HANDLERS
    adminLogin: function() { if(prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.init(); } },
    logoutAdmin: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.init(); },
    loginPrompt: function() { 
        const id = prompt("Student ID:");
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const u = roster.find(x => x.id === id);
        if(u) { this.currentUser = u; localStorage.setItem('agri_logged_in_user', JSON.stringify(u)); this.init(); }
    }
};
agriEngine.init();
