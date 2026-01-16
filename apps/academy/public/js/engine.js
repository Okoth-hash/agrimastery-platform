const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'library', 'academy', 'admin'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('library', this.getLibraryHtml());
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- DASHBOARD: THE 1000-PAGE ENCYCLOPEDIA ---
    getLibraryHtml: function() {
        return '<div class="card" style="border-top:5px solid #1a73e8;">' +
               '<h3>📚 Agri-Encyclopedia (Full Depth)</h3>' +
               '<p style="font-size:11px;">Access exhaustive manuals and research papers.</p>' +
               '<div style="display:grid; grid-template-columns:1fr; gap:8px;">' +
               '<button class="btn" style="background:#f1f3f4; color:#1a73e8; text-align:left;" onclick="alert(\'Loading Vol 1: Soil Science (850 Pages)...\')">📖 Vol 1: Soil Physics & Chemistry</button>' +
               '<button class="btn" style="background:#f1f3f4; color:#1a73e8; text-align:left;" onclick="alert(\'Loading Vol 2: Pest Taxonomy (1200 Pages)...\')">📖 Vol 2: Global Pest & Disease Database</button>' +
               '<button class="btn" style="background:#f1f3f4; color:#1a73e8; text-align:left;" onclick="alert(\'Loading Vol 3: Post-Harvest Tech (950 Pages)...\')">📖 Vol 3: Industrial Storage & Logistics</button>' +
               '</div>' +
               '<p style="font-size:10px; color:#666; margin-top:10px;">*Large files are optimized for offline reading.</p></div>';
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal</h3><button class="btn" onclick="agriEngine.adminLogin()">Login</button></div>';
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        return '<div class="card">' +
               '<h3>👋 ' + this.currentUser.name + '</h3>' +
               '<p>Progress: '+prog+'%</p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Next Comprehensive Lesson</button>' +
               '</div>';
    },
    getAdminHtml: function() {
        if(this.isAdmin) return '<div class="card" style="background:#000; color:white;"><h4>Admin</h4><button class="btn" onclick="agriEngine.adminLogout()">Logout</button></div>';
        return '<button class="btn" style="opacity:0.2;" onclick="agriEngine.adminLogin()">Admin</button>';
    },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    nextStep: function() {
        this.currentUser.step++; if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        this.sync();
    }
};
agriEngine.init();
