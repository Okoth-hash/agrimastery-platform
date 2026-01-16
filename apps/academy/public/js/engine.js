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
            this.checkAlerts();
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | SUPPORT ACTIVE";
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
        let advisory = (s.month === 0) ? "🚨 SOIL ALERT: Test N-P-K now." : (s.month === 1) ? "🌿 PEST ALERT: Scout for Fall Armyworm." : (s.month === 2) ? "🛡️ WEATHER ALERT: Check for Rust." : "💰 HARVEST: Check moisture.";
        alertBox.innerHTML = '<div style="background:#d00000; color:white; padding:10px; font-weight:bold; text-align:center;">' + advisory + '</div>';
    },
    getToolsHtml: function() {
        const tools = [
            { n: "Expert Help", c: "#25D366", i: "💬", f: "contactExpert" },
            { n: "Loan Check", c: "#ff006e", i: "🏦", f: "loanCheck" },
            { n: "Yield", c: "#4cc9f0", i: "📊", f: "calcYield" },
            { n: "Store", c: "#7209b7", i: "🏠", f: "storeCalc" },
            { n: "Harvest", c: "#409167", i: "📅", f: "harvestTimer" },
            { n: "Pest", c: "#d00000", i: "🔍", f: "pestScan" },
            { n: "Soil", c: "#3a86ff", i: "🧪", f: "soilCalc" },
            { n: "Seeds", c: "#fb5607", i: "🌱", f: "findSeeds" },
            { n: "Market", c: "#ffbe0b", i: "📢", f: "marketAds" },
            { n: "Transport", c: "#3d5a80", i: "🚛", f: "transpCalc" }
        ];
        let h = '<div class="card"><h3>🛠️ Smart Tools</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; max-height:220px; overflow-y:auto;">';
        tools.forEach(t => h += '<button onclick="agriEngine.'+t.f+'()" class="btn" style="background:'+t.c+'; font-size:10px;">'+t.i+' '+t.n+'</button>');
        return h + '</div></div>';
    },
    contactExpert: function() {
        const choice = confirm("Would you like to Chat with Robin on WhatsApp?");
        if(choice) {
            window.location.href = "https://wa.me/" + this.author.phone + "?text=Hello%20Robin,%20I%20need%20expert%20help%20with%20my%20farm.";
        }
    },
    // RE-ACTIVATED CORE LOGIC
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) return '<div class="card"><h3>🎓 Join Academy</h3><button class="btn" onclick="agriEngine.sync()">Start</button></div>';
        return '<div class="card"><h3>👋 ' + s.name + '</h3><button class="btn" onclick="agriEngine.nextStep()">Next Lesson</button></div>';
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_current_user'));
        s.step++; if(s.step >= 4) { s.month++; s.step = 0; }
        localStorage.setItem('agri_current_user', JSON.stringify(s));
        this.sync();
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) h += '<h4>Admin Active</h4><button class="btn" onclick="agriEngine.logout()">Logout</button>';
        else h += '<div id="sys-clock" style="color:lime; font-size:11px;"></div><button class="btn" style="background:none; color:#666;" onclick="agriEngine.login()">Admin Login</button>';
        return h + '</div>';
    },
    login: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; this.sync(); } },
    logout: function() { this.isAdmin=false; this.sync(); },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    loanCheck: function() { alert("Credit check active."); },
    calcYield: function() { alert("Yield calc active."); },
    storeCalc: function() { alert("Store calc active."); },
    harvestTimer: function() { alert("Harvest timer active."); },
    pestScan: function() { alert("Pest scan active."); },
    soilCalc: function() { alert("Soil lab active."); },
    findSeeds: function() { alert("Seed finder active."); },
    marketAds: function() { alert("Market ads active."); },
    transpCalc: function() { alert("Transport calc active."); }
};
agriEngine.init();
