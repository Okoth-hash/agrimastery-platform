const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'calendar', 'academy', 'tools', 'admin'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('calendar', this.getCalendarHtml());
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
        this.updateSection('broadcast', this.getBroadcastHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- DASHBOARD: SEASONAL CALENDAR ---
    getCalendarHtml: function() {
        const now = new Date();
        const month = now.getMonth(); // 0 = Jan, 1 = Feb...
        let advice = "";
        let color = "#2d6a4f";
        // Kenya Maize Cycle Logic
        if (month === 0 || month === 1) {
            advice = "🚜 **Land Preparation:** Clear fields and purchase certified seeds (H614/Duma 43) now.";
        } else if (month >= 2 && month <= 4) {
            advice = "🌱 **Planting Season:** Long rains starting. Plant now for maximum yield.";
        } else if (month >= 5 && month <= 7) {
            advice = "🌿 **Maintenance:** Top-dressing (CAN) and weeding required.";
        } else if (month >= 8 && month <= 10) {
            advice = "🌽 **Harvesting:** Dry maize to 13.5% moisture before storage.";
        } else {
            advice = "💰 **Market Phase:** Short rains planting or grain sales.";
        }
        return '<div class="card" style="border-top:5px solid '+color+'; background:#f9f9f9;">' +
               '<h3 style="margin:0;">📅 Kenya Farm Calendar</h3>' +
               '<p style="font-size:11px; color:#666;">Current Month: <b>January 2026</b></p>' +
               '<div style="background:#e8f5e9; padding:10px; border-radius:5px; border-left:4px solid #4CAF50;">' +
               advice + '</div></div>';
    },
    // --- REMAINDER OF MASTER LOGIC ---
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal</h3><button class="btn" onclick="agriEngine.portalLogin()">Login</button></div>';
        return '<div class="card"><h3>👋 ' + this.currentUser.name + '</h3><button class="btn" onclick="agriEngine.nextStep()">Continue Lesson</button></div>';
    },
    getAdminHtml: function() {
        if(this.isAdmin) return '<div class="card" style="background:#000; color:white;"><h4>Admin Vault</h4><button class="btn" onclick="agriEngine.adminLogout()">Logout</button></div>';
        return '<button class="btn" style="opacity:0.2;" onclick="agriEngine.adminLogin()">Admin</button>';
    },
    getBroadcastHtml: function() { return ''; },
    portalLogin: function() { /* Logic for login */ },
    nextStep: function() { /* Logic for steps */ },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); }
};
agriEngine.init();
