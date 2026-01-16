const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
    // Updated Credentials
    creds: { user: "robin", pass: "1234" },
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        view.innerHTML = '<div id="section-broadcast"></div><div id="section-auth"></div><div id="section-tools"></div><div id="section-weather"></div><div id="section-academy"></div><div id="section-financials"></div><div id="section-admin"></div>';
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + (this.isAdmin ? " | ADMIN ACTIVE" : " | SECURE MODE");
        }, 1000);
        this.sync();
    },
    sync: function() {
        this.renderBroadcast();
        this.renderAuth();
        this.renderTools();
        this.renderWeather();
        this.renderAcademy();
        this.renderFinancials();
        this.renderAdmin();
    },
    renderBroadcast: function() {
        const msg = localStorage.getItem('agri_broadcast');
        const div = document.getElementById('section-broadcast');
        if(msg) {
            div.innerHTML = '<div style="background:#ff9100; color:black; padding:8px; font-weight:bold; text-align:center; font-size:12px;"><marquee>' + msg + '</marquee></div>';
        } else {
            div.innerHTML = '';
        }
    },
    renderAuth: function() {
        const authDiv = document.getElementById('section-auth');
        if (this.isAdmin) {
            authDiv.innerHTML = '<div class="card" style="background:#1b4332; border:1px solid #74c69d;"><h3 style="color:#74c69d;">🛡️ Admin: ' + this.creds.user + '</h3><button class="btn" style="width:100%; background:#d00000;" onclick="agriEngine.logout()">Logout</button></div>';
        } else {
            authDiv.innerHTML = ''; 
        }
    },
    renderAdmin: function() {
        let h = '<div class="card" style="background:#000; border:1px solid #333;">';
        h += '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>';
        h += '<p style="font-size:0.8em; margin:5px 0;">Dev: ' + this.author.name + '</p>';
        if(this.isAdmin) {
            h += '<div style="background:#222; padding:10px; border-radius:5px; margin-top:10px;">';
            h += '<h4 style="color:#ff9100; margin-top:0;">Admin Console</h4>';
            h += '<button class="btn" style="width:100%; font-size:10px; margin-bottom:5px; background:#ff9100; color:black;" onclick="agriEngine.postBroadcast()">📢 Send Alert</button>';
            h += '<button class="btn" style="width:100%; font-size:10px; margin-bottom:5px;" onclick="agriEngine.reset()">System Wipe</button>';
            h += '</div>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; color:#666; width:100%;" onclick="agriEngine.login()">Admin Login</button>';
        }
        h += '</div>';
        document.getElementById('section-admin').innerHTML = h;
    },
    login: function() {
        const u = prompt("Username:");
        const p = prompt("Password:");
        if(u === this.creds.user && p === this.creds.pass) {
            this.isAdmin = true;
            this.sync();
        } else {
            alert("Access Denied.");
        }
    },
    postBroadcast: function() {
        const msg = prompt("Enter alert message for all farmers:");
        if(msg) {
            localStorage.setItem('agri_broadcast', msg);
            this.sync();
        }
    },
    logout: function() { this.isAdmin = false; this.sync(); },
    renderTools: function() { document.getElementById('section-tools').innerHTML = '<div class="card" style="border-bottom: 3px solid #ffcc00;"><h3>🛠️ Farmer Tools</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;"><button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button><button class="btn" onclick="agriEngine.checkLoan()" style="background:#8338ec;">💰 Loan Check</button><button class="btn" onclick="agriEngine.checkGroup()" style="background:#06d6a0;">👥 Group Power</button><button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button></div></div>'; },
    renderWeather: function() { document.getElementById('section-weather').innerHTML = '<div class="card" style="background:#001d3d; border:1px solid #ffc300;"><h3 style="color:#ffc300;">📉 Market Ticker</h3><p>Nairobi: KES 3,850 | Eldoret: KES 3,100</p></div>'; },
    renderAcademy: function() { const s = JSON.parse(localStorage.getItem('agri_student')); document.getElementById('section-academy').innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>🎓 Academy</h3>' + (s ? '<p>Student: <b>' + s.name + '</b></p>' : '<button class="btn" onclick="agriEngine.enroll()">Register</button>') + '</div>'; },
    renderFinancials: function() { const l = JSON.parse(localStorage.getItem('agri_loan')), g = JSON.parse(localStorage.getItem('agri_group')); if(!l && !g) { document.getElementById('section-financials').innerHTML = ''; return; } let h = '<div class="card" style="background:#111; border:1px solid #9d4edd;"><h3>🏦 Projections</h3>'; if(l) h += '<p style="color:#9d4edd;">Loan: <b>KES ' + l.limit.toLocaleString() + '</b></p>'; if(g) h += '<p style="color:#06d6a0;">Group: <b>' + g.totalBags + ' Bags</b></p>'; h += '</div>'; document.getElementById('section-financials').innerHTML = h; },
    enroll: function() { const n = prompt("Name:"); if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n})); this.sync(); } },
    calcYield: function() { const a = prompt("Acres:"); if(a) alert("Yield: " + (a*28) + " bags"); },
    checkLoan: function() { const b = prompt("Bags:"); if(b) { localStorage.setItem('agri_loan', JSON.stringify({limit: (b*3500*0.4)})); this.sync(); } },
    checkGroup: function() { const m = prompt("Members:"); if(m) { localStorage.setItem('agri_group', JSON.stringify({totalBags: (m*30)})); this.sync(); } },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Confirm Wipe?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
