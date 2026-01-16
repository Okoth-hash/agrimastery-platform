const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
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
        this.sync();
    },
    sync: function() {
        this.updateSection('broadcast', this.getBroadcastHtml());
        this.updateSection('auth', this.getAuthHtml());
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
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) {
            return '<div class="card" style="border-top:5px solid #2d6a4f;">' +
                   '<h3>🎓 Student Registration</h3>' +
                   '<p style="font-size:12px;">Complete your profile to start learning.</p>' +
                   '<input type="text" id="reg-name" placeholder="Full Name" class="input-field" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<input type="number" id="reg-id" placeholder="ID Number" class="input-field" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<input type="date" id="reg-dob" title="Date of Birth" class="input-field" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<input type="email" id="reg-email" placeholder="Email Address" class="input-field" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<select id="reg-gender" style="width:96%; margin:5px 0; padding:8px;"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>' +
                   '<button class="btn" style="width:100%; background:#2d6a4f; margin-top:10px;" onclick="agriEngine.register()">Create Profile</button></div>';
        }
        const progress = ((s.month * 4 + s.step) / 16) * 100;
        return '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<h3>👋 Welcome, ' + s.name + '</h3>' +
               '<p style="font-size:11px; color:#666;">ID: ' + s.id + ' | ' + s.email + '</p>' +
               '<div style="background:#eee; height:10px; border-radius:5px; margin:10px 0;">' +
               '<div style="width:' + progress + '%; background:#409167; height:100%; border-radius:5px;"></div></div>' +
               '<p>Progress: ' + Math.round(progress) + '%</p>' +
               '<button class="btn" onclick="agriEngine.nextStep()">Continue Learning →</button></div>';
    },
    register: function() {
        const user = {
            name: document.getElementById('reg-name').value,
            id: document.getElementById('reg-id').value,
            dob: document.getElementById('reg-dob').value,
            email: document.getElementById('reg-email').value,
            gender: document.getElementById('reg-gender').value,
            month: 0, step: 0
        };
        if(!user.name || !user.id || !user.email) { alert("Please fill all fields"); return; }
        localStorage.setItem('agri_current_user', JSON.stringify(user));
        // Add to the admin master list
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        roster.push(user);
        localStorage.setItem('agri_master_roster', JSON.stringify(roster));
        this.sync();
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_current_user'));
        s.step++;
        if(s.step >= 4) { s.month++; s.step = 0; }
        localStorage.setItem('agri_current_user', JSON.stringify(s));
        // Update admin roster progress
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === s.id);
        if(idx !== -1) { roster[idx] = s; localStorage.setItem('agri_master_roster', JSON.stringify(roster)); }
        this.sync();
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) {
            h += '<h3 style="color:lime;">👨‍✈️ Admin: Robin</h3>';
            const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<div style="font-size:10px; max-height:150px; overflow-y:auto; background:#111; padding:5px; border:1px solid #333;">';
            h += '<b>STUDENT ROSTER (' + roster.length + ')</b><br>';
            roster.forEach(u => {
                h += 'ID:' + u.id + ' | ' + u.name + ' | ' + (Math.round((u.month*4+u.step)/16*100)) + '%<br>';
            });
            h += '</div><button class="btn" onclick="agriEngine.logout()" style="width:100%; background:red; margin-top:5px;">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.login()">Admin Login</button>';
        }
        h += '</div>';
        return h;
    },
    // Keeping tools and other modules stable
    getToolsHtml: function() { return '<div class="card"><h3>🛠️ Smart Tools</h3><button class="btn" onclick="alert(\'All 10 tools active\')">Open Tool Grid</button></div>'; },
    getBroadcastHtml: function() { const m = localStorage.getItem('agri_broadcast'); return m ? '<marquee style="background:#ff9100; padding:5px;">' + m + '</marquee>' : ''; },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    getAuthHtml: function() { return ''; },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } },
    logout: function() { this.isAdmin = false; this.sync(); }
};
agriEngine.init();
