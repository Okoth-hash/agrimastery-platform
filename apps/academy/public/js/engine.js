const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    creds: { user: "robin", pass: "1234" },
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
        this.updateSection('broadcast', this.getBroadcastHtml());
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal Login</h3><input type="number" id="login-id" placeholder="ID Number"><button class="btn" onclick="agriEngine.portalLogin()">Access Portal</button></div>';
        const prog = Math.round(((this.currentUser.month * 4 + this.currentUser.step) / 16) * 100);
        let h = '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<div style="display:flex; justify-content:space-between;"><b>STUDENT PORTAL</b> <span onclick="agriEngine.portalLogout()" style="color:red; cursor:pointer; font-size:12px;">Logout</span></div>' +
               '<h2>' + this.currentUser.name + '</h2>' +
               '<div style="background:#eee; height:12px; border-radius:6px; margin:10px 0;"><div style="width:'+prog+'%; background:#409167; height:100%; border-radius:6px;"></div></div>' +
               '<p>Progress: ' + prog + '%</p>';
        if(prog >= 100) {
            h += '<div style="background:#fff9c4; border:1px dashed #fbc02d; padding:15px; text-align:center; border-radius:8px; margin-top:10px;">' +
                 '🎊 <b>CONGRATULATIONS!</b><br>You are a Certified Master Farmer.<br>' +
                 '<button class="btn" style="background:#fbc02d; color:#000; width:100%; margin-top:10px;" onclick="agriEngine.generateCert()">📜 Download Certificate</button>' +
                 '</div>';
        } else {
            h += '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Mark Lesson Complete</button>';
        }
        return h + '</div>';
    },
    generateCert: function() {
        const date = new Date().toLocaleDateString();
        const certWindow = window.open('', '_blank');
        certWindow.document.write(
            <html>
            <head><title>Certificate - </title></head>
            <body style="font-family:serif; text-align:center; padding:50px; border:20px solid #2d6a4f;">
                <h1 style="font-size:50px; color:#2d6a4f;">AgriMastery Academy</h1>
                <p style="font-size:20px;">This is to certify that</p>
                <h2 style="font-size:40px; text-decoration:underline;"></h2>
                <p style="font-size:20px;">has successfully completed the 4-Month</p>
                <h3>MASTER FARMER PROGRAM IN MAIZE PRODUCTION</h3>
                <p>Awarded on: </p>
                <div style="margin-top:50px;">
                    <div style="display:inline-block; width:200px; border-top:2px solid #000;">Director of Academy</div>
                    <div style="display:inline-block; width:50px;"></div>
                    <div style="display:inline-block; width:200px; border-top:2px solid #000;">Certified By: Robin</div>
                </div>
                <div style="margin-top:30px; color:#aaa; font-size:10px;">ID Verification: </div>
            </body>
            </html>
        );
        certWindow.print();
    },
    // --- LOGIC SYNC ---
    nextStep: function() {
        if(this.currentUser.month >= 4) return;
        this.currentUser.step++;
        if(this.currentUser.step >= 4) { this.currentUser.month++; this.currentUser.step = 0; }
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === this.currentUser.id);
        if(idx !== -1) { roster[idx] = this.currentUser; localStorage.setItem('agri_master_roster', JSON.stringify(roster)); }
        this.sync();
    },
    adminLogin: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    adminLogout: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) h += '<h4>Admin Portal Active</h4><button class="btn" onclick="agriEngine.adminLogout()">Logout</button>';
        else h += '<button class="btn" style="background:none; color:#666;" onclick="agriEngine.adminLogin()">Admin Login</button>';
        return h + '</div>';
    },
    getBroadcastHtml: function() { const m = localStorage.getItem('agri_global_msg'); return m ? '<div style="background:#ffcc00; padding:10px; text-align:center;">📢 ' + m + '</div>' : ''; },
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) { this.currentUser = user; localStorage.setItem('agri_logged_in_user', JSON.stringify(user)); this.sync(); }
        else alert("ID Not Found.");
    },
    portalLogout: function() { localStorage.removeItem('agri_logged_in_user'); this.currentUser = null; this.sync(); }
};
agriEngine.init();
