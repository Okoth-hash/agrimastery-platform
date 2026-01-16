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
        // Live Notification Engine
        setInterval(() => {
            this.checkAlerts();
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | ADVISORY ACTIVE";
        }, 1000);
        this.sync();
    },
    checkAlerts: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        const alertBox = document.getElementById('section-broadcast');
        if(!s || !alertBox) return;
        let advisory = "";
        // Logic based on Academy Month
        if(s.month === 0) advisory = "🚨 ACTION: Ensure your soil test is done before planting!";
        else if(s.month === 1) advisory = "🌿 ADVISORY: Growth phase detected. Scout for Fall Armyworm today.";
        else if(s.month === 2) advisory = "🛡️ PROTECT: High humidity forecast. Check for leaf rust/fungus.";
        else if(s.month === 3) advisory = "💰 HARVEST: Ensure store is clean and pallets are ready.";
        if(advisory) {
            alertBox.innerHTML = '<div style="background:#d00000; color:white; padding:10px; font-weight:bold; text-align:center; border-bottom:3px solid #000;">' + advisory + '</div>';
        }
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
    getToolsHtml: function() {
        const tools = [
            { n: "Alert Settings", c: "#ff9100", i: "🔔", f: "alertConfig" },
            { n: "Loan Check", c: "#ff006e", i: "🏦", f: "loanCheck" },
            { n: "Yield", c: "#4cc9f0", i: "📊", f: "calcYield" },
            { n: "Store", c: "#7209b7", i: "🏠", f: "storeCalc" },
            { n: "Harvest", c: "#409167", i: "📅", f: "harvestTimer" },
            { n: "Pest", c: "#d00000", i: "🔍", f: "pestScan" },
            { n: "Soil", c: "#3a86ff", i: "🧪", f: "soilCalc" },
            { n: "Seeds", c: "#fb5607", i: "🌱", f: "findSeeds" },
            { n: "Market", c: "#ffbe0b", i: "📢", f: "marketAds" },
            { n: "Animals", c: "#ee6c4d", i: "🐄", f: "animalHealth" }
        ];
        let h = '<div class="card"><h3>🛠️ Smart Tools</h3><div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; max-height:220px; overflow-y:auto;">';
        tools.forEach(t => h += '<button onclick="agriEngine.'+t.f+'()" class="btn" style="background:'+t.c+'; font-size:10px;">'+t.i+' '+t.n+'</button>');
        return h + '</div></div>';
    },
    alertConfig: function() {
        alert("System is currently auto-detecting your farm phase based on Academy progress. Manual alerts coming soon!");
    },
    // REUSED CORE LOGIC
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) return '<div class="card"><h3>🎓 Academy</h3><button class="btn" onclick="agriEngine.sync()">Join Now</button></div>';
        const prog = Math.round(((s.month * 4 + s.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>👋 ' + s.name + '</h3><p>Course Progress: '+prog+'%</p><button class="btn" onclick="agriEngine.nextStep()">Next Step</button></div>';
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_current_user'));
        s.step++; if(s.step >= 4) { s.month++; s.step = 0; }
        localStorage.setItem('agri_current_user', JSON.stringify(s));
        this.sync();
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) h += '<h4>Admin Mode</h4><button class="btn" onclick="agriEngine.logout()">Logout</button>';
        else h += '<button class="btn" style="background:none; color:#666;" onclick="agriEngine.login()">Admin Login</button>';
        return h + '</div>';
    },
    login: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; this.sync(); } },
    logout: function() { this.isAdmin=false; this.sync(); },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    loanCheck: function() { alert("Credit Score: Active"); },
    calcYield: function() { alert("Yield calc active"); },
    storeCalc: function() { alert("Store calc active"); },
    harvestTimer: function() { alert("Harvest timer active"); },
    pestScan: function() { alert("Pest scan active"); },
    soilCalc: function() { alert("Soil lab active"); },
    findSeeds: function() { alert("Seed finder active"); },
    marketAds: function() { alert("Market ads active"); },
    animalHealth: function() { alert("Animal health active"); }
};
agriEngine.init();
