const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    // 1. FORCED RECOVERY BOOT
    init: function() {
        console.log("RECOVERY: Attempting System Restoration...");
        // Ensure the App Container exists
        let view = document.getElementById('app-viewport');
        if(!view) {
            view = document.createElement('div');
            view.id = 'app-viewport';
            document.body.prepend(view);
        }
        // Wipe and Rebuild the Infrastructure
        view.innerHTML = '';
        const layers = ['status-bar', 'admin-panel', 'academy', 'market', 'glossary'];
        layers.forEach(id => {
            const div = document.createElement('div');
            div.id = 'section-' + id;
            view.appendChild(div);
        });
        // 2. RE-LINK DATA PIPES
        this.isAdmin = localStorage.getItem('agri_admin_active') === 'true';
        this.currentUser = JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null');
        // 3. REACTIVATE HEARTBEAT
        window.onclick = () => this.pulse();
        this.pulse();
        this.renderAll();
        console.log("RECOVERY: System Restored.");
    },
    pulse: function() {
        const hb = document.getElementById('section-status-bar');
        if(hb) {
            hb.innerHTML = '<div style="background:#800; color:#fff; font-family:monospace; font-size:10px; padding:5px 15px; display:flex; justify-content:space-between;">' +
                           '<span>🛡️ RECOVERY MODE ACTIVE</span><span>SYNC: ' + new Date().toLocaleTimeString() + '</span></div>';
        }
    },
    renderAll: function() {
        this.renderAdmin();
        this.renderAcademy();
        this.renderMarket();
    },
    renderAdmin: function() {
        const el = document.getElementById('section-admin-panel');
        if(this.isAdmin) {
            el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981;">' +
                           '<h3>👨‍✈️ Admin Command (Restored)</h3>' +
                           '<button class="btn" style="width:100%; background:#ef4444;" onclick="agriEngine.logout()">Lock</button></div>';
        } else {
            el.innerHTML = '<div class="card"><button class="btn" onclick="agriEngine.login()">Admin Login</button></div>';
        }
    },
    renderAcademy: function() {
        const el = document.getElementById('section-academy');
        if(this.currentUser) {
            el.innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;">' +
                           '<h3>🎓 Academy: ' + this.currentUser.name + '</h3>' +
                           '<p>Progress Safely Recovered.</p></div>';
        }
    },
    renderMarket: function() {
        const el = document.getElementById('section-market');
        el.innerHTML = '<div class="card"><h3>📈 Market Status: Online</h3></div>';
    },
    login: function() { if(prompt("Key:")==="1234") { localStorage.setItem('agri_admin_active','true'); location.reload(); } },
    logout: function() { localStorage.setItem('agri_admin_active','false'); location.reload(); }
};
agriEngine.init();
