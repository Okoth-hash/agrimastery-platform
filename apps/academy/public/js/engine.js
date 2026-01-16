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
            if(el) el.innerText = new Date().toLocaleTimeString() + " | SOIL ANALYZER ACTIVE";
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
               '<button class="btn" onclick="agriEngine.findSeeds()" style="background:#fb5607;">🌱 Seeds</button>' +
               '<button class="btn" onclick="agriEngine.soilCalc()" style="background:#3a86ff;">🧪 Soil Lab</button>' +
               '<button class="btn" onclick="agriEngine.sendFeedback()" style="background:#4361ee;">📩 Message</button>' +
               '</div></div>';
    },
    soilCalc: function() {
        const level = prompt("Is your soil Nitrogen (N) level:\n1. Low\n2. Medium\n3. High", "1");
        const acres = prompt("How many acres?", "1");
        let recommendation = "";
        if(level == "1") recommendation = "Apply 50kg of DAP at planting and 50kg of CAN per acre as top dress.";
        else if(level == "2") recommendation = "Apply 25kg of DAP at planting and 50kg of CAN per acre as top dress.";
        else recommendation = "Soil is fertile. Use organic compost and 25kg of CAN per acre.";
        alert("SOIL RECOMMENDATION:\nFor " + acres + " Acre(s):\n\n" + recommendation);
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
    findSeeds: function() { alert("Highland: H614\nLowland: Katumani"); },
    sendFeedback: function() { const m = prompt("Message:"); if(m) { const i = JSON.parse(localStorage.getItem('agri_inbox') || "[]"); i.push({user: "Farmer", msg: m}); localStorage.setItem('agri_inbox', JSON.stringify(i)); alert("Sent!"); } },
    postBroadcast: function() { const m = prompt("Broadcast:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; }
};
agriEngine.init();
