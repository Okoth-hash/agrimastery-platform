const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
    creds: { user: "robin", pass: "1234" },
    // FULL SYLLABUS DATA
    syllabus: [
        { month: "Month 1", title: "Land & Foundation", icon: "🌱", steps: ["Soil Testing", "Land Clearing", "Seed Selection", "Planting"] },
        { month: "Month 2", title: "Growth & Nutrition", icon: "💦", steps: ["First Weeding", "Top Dressing", "Pest Scouting", "Thinning"] },
        { month: "Month 3", title: "Protection", icon: "🛡️", steps: ["Second Weeding", "Fungal Check", "Bird Control", "Monitoring"] },
        { month: "Month 4", title: "Harvest & Wealth", icon: "💰", steps: ["Field Drying", "Shelling", "Aflatoxin Test", "Storage"] }
    ],
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const sections = ['broadcast', 'auth', 'academy', 'tools', 'weather', 'financials', 'admin'];
        sections.forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | ACADEMY SYNCED";
        }, 1000);
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
        const s = JSON.parse(localStorage.getItem('agri_student'));
        if(!s) {
            return '<div class="card" style="border: 2px dashed #2d6a4f; text-align:center; padding: 20px;">' +
                   '<h2 style="color:#2d6a4f;">🎓 AgriMastery Academy</h2>' +
                   '<p>Join 5,000+ farmers learning modern techniques.</p>' +
                   '<button class="btn" style="background:#2d6a4f; width:100%;" onclick="agriEngine.enroll()">Enroll for Free</button></div>';
        }
        const mIdx = s.month || 0;
        const sIdx = s.step || 0;
        const totalSteps = 16;
        const currentProgress = ((mIdx * 4 + sIdx) / totalSteps) * 100;
        if(mIdx >= 4) {
            return '<div class="card" style="background: linear-gradient(135deg, #1b4332, #2d6a4f); color:white; text-align:center;">' +
                   '<h1>🏆</h1><h3>Master Farmer Certified</h3>' +
                   '<p>Congratulations, ' + s.name + '!</p>' +
                   '<button class="btn" onclick="agriEngine.resetEdu()" style="background:rgba(255,255,255,0.2);">Restart Course</button></div>';
        }
        const currentMonth = this.syllabus[mIdx];
        return '<div class="card" style="background:#fff; border-top: 5px solid #2d6a4f;">' +
               '<div style="display:flex; justify-content:space-between; align-items:center;">' +
               '<span style="font-weight:bold; color:#2d6a4f;">' + currentMonth.month + '</span>' +
               '<span style="font-size:12px; color:#666;">' + Math.round(currentProgress) + '% Complete</span>' +
               '</div>' +
               '<div style="width:100%; background:#eee; height:8px; border-radius:4px; margin:10px 0;">' +
               '<div style="width:' + currentProgress + '%; background:#409167; height:100%; border-radius:4px; transition:0.5s;"></div>' +
               '</div>' +
               '<h3 style="margin:10px 0;">' + currentMonth.icon + ' ' + currentMonth.title + '</h3>' +
               '<div style="background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid #409167; margin-bottom:15px;">' +
               '<small style="color:#666; text-transform:uppercase;">Current Lesson</small>' +
               '<div style="font-size:16px; font-weight:bold; color:#1b4332;">' + currentMonth.steps[sIdx] + '</div>' +
               '</div>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Complete Lesson & Advance →</button></div>';
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.step = (s.step || 0) + 1;
        if(s.step >= 4) {
            s.month = (s.month || 0) + 1;
            s.step = 0;
            alert("🌟 Month Completed! Moving to " + (this.syllabus[s.month]?.title || "Graduation"));
        }
        localStorage.setItem('agri_student', JSON.stringify(s));
        this.sync();
    },
    enroll: function() {
        const n = prompt("Enter Student Name:");
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n, month:0, step:0})); this.sync(); }
    },
    resetEdu: function() {
        if(confirm("Are you sure you want to restart your education?")) {
            let s = JSON.parse(localStorage.getItem('agri_student'));
            s.month = 0; s.step = 0;
            localStorage.setItem('agri_student', JSON.stringify(s));
            this.sync();
        }
    },
    // Maintaining Tools Consistency
    getToolsHtml: function() {
        return '<div class="card"><h3>🛠️ Smart Tools</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
               '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield</button>' +
               '<button class="btn" onclick="agriEngine.storeCalc()" style="background:#7209b7;">🏠 Store</button>' +
               '<button class="btn" onclick="agriEngine.harvestTimer()" style="background:#57cc99;">📅 Harvest</button>' +
               '<button class="btn" onclick="agriEngine.pestScan()" style="background:#d00000;">🔍 Pest</button>' +
               '</div></div>';
    },
    getBroadcastHtml: function() {
        const m = localStorage.getItem('agri_broadcast');
        return m ? '<div style="background:#ff9100; color:black; padding:8px; text-align:center;"><marquee>' + m + '</marquee></div>' : '';
    },
    getWeatherHtml: function() { return '<div class="card" style="background:#001d3d; color:white;"><h3>📉 Markets</h3><p>Maize (90kg): KES 3,850</p></div>'; },
    getAuthHtml: function() { return this.isAdmin ? '<div class="card" style="background:#1b4332; color:white;">🛡️ Admin Active <button class="btn" onclick="agriEngine.logout()">Logout</button></div>' : ''; },
    getAdminHtml: function() { let h = '<div class="card" style="background:#000;"><div id="sys-clock" style="color:lime; font-size:12px;"></div>'; h += this.isAdmin ? '<button class="btn" style="width:100%; margin-top:10px; background:#ff9100; color:black;" onclick="agriEngine.postBroadcast()">📢 Alert</button>' : '<button class="btn" style="background:none; border:1px solid #444; width:100%; margin-top:10px;" onclick="agriEngine.login()">Admin Login</button>'; h += '</div>'; return h; },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } },
    logout: function() { this.isAdmin = false; this.sync(); },
    calcYield: function() { alert("Yield logic active."); },
    storeCalc: function() { alert("Storage logic active."); },
    harvestTimer: function() { alert("Harvest logic active."); },
    pestScan: function() { alert("Pest logic active."); },
    postBroadcast: function() { const m = prompt("Message:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } }
};
agriEngine.init();
