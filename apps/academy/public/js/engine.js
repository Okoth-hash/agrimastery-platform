const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    creds: { user: "robin", pass: "1234" },
    // Mapping 16 steps to Video IDs (Replace 'dQw4w9WgXcQ' with your actual YouTube IDs)
    videoLessons: {
        "0-0": "dQw4w9WgXcQ", // Month 1, Step 1: Soil Testing
        "0-1": "dQw4w9WgXcQ", // Month 1, Step 2: Clearing
        "1-0": "dQw4w9WgXcQ", // Month 2, Step 1: Weeding
        "3-3": "dQw4w9WgXcQ"  // Month 4, Step 4: Storage
    },
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
        this.updateSection('admin', this.getAdminHtml());
        this.updateSection('broadcast', this.getBroadcastHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal Login</h3><input type="number" id="login-id" placeholder="ID Number"><button class="btn" onclick="agriEngine.portalLogin()">Enter Portal</button></div>';
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        const videoId = this.videoLessons[${this.currentUser.month}-] || "dQw4w9WgXcQ";
        let h = '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<div style="display:flex; justify-content:space-between;"><b>STUDENT PORTAL</b> <span onclick="agriEngine.portalLogout()" style="color:red; cursor:pointer; font-size:12px;">Logout</span></div>' +
               '<h2>Current Lesson: Month ' + (this.currentUser.month + 1) + '</h2>' +
               // VIDEO PLAYER SECTION
               '<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:8px; background:#000; margin:10px 0;">' +
               '<iframe style="position:absolute; top:0; left:0; width:100%; height:100%;" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>' +
               '</div>' +
               '<div style="background:#eee; height:12px; border-radius:6px; margin:10px 0;"><div style="width:'+prog+'%; background:#409167; height:100%; border-radius:6px;"></div></div>' +
               '<p>Course Progress: ' + prog + '%</p>';
        if(prog >= 100) {
            h += '<button class="btn" style="background:#fbc02d; color:#000; width:100%;" onclick="agriEngine.generateCert()">📜 Download Certificate</button>';
        } else {
            h += '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Complete Lesson & Next Video →</button>';
        }
        return h + '</div>';
    },
    // --- REUSE PREVIOUS LOGIC ---
    nextStep: function() {
        this.currentUser.step++;
        if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === this.currentUser.id);
        if(idx !== -1) { roster[idx] = this.currentUser; localStorage.setItem('agri_master_roster', JSON.stringify(roster)); }
        this.sync();
    },
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) { this.currentUser = user; localStorage.setItem('agri_logged_in_user', JSON.stringify(user)); this.sync(); }
        else alert("ID Not Found.");
    },
    portalLogout: function() { localStorage.removeItem('agri_logged_in_user'); this.currentUser = null; this.sync(); },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) h += '<h4>Admin Portal Active</h4><button class="btn" onclick="agriEngine.adminLogout()">Logout</button>';
        else h += '<button class="btn" style="background:none; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        return h + '</div>';
    },
    getBroadcastHtml: function() { return ''; }
};
agriEngine.init();
