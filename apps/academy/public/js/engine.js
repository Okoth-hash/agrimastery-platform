const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    // COURSE CONTENT - Structure for 1,000+ pages of depth
    courses: [
        { id: "maize-101", title: "Mastering Maize Production", totalSteps: 16 },
        { id: "soil-202", title: "Advanced Soil Science", totalSteps: 12 }
    ],
    init: function() {
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
    sync: function() {
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- STUDENT ACADEMY & TRACKING ---
    getAcademyHtml: function() {
        if(!this.currentUser) {
            return '<div class="card"><h3>🎓 Academy Login</h3>' +
                   '<input type="number" id="login-id" placeholder="Enter Student ID" style="width:90%; padding:10px; margin-bottom:10px;">' +
                   '<button class="btn" style="width:100%;" onclick="agriEngine.portalLogin()">Access Courses</button></div>';
        }
        const progress = this.currentUser.progress || 0;
        const isComplete = progress >= 100;
        return '<div class="card" id="main-portal">' +
               '<h2>Welcome, ' + this.currentUser.name + '</h2>' +
               '<div style="background:#eee; height:15px; border-radius:10px; margin:15px 0;">' +
               '<div style="width:' + progress + '%; background:#2d6a4f; height:100%; border-radius:10px; transition:0.5s;"></div>' +
               '</div>' +
               '<p>Course Progress: <b>' + progress + '%</b></p>' +
               (isComplete ? 
                '<button class="btn" style="background:#fbc02d; color:#000; width:100%;" onclick="agriEngine.generateCert()">📜 Download Certificate</button>' : 
                '<button class="btn" style="width:100%; background:#1a73e8;" onclick="agriEngine.launchImmersive()">🚀 Launch Full-Screen Lesson</button>') +
               '<button class="btn" style="width:100%; background:none; color:red; margin-top:10px;" onclick="agriEngine.logout()">Logout</button></div>';
    },
    // --- TRACKING LOGIC ---
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) {
            this.currentUser = user;
            localStorage.setItem('agri_logged_in_user', JSON.stringify(user));
            this.sync();
        } else { alert("ID not found. Please register as a new student."); }
    },
    updateProgress: function(newStep) {
        // Logic to calculate % based on 16 steps
        this.currentUser.currentStep = (this.currentUser.currentStep || 0) + 1;
        this.currentUser.progress = Math.round((this.currentUser.currentStep / 16) * 100);
        // Sync to storage
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === this.currentUser.id);
        roster[idx] = this.currentUser;
        localStorage.setItem('agri_master_roster', JSON.stringify(roster));
        this.sync();
    },
    // --- FULL SCREEN & CERTIFICATION ---
    launchImmersive: function() {
        const el = document.getElementById('main-portal');
        if (el.requestFullscreen) el.requestFullscreen();
        el.innerHTML = '<div style="padding:50px; background:white; height:100vh; overflow-y:auto;">' +
                       '<h1>Month 1: Soil Fertility & PH</h1>' +
                       '<p>Deep content loading (Page 1 of 1000)...</p>' +
                       '<button class="btn" onclick="agriEngine.updateProgress()">Mark Page Read & Next</button>' +
                       '<button class="btn" style="background:red;" onclick="document.exitFullscreen(); location.reload();">Exit Full Screen</button></div>';
    },
    generateCert: function() {
        const win = window.open('', '_blank');
        win.document.write('<div style="border:15px solid #2d6a4f; padding:50px; text-align:center; font-family:serif;">' +
                           '<h1>CERTIFICATE OF COMPLETION</h1>' +
                           '<p>This is to certify that</p><h2>' + this.currentUser.name + '</h2>' +
                           '<p>Has completed the 1,000-page Master Farmer course.</p>' +
                           '<p>Verified by: Omondi Robin Okoth</p></div>');
        win.print();
    },
    logout: function() { localStorage.removeItem('agri_logged_in_user'); location.reload(); },
    // --- ADMIN TRACKER ---
    getAdminHtml: function() {
        if(!this.isAdmin) return '<button onclick="agriEngine.adminLogin()">Admin Access</button>';
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        let list = roster.map(u => <li>: %</li>).join('');
        return '<div class="card" style="background:black; color:lime;"><h3>Admin Tracker</h3><ul>'+list+'</ul></div>';
    },
    adminLogin: function() { if(prompt("Pass:") === "1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } }
};
agriEngine.init();
