const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
    creds: { user: "robin", pass: "1234" },
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
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | LOGISTICS ACTIVE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        this.updateSection('broadcast', this.getBroadcastHtml());
        this.updateSection('auth', this.getAuthHtml());
        this.updateSection('academy', this.getAcademyHtml());
        this.updateSection('tools', this.getToolsHtml());
        this.updateSection('weather', this.getWeatherHtml());
        this.updateSection('financials', this.getFinancialsHtml());
        this.updateSection('admin', this.getAdminHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getToolsHtml: function() {
        return '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
               '<h3>🛠️ Smart Tools</h3>' +
               '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
               '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield</button>' +
               '<button class="btn" onclick="agriEngine.storeCalc()" style="background:#7209b7;">🏠 Store Calc</button>' +
               '<button class="btn" onclick="agriEngine.harvestTimer()" style="background:#57cc99;">📅 Harvest</button>' +
               '<button class="btn" onclick="agriEngine.pestScan()" style="background:#d00000;">🔍 Pest Scan</button>' +
               '</div></div>';
    },
    storeCalc: function() {
        const l = prompt("Enter Store Length (feet):", "10");
        const w = prompt("Enter Store Width (feet):", "10");
        const h = prompt("Enter Max Stack Height (feet):", "6");
        if(l && w && h) {
            // Formula: (L * W * H) / 4.5 cubic feet per 90kg bag (approx)
            // We subtract 20% for air circulation corridors
            const volume = l * w * h;
            const bags = Math.floor((volume * 0.8) / 4.5);
            alert("🏠 STORAGE ESTIMATE:\n\n" +
                  "Total Volume: " + volume + " cu.ft\n" +
                  "Safety Buffer: 20% (for air flow)\n\n" +
                  "Capacity: Approximately " + bags + " bags (90kg each)");
        }
    },
    getBroadcastHtml: function() {
        const msg = localStorage.getItem('agri_broadcast');
        return msg ? '<div style="background:#ff9100; color:black; padding:8px; text-align:center;"><marquee>' + msg + '</marquee></div>' : '';
    },
    getWeatherHtml: function() {
        return '<div class="card" style="background:#001d3d; border:1px solid #ffc300;"><h3 style="color:#ffc300;">📉 Market Ticker</h3><p>Nairobi: KES 3,850 | Eldoret: KES 3,100</p></div>';
    },
    getAcademyHtml: function() {
        const s = JSON.parse(localStorage.getItem('agri_student'));
        return '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>🎓 Academy</h3>' + (s ? '<p>Welcome, <b>' + s.name + '</b></p>' : '<button class="btn" onclick="agriEngine.enroll()">Register</button>') + '</div>';
    },
    getFinancialsHtml: function() {
        const l = JSON.parse(localStorage.getItem('agri_loan'));
        return l ? '<div class="card"><h3>🏦 Finance</h3><p>Loan: KES ' + l.limit.toLocaleString() + '</p></div>' : '';
    },
    getAuthHtml: function() {
        return this.isAdmin ? '<div class="card" style="background:#1b4332; color:white;">🛡️ Admin: robin <button class="btn" onclick="agriEngine.logout()">Logout</button></div>' : '';
    },
    getAdminHtml: function() {
        let h = '<div class="card" style="background:#000;"><div id="sys-clock" style="color:lime; font-size:12px;"></div>';
        h += this.isAdmin ? '<button class="btn" style="width:100%; margin-top:10px; background:#ff9100; color:black;" onclick="agriEngine.postBroadcast()">📢 Send Alert</button>' : '<button class="btn" style="background:none; border:1px solid #444; width:100%; margin-top:10px;" onclick="agriEngine.login()">Admin Login</button>';
        h += '</div>';
        return h;
    },
    enroll: function() { const n = prompt("Name:"); if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n, month:0, step:0})); this.sync(); } },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } },
    logout: function() { this.isAdmin = false; this.sync(); },
    calcYield: function() { const a = prompt("Acres:"); if(a) alert("Yield: " + (a*28) + " bags"); },
    harvestTimer: function() { alert("Use Harvest Clock for timing."); },
    pestScan: function() { alert("Use Pest Scan for identification."); },
    postBroadcast: function() { const m = prompt("Broadcast:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } }
};
agriEngine.init();
