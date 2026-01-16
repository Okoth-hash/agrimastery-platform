const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
    creds: { user: "robin", pass: "1234" },
    syllabus: [
        { month: "Month 1", title: "Land & Foundation", icon: "🌱", steps: ["Soil Testing", "Land Clearing", "Seed Selection", "Planting"] },
        { month: "Month 2", title: "Growth & Nutrition", icon: "💦", steps: ["First Weeding", "Top Dressing", "Pest Scouting", "Thinning"] },
        { month: "Month 3", title: "Protection", icon: "🛡️", steps: ["Second Weeding", "Fungal Check", "Bird Control", "Monitoring"] },
        { month: "Month 4", title: "Harvest & Wealth", icon: "💰", steps: ["Field Drying", "Shelling", "Aflatoxin Test", "Storage"] }
    ],
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
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + (this.isAdmin ? " | ADMIN ACTIVE" : " | SYSTEM ONLINE");
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
    // --- ACADEMY LOGIC ---
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) {
            return '<div class="card" style="border-top:5px solid #2d6a4f;">' +
                   '<h3>🎓 Student Registration</h3>' +
                   '<input type="text" id="reg-name" placeholder="Full Name" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<input type="number" id="reg-id" placeholder="ID Number" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<input type="email" id="reg-email" placeholder="Email" style="width:90%; margin:5px 0; padding:8px;">' +
                   '<select id="reg-gender" style="width:96%; margin:5px 0; padding:8px;"><option value="Male">Male</option><option value="Female">Female</option></select>' +
                   '<button class="btn" style="width:100%; background:#2d6a4f; margin-top:10px;" onclick="agriEngine.register()">Join Academy</button></div>';
        }
        const prog = Math.round(((s.month * 4 + s.step) / 16) * 100);
        if(s.month >= 4) return '<div class="card" style="background:#1b4332; color:white; text-align:center;">🏆 Master Farmer Certified!</div>';
        return '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<h3>📖 ' + this.syllabus[s.month].title + '</h3>' +
               '<div style="background:#eee; height:8px; border-radius:4px; margin:10px 0;"><div style="width:'+prog+'%; background:#409167; height:100%;"></div></div>' +
               '<p>Next: <b>' + this.syllabus[s.month].steps[s.step] + '</b></p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Mark Done</button></div>';
    },
    register: function() {
        const u = { name: document.getElementById('reg-name').value, id: document.getElementById('reg-id').value, email: document.getElementById('reg-email').value, gender: document.getElementById('reg-gender').value, month: 0, step: 0 };
        if(!u.name || !u.id) return alert("Fill Name/ID");
        localStorage.setItem('agri_current_user', JSON.stringify(u));
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        r.push(u); localStorage.setItem('agri_master_roster', JSON.stringify(r));
        this.sync();
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_current_user'));
        s.step++; if(s.step >= 4) { s.month++; s.step = 0; }
        localStorage.setItem('agri_current_user', JSON.stringify(s));
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const i = r.findIndex(x => x.id === s.id); if(i!==-1) { r[i] = s; localStorage.setItem('agri_master_roster', JSON.stringify(r)); }
        this.sync();
    },
    // --- SMART TOOLS (THE 10) ---
    getToolsHtml: function() {
        const tools = [
            { n: "Yield", c: "#4cc9f0", i: "📊", f: "calcYield" }, { n: "Store", c: "#7209b7", i: "🏠", f: "storeCalc" },
            { n: "Harvest", c: "#409167", i: "📅", f: "harvestTimer" }, { n: "Pest", c: "#d00000", i: "🔍", f: "pestScan" },
            { n: "Soil", c: "#3a86ff", i: "🧪", f: "soilCalc" }, { n: "Seeds", c: "#fb5607", i: "🌱", f: "findSeeds" },
            { n: "Market", c: "#ffbe0b", i: "📢", f: "marketAds" }, { n: "Transport", c: "#3d5a80", i: "🚛", f: "transpCalc" },
            { n: "Animals", c: "#ee6c4d", i: "🐄", f: "animalHealth" }, { n: "Water", c: "#00b4d8", i: "💧", f: "waterTimer" }
        ];
        let h = '<div class="card"><h3>🛠️ Smart Tools</h3><div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; max-height:220px; overflow-y:auto;">';
        tools.forEach(t => h += '<button onclick="agriEngine.'+t.f+'()" class="btn" style="background:'+t.c+'; font-size:10px;">'+t.i+' '+t.n+'</button>');
        return h + '</div></div>';
    },
    // --- ADMIN & EXPORT ---
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) {
            const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<h4 style="color:lime; margin:0;">Admin Roster ('+r.length+')</h4><div style="font-size:10px; margin:10px 0;">';
            r.forEach(u => h += u.name + ' (' + Math.round((u.month*4+u.step)/16*100) + '%)<br>');
            h += '</div><button class="btn" onclick="agriEngine.exportData()" style="width:100%; background:#4361ee;">📥 Export CSV</button>';
            h += '<button class="btn" onclick="agriEngine.logout()" style="width:100%; background:red; margin-top:5px;">Logout</button>';
        } else {
            h += '<div id="sys-clock" style="color:lime; font-size:11px; margin-bottom:5px;"></div><button class="btn" style="background:none; border:1px solid #444; width:100%;" onclick="agriEngine.login()">Admin Login</button>';
        }
        return h + '</div>';
    },
    exportData: function() {
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        let csv = "Name,ID,Email,Progress\n";
        r.forEach(u => csv += "","","",%\n);
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'roster.csv'; a.click();
    },
    login: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; this.sync(); } },
    logout: function() { this.isAdmin=false; this.sync(); },
    calcYield: function() { alert("Yield: Acres x 28 bags"); },
    storeCalc: function() { alert("Store: Volume / 4.5 per bag"); },
    harvestTimer: function() { alert("Harvest: Planting + 135 Days"); },
    pestScan: function() { alert("Pest ID: Analyzing..."); },
    soilCalc: function() { alert("Soil Lab: Initializing..."); },
    findSeeds: function() { alert("Seeds: High (H614) | Low (Katumani)"); },
    marketAds: function() { alert("Markets: Fetching buyers..."); },
    transpCalc: function() { alert("Transport: KES 150/km"); },
    animalHealth: function() { alert("Animals: Vet Check Active"); },
    waterTimer: function() { alert("Water: Irrigation scheduled"); },
    getBroadcastHtml: function() { const m = localStorage.getItem('agri_broadcast'); return m ? '<marquee style="background:#ff9100; padding:5px;">'+m+'</marquee>' : ''; },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    getAuthHtml: function() { return ''; },
    postBroadcast: function() { const m = prompt("Message:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } }
};
agriEngine.init();
