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
            { n: "Yield", c: "#4cc9f0", i: "📊", f: "calcYield" }, { n: "Store", c: "#7209b7", i: "🏠", f: "storeCalc" },
            { n: "Harvest", c: "#409167", i: "📅", f: "harvestTimer" }, { n: "Pest", c: "#d00000", i: "🔍", f: "pestScan" },
            { n: "Soil", c: "#3a86ff", i: "🧪", f: "soilCalc" }, { n: "Loan Check", c: "#ff006e", i: "🏦", f: "loanCheck" },
            { n: "Seeds", c: "#fb5607", i: "🌱", f: "findSeeds" }, { n: "Market", c: "#ffbe0b", i: "📢", f: "marketAds" },
            { n: "Transport", c: "#3d5a80", i: "🚛", f: "transpCalc" }, { n: "Animals", c: "#ee6c4d", i: "🐄", f: "animalHealth" }
        ];
        let h = '<div class="card"><h3>🛠️ Smart Tools</h3><div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; max-height:220px; overflow-y:auto;">';
        tools.forEach(t => h += '<button onclick="agriEngine.'+t.f+'()" class="btn" style="background:'+t.c+'; font-size:10px;">'+t.i+' '+t.n+'</button>');
        return h + '</div></div>';
    },
    loanCheck: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) { alert("Please register in the Academy first to build your credit score."); return; }
        const acres = prompt("How many acres of land do you have?", "1");
        const progress = (s.month * 4 + s.step) / 16;
        // Algorithm: Base 5000 per acre * (Progress Multiplier)
        let baseAmount = acres * 15000;
        let finalAmount = Math.round(baseAmount * (0.5 + progress));
        let msg = "🏦 LOAN ELIGIBILITY REPORT\n\n";
        msg += "Student: " + s.name + "\n";
        msg += "Academic Score: " + Math.round(progress * 100) + "%\n";
        msg += "Farm Size: " + acres + " Acres\n\n";
        msg += "Eligible Amount: KES " + finalAmount.toLocaleString() + "\n";
        msg += "Interest Rate: 8% per annum\n\n";
        if(progress < 0.25) msg += "⚠️ TIP: Complete more lessons to increase your limit!";
        else msg += "✅ High Score! You are a low-risk borrower.";
        alert(msg);
    },
    // --- REMAINDER OF MASTER LOGIC ---
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_current_user'));
        if(!s) return '<div class="card"><h3>🎓 Academy</h3><button class="btn" onclick="agriEngine.sync()">Start Registration</button></div>';
        const prog = Math.round(((s.month * 4 + s.step) / 16) * 100);
        return '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>👋 ' + s.name + '</h3><p>Progress: '+prog+'%</p><button class="btn" onclick="agriEngine.nextStep()">Next Lesson</button></div>';
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_current_user'));
        s.step++; if(s.step >= 4) { s.month++; s.step = 0; }
        localStorage.setItem('agri_current_user', JSON.stringify(s));
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const i = r.findIndex(x => x.id === s.id); if(i!==-1) { r[i] = s; localStorage.setItem('agri_master_roster', JSON.stringify(r)); }
        this.sync();
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000; color:white;">';
        if(this.isAdmin) {
            const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
            h += '<h4 style="color:lime;">Admin Roster ('+r.length+')</h4>';
            h += '<button class="btn" onclick="agriEngine.exportData()" style="width:100%; background:#4361ee;">📥 Export CSV</button>';
            h += '<button class="btn" onclick="agriEngine.logout()" style="width:100%; background:red; margin-top:5px;">Logout</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; width:100%; color:#666;" onclick="agriEngine.login()">Admin Login</button>';
        }
        return h + '</div>';
    },
    exportData: function() {
        const r = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        let csv = "Name,ID,Progress\n";
        r.forEach(u => csv += "","",%\n);
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'roster.csv'; a.click();
    },
    login: function() { if(prompt("User:")==="robin" && prompt("Pass:")==="1234") { this.isAdmin=true; this.sync(); } },
    logout: function() { this.isAdmin=false; this.sync(); },
    getBroadcastHtml: function() { return ''; },
    getWeatherHtml: function() { return '<div class="card"><h3>📉 Markets</h3><p>Maize: KES 3,850</p></div>'; },
    getAuthHtml: function() { return ''; },
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
