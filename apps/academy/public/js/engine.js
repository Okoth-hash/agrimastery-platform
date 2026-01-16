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
        // Master Heartbeat: Alerts + Clock
        setInterval(() => {
            this.checkAlerts();
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + (this.isAdmin ? " | ADMIN CONSOLE" : " | SYSTEM ONLINE");
        }, 1000);
        this.sync();
    },
    sync: function() {
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('tools', this.getToolsHtml());
        this.updateSection('weather', this.getWeatherHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    checkAlerts: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        const alertBox = document.getElementById('section-broadcast');
        if(!s || !alertBox) return;
        let advisory = "";
        if(s.month === 0) advisory = "🚨 SOIL ALERT: Ensure N-P-K testing is complete before Week 2.";
        else if(s.month === 1) advisory = "🌿 PEST ALERT: Scouting for Fall Armyworm required this week.";
        else if(s.month === 2) advisory = "🛡️ WEATHER ALERT: High humidity. Monitor for Maize Leaf Rust.";
        else if(s.month === 3) advisory = "💰 HARVEST ALERT: Check grain moisture levels before storage.";
        alertBox.innerHTML = '<div style="background:#d00000; color:white; padding:10px; font-weight:bold; text-align:center;">' + advisory + '</div>';
    },
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) {
            return '<div class="card"><h3>🎓 Join Academy</h3>' +
                   '<input type="text" id="reg-name" placeholder="Full Name" style="width:90%; padding:8px; margin-bottom:5px;">' +
                   '<input type="number" id="reg-id" placeholder="ID Number" style="width:90%; padding:8px; margin-bottom:5px;">' +
                   '<input type="email" id="reg-email" placeholder="Email" style="width:90%; padding:8px; margin-bottom:10px;">' +
                   '<button class="btn" style="width:100%; background:#2d6a4f;" onclick="agriEngine.register()">Register & Start</button></div>';
        }
        const prog = Math.round(((s.month * 4 + s.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f;">' +
               '<h3>👋 ' + s.name + ' (' + prog + '%)</h3>' +
               '<p>Current: <b>' + this.syllabus[s.month].steps[s.step] + '</b></p>' +
               '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Mark Complete</button></div>';
    },
    register: function() {
        const u = { 
            name: document.getElementById('reg-name').value, 
            id: document.getElementById('reg-id').value, 
            email: document.getElementById('reg-email').value, 
            month: 0, step: 0 
        };
        if(!u.name || !u.id) return alert("ID & Name Required");
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
    getToolsHtml: function() {
        const tools = [
            { n: "Loan Check", c: "#ff006e", i: "🏦", f: "loanCheck" },
            { n: "Yield", c: "#4cc9f0", i: "📊", f: "calcYield" },
            { n: "Store", c: "#7209b7", i: "🏠", f: "storeCalc" },
            { n: "Harvest", c: "#409167", i: "📅", f: "harvestTimer" },
            { n: "Pest", c: "#d00000", i: "🔍", f: "pestScan" },
            { n: "Soil", c: "#3a86ff", i: "🧪", f: "soilCalc" },
            { n: "Seeds", c: "#fb5607", i: "🌱", f: "findSeeds" },
            { n: "Market", c: "#ffbe0b", i: "📢", f: "marketAds" },
            { n: "Transport", c: "#3d5a80", i: "🚛", f: "transpCalc" },
            { n: "Animals", c: "#ee6c4d", i: "🐄", f: "animalHealth" }
        ];
        let h = '<div class="card"><h3>🛠️ Smart Tools (10)</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; max-height:220px; overflow-y:auto;">';
        tools.forEach(t => h += '<button onclick="agriEngine.'+t.f+'()" class="btn" style="background:'+t.c+'; font-size:10px;">'+t.i+' '+t.n+'</button>');
        return h + '</div></div>';
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) {
            const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<h4>Roster ('+r.length+')</h4><button class="btn" onclick="agriEngine.exportData()" style="width:100%; background:#4361ee;">Export CSV</button>';
            h += '<button class="btn" onclick="agriEngine.logout()" style="width:100%; background:red; margin-top:5px;">Logout</button>';
        } else {
            h += '<div id="sys-clock" style="color:lime; font-size:11px;"></div><button class="btn" style="background:none; border:1px solid #444; width:100%;" onclick="agriEngine.login()">Admin Login</button>';
        }
        return h + '</div>';
    },
    // TOOLS LOGIC
    loanCheck: function() { 
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) return alert("Register first!");
        const amt = Math.round(15000 * (0.5 + ((s.month * 4 + s.step)/16)));
        alert("Eligible Credit: KES " + amt.toLocaleString());
    },
    exportData: function() {
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        let csv = "Name,ID,Progress\n";
        r.forEach(u => csv += "","",%\n);
        const b = new Blob([csv], {type: 'text/csv'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'students.csv'; a.click();
    },
    login: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; this.sync(); } },
    logout: function() { this.isAdmin=false; this.sync(); },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    calcYield: function() { alert("Yield calc active"); },
    storeCalc: function() { alert("Store calc active"); },
    harvestTimer: function() { alert("Harvest timer active"); },
    pestScan: function() { alert("Pest scan active"); },
    soilCalc: function() { alert("Soil lab active"); },
    findSeeds: function() { alert("Seed finder active"); },
    marketAds: function() { alert("Market ads active"); },
    transpCalc: function() { alert("Transport calc active"); },
    animalHealth: function() { alert("Animal health active"); }
};
agriEngine.init();
