const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    currentUser: null,
    init: function() {
        // AGGRESSIVE RECOVERY: Check primary and secondary memory
        const saved = localStorage.getItem('agri_logged_in_user') || localStorage.getItem('agri_backup_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            console.log("System: Session Resumed for " + this.currentUser.name);
        }
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['academy'].forEach(sec => {
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
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        if(!this.currentUser) {
            return '<div class="card"><h3>🎓 Welcome Back</h3>' +
                   '<p>Enter ID to resume your 1000-page journey.</p>' +
                   '<input type="number" id="login-id" style="width:90%; padding:10px; margin-bottom:10px;">' +
                   '<button class="btn" style="width:100%;" onclick="agriEngine.portalLogin()">Resume Learning</button></div>';
        }
        // If logged in, jump STRAIGHT to where they left off
        return '<div class="card">' +
               '<h3>📖 Resuming: Month ' + (this.currentUser.month + 1) + '</h3>' +
               '<p>Hello ' + this.currentUser.name + ', we have saved your spot.</p>' +
               '<button class="btn" style="width:100%; background:#2d6a4f;" onclick="agriEngine.launchCourse()">🚀 Open Full-Screen Course</button>' +
               '<button class="btn" style="width:100%; background:none; color:red; margin-top:10px; font-size:10px;" onclick="agriEngine.portalLogout()">Switch Account</button>' +
               '</div>';
    },
    portalLogin: function() {
        const id = document.getElementById('login-id').value;
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) {
            this.currentUser = user;
            // Save to both primary and backup
            localStorage.setItem('agri_logged_in_user', JSON.stringify(user));
            localStorage.setItem('agri_backup_user', JSON.stringify(user));
            this.sync();
        } else {
            alert("ID not found. If this is a new device, use the Admin Restore tool.");
        }
    },
    portalLogout: function() {
        localStorage.removeItem('agri_logged_in_user');
        this.currentUser = null;
        this.sync();
    },
    launchCourse: function() {
        alert("Launching your 1000-page module at precisely where you left off...");
        // Full screen logic follows here...
    }
};
agriEngine.init();
