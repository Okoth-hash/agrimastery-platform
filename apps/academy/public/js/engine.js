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
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | 10 TOOLS ACTIVE";
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
    getToolsHtml: function() {
        const tools = [
            { name: "Yield Calc", color: "#4cc9f0", icon: "📊", fn: "calcYield" },
            { name: "Store Calc", color: "#7209b7", icon: "🏠", fn: "storeCalc" },
            { name: "Harvest", color: "#409167", icon: "📅", fn: "harvestTimer" },
            { name: "Pest Scan", color: "#d00000", icon: "🔍", fn: "pestScan" },
            { name: "Soil Lab", color: "#3a86ff", icon: "🧪", fn: "soilCalc" },
            { name: "Seed Finder", color: "#fb5607", icon: "🌱", fn: "findSeeds" },
            { name: "Market Ads", color: "#ffbe0b", icon: "📢", fn: "marketAds" },
            { name: "Transport", color: "#3d5a80", icon: "🚛", fn: "transpCalc" },
            { name: "Livestock", color: "#ee6c4d", icon: "🐄", fn: "animalHealth" },
            { name: "Irrigation", color: "#00b4d8", icon: "💧", fn: "waterTimer" }
        ];
        let h = '<div class="card" style="border-bottom: 3px solid #ffcc00; padding-bottom:15px;">';
        h += '<h3>🛠️ Smart Tools (10)</h3>';
        h += '<div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; max-height:300px; overflow-y:auto; padding-right:5px;">';
        tools.forEach(t => {
            h += '<button onclick="agriEngine.' + t.fn + '()" class="btn" style="background:' + t.color + '; font-size:11px; padding:12px 5px; display:flex; flex-direction:column; align-items:center; justify-content:center;">';
            h += '<span style="font-size:18px;">' + t.icon + '</span>' + t.name + '</button>';
        });
        h += '</div></div>';
        return h;
    },
    // TOOL LOGIC
    calcYield: function() { alert("Yield: Acres x 28 bags (avg)"); },
    storeCalc: function() { alert("Storage: Vol / 4.5 cu.ft per bag"); },
    harvestTimer: function() { alert("Harvest: Planting Date + 135 Days"); },
    pestScan: function() { alert("Pest ID: Analyzing symptoms..."); },
    soilCalc: function() { alert("Soil: Testing N-P-K levels..."); },
    findSeeds: function() { alert("Seeds: High (H614) | Low (Katumani)"); },
    marketAds: function() { alert("Market: Connect to bulk buyers."); },
    transpCalc: function() { const km = prompt("Distance (km):"); if(km) alert("Est. Cost: KES " + (km * 150)); },
    animalHealth: function() { alert("Vet: Checking vaccination cycles."); },
    waterTimer: function() { alert("Water: Next cycle starts in 4 hours."); },
    getBroadcastHtml: function() { const m = localStorage.getItem('agri_broadcast'); return m ? '<div style="background:#ff9100; padding:8px; text-align:center;"><marquee>' + m + '</marquee></div>' : ''; },
    getAcademyHtml: function() { const s = JSON.parse(localStorage.getItem('agri_student')); return '<div class="card"><h3>🎓 Academy</h3>' + (s ? '<p>Hi ' + s.name + '</p>' : '<button onclick="agriEngine.enroll()">Enroll</button>') + '</div>'; },
    getWeatherHtml: function() { return '<div class="card" style="background:#001d3d; color:white;"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    getAuthHtml: function() { return this.isAdmin ? '<div class="card" style="background:#1b4332; color:white;">🛡️ Admin <button onclick="agriEngine.logout()">X</button></div>' : ''; },
    getAdminHtml: function() { let h = '<div class="card" style="background:#000;"><div id="sys-clock" style="color:lime; font-size:12px;"></div>'; h += this.isAdmin ? '<button class="btn" onclick="agriEngine.postBroadcast()">📢 Alert</button>' : '<button class="btn" onclick="agriEngine.login()">Admin Login</button>'; h += '</div>'; return h; },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } },
    logout: function() { this.isAdmin = false; this.sync(); },
    postBroadcast: function() { const m = prompt("Message:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } },
    enroll: function() { const n = prompt("Name:"); if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n, month:0, step:0})); this.sync(); } }
};
agriEngine.init();
