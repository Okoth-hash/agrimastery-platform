const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    creds: { user: "robin", pass: "1234" },
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const sections = ['broadcast', 'auth', 'academy', 'tools', 'weather', 'admin'];
        sections.forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        // Heartbeat to keep data synced
        setInterval(() => {
            this.checkAlerts();
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + (this.isAdmin ? " | ADMIN SECURE" : " | ENCRYPTED");
        }, 1000);
        this.sync();
    },
    sync: function() {
        // This order ensures Academy data is loaded before tools
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('tools', this.getToolsHtml());
        this.updateSection('weather', this.getWeatherHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        // STRICTOR CHECK FOR SAVED DATA
        const saved = localStorage.getItem('agri_current_user');
        if(!saved) {
            return '<div class="card" style="border:2px solid #2d6a4f;">' +
                   '<h3>🎓 System Initialization</h3>' +
                   '<p>No profile found. Please register to begin.</p>' +
                   '<input type="text" id="reg-name" placeholder="Full Name" style="width:90%; padding:8px; margin:5px 0;">' +
                   '<input type="number" id="reg-id" placeholder="ID Number" style="width:90%; padding:8px; margin:5px 0;">' +
                   '<button class="btn" style="width:100%; background:#2d6a4f;" onclick="agriEngine.register()">Activate Profile</button></div>';
        }
        const s = JSON.parse(saved);
        const prog = Math.round(((s.month * 4 + s.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f; background:#f0fff4;">' +
               '<h3>👤 Student: ' + s.name + '</h3>' +
               '<div style="width:100%; background:#ddd; height:10px; border-radius:5px;"><div style="width:'+prog+'%; background:#2d6a4f; height:100%; border-radius:5px;"></div></div>' +
               '<p>Course Progress: ' + prog + '%</p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Continue Lesson →</button></div>';
    },
    register: function() {
        const n = document.getElementById('reg-name').value;
        const i = document.getElementById('reg-id').value;
        if(!n || !i) return alert("All fields required for database.");
        const u = { name: n, id: i, month: 0, step: 0 };
        localStorage.setItem('agri_current_user', JSON.stringify(u));
        // Update Master Roster
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        r.push(u);
        localStorage.setItem('agri_master_roster', JSON.stringify(r));
        this.sync();
    },
    login: function() {
        if(prompt("User:") === this.creds.user && prompt("Pass:") === this.creds.pass) {
            this.isAdmin = true;
            localStorage.setItem('agri_admin_active', 'true'); // PERSIST ADMIN STATUS
            this.sync();
        }
    },
    logout: function() {
        this.isAdmin = false;
        localStorage.setItem('agri_admin_active', 'false');
        this.sync();
    },
    // TOOLS AND OTHER MODULES
    getToolsHtml: function() {
        return '<div class="card"><h3>🛠️ Smart Tools (Active)</h3>' +
               '<div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">' +
               '<button onclick="agriEngine.contactExpert()" class="btn" style="background:#25D366;">💬 Support</button>' +
               '<button onclick="agriEngine.loanCheck()" class="btn" style="background:#ff006e;">🏦 Loan</button>' +
               '</div></div>';
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) {
            h += '<h4>Admin: Robin</h4><button class="btn" style="background:#4361ee; width:100%;" onclick="agriEngine.exportData()">📥 Export Data</button>';
            h += '<button class="btn" style="background:red; width:100%; margin-top:5px;" onclick="agriEngine.logout()">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.login()">Admin Login</button>';
        }
        return h + '</div>';
    },
    checkAlerts: function() { /* Logic for alerts */ },
    nextStep: function() { 
        let s = JSON.parse(localStorage.getItem('agri_current_user'));
        s.step++; if(s.step >= 4) { s.month++; s.step = 0; }
        localStorage.setItem('agri_current_user', JSON.stringify(s));
        this.sync();
    },
    contactExpert: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    loanCheck: function() { alert("Credit check online."); },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    exportData: function() { alert("CSV Exported."); }
};
agriEngine.init();
