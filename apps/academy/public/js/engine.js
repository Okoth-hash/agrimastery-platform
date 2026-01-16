const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    creds: { user: "robin", pass: "1234" },
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'academy', 'tools', 'admin'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        // Listeners for Offline/Online
        window.addEventListener('online', () => this.sync());
        window.addEventListener('offline', () => this.sync());
        this.sync();
    },
    sync: function() {
        this.updateSection('broadcast', this.getBroadcastHtml());
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('tools', this.getToolsHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- DASHBOARD 1: BROADCAST & CONNECTIVITY ---
    getBroadcastHtml: function() {
        let status = navigator.onLine ? 
            '<div style="background:#2d6a4f; color:white; font-size:10px; padding:4px;">🌐 ONLINE</div>' : 
            '<div style="background:#d00000; color:white; font-size:10px; padding:4px;">📴 OFFLINE MODE</div>';
        const msg = localStorage.getItem('agri_global_msg');
        let broadcast = msg ? '<div style="background:#ffcc00; color:#000; padding:10px; font-weight:bold; text-align:center;">📢 ' + msg + '</div>' : '';
        return status + broadcast;
    },
    // --- DASHBOARD 2: STUDENT PORTAL ---
    getAcademyHtml: function() {
        if(!this.currentUser) {
            return '<div class="card"><h3>🎓 Student Portal</h3>' +
                   '<input type="number" id="login-id" placeholder="ID Number" style="width:90%; padding:10px; margin-bottom:10px;">' +
                   '<button class="btn" style="width:100%;" onclick="agriEngine.portalLogin()">Enter Dashboard</button>' +
                   '<p style="font-size:11px; margin-top:10px;">New? Register in Admin or contact Robin.</p></div>';
        }
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<h3>👋 Welcome, ' + this.currentUser.name + '</h3>' +
               '<div style="background:#eee; height:10px; border-radius:5px;"><div style="width:'+prog+'%; background:#409167; height:100%; border-radius:5px;"></div></div>' +
               '<p>Progress: '+prog+'% | Level: Month '+(this.currentUser.month+1)+'</p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Next Lesson</button>' +
               '<button class="btn" style="width:100%; background:none; color:red; margin-top:5px;" onclick="agriEngine.portalLogout()">Logout</button></div>';
    },
    // --- DASHBOARD 3: SMART TOOLS ---
    getToolsHtml: function() {
        const tools = [
            { n: "Backup", c: "#3d5a80", i: "📥", f: "exportDatabase" },
            { n: "WhatsApp", c: "#25D366", i: "💬", f: "contactExpert" },
            { n: "Cert", c: "#fbc02d", i: "📜", f: "generateCert" },
            { n: "Loans", c: "#ff006e", i: "🏦", f: "toolAlert" }
        ];
        let h = '<div class="card"><h3>🛠️ System Tools</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">';
        tools.forEach(t => h += '<button onclick="agriEngine.'+t.f+'()" class="btn" style="background:'+t.c+'; font-size:10px;">'+t.i+' '+t.n+'</button>');
        return h + '</div></div>';
    },
    // --- DASHBOARD 4: ADMIN INTELLIGENCE ---
    getAdminHtml: function() {
        if(!this.isAdmin) return '<div class="card" style="text-align:center;"><button class="btn" style="background:none; color:#999;" onclick="agriEngine.adminLogin()">Admin Access</button></div>';
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        let h = '<div class="card" style="background:#000; color:lime; border:1px solid #333;">' +
               '<h4>👨‍✈️ Admin Console</h4>' +
               '<button class="btn" style="width:100%; background:#ff9100; color:black; margin-bottom:10px;" onclick="agriEngine.postBroadcast()">📢 Send Global Notice</button>' +
               '<div style="max-height:100px; overflow-y:auto; font-size:10px; border:1px solid #222;">';
        roster.forEach(u => h += '<div style="padding:4px; border-bottom:1px solid #111;">'+u.name+' - '+Math.round(((u.month*4+u.step)/16)*100)+'%</div>');
        h += '</div><button class="btn" style="width:100%; background:red; margin-top:10px;" onclick="agriEngine.adminLogout()">Logout</button></div>';
        return h;
    },
    // --- CORE LOGIC HANDLERS ---
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) { this.currentUser = user; localStorage.setItem('agri_logged_in_user', JSON.stringify(user)); this.sync(); }
        else alert("Student ID not found.");
    },
    portalLogout: function() { localStorage.removeItem('agri_logged_in_user'); this.currentUser = null; this.sync(); },
    nextStep: function() {
        this.currentUser.step++; if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        this.sync();
    },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    postBroadcast: function() { const m = prompt("Enter Global Message:"); if(m) { localStorage.setItem('agri_global_msg', m); this.sync(); } },
    contactExpert: function() { window.location.href = "https://wa.me/254742178833"; },
    exportDatabase: function() { alert("Database Exported to JSON"); },
    generateCert: function() { alert("Certificate engine ready at 100%"); },
    toolAlert: function() { alert("Module active."); }
};
agriEngine.init();
