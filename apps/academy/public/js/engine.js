const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
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
        div.innerHTML = msg ? '<div style="background:#ff9100; color:black; padding:8px; font-weight:bold; text-align:center; font-size:12px;"><marquee>' + msg + '</marquee></div>' : '';
    },
    renderAuth: function() {
        const authDiv = document.getElementById('section-auth');
        if (this.isAdmin) {
            const feedback = JSON.parse(localStorage.getItem('agri_inbox') || "[]");
            let h = '<div class="card" style="background:#1b4332; border:1px solid #74c69d;"><h3 style="color:#74c69d;">🛡️ Admin Dashboard</h3>';
            h += '<div style="background:#000; padding:10px; margin-bottom:10px; border-radius:5px;">';
            h += '<h4 style="color:#ff9100; margin:0 0 5px 0;">📬 Feedback Inbox (' + feedback.length + ')</h4>';
            feedback.forEach((f, i) => {
                h += '<div style="font-size:11px; border-bottom:1px solid #333; padding:5px 0;"><b>' + f.user + ':</b> ' + f.msg + '</div>';
            });
            if(feedback.length > 0) h += '<button class="btn" style="width:100%; font-size:9px; margin-top:5px;" onclick="agriEngine.clearInbox()">Clear Inbox</button>';
            h += '</div><button class="btn" style="width:100%; background:#d00000;" onclick="agriEngine.logout()">Logout</button></div>';
            authDiv.innerHTML = h;
        } else {
            authDiv.innerHTML = ''; 
        }
    },
    renderTools: function() {
        document.getElementById('section-tools').innerHTML = '<div class="card" style="border-bottom: 3px solid #ffcc00;"><h3>🛠️ Farmer Tools</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;"><button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button><button class="btn" onclick="agriEngine.checkLoan()" style="background:#8338ec;">💰 Loan Check</button><button class="btn" onclick="agriEngine.sendFeedback()" style="background:#4361ee;">📩 Feedback</button><button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button></div></div>';
    },
    sendFeedback: function() {
        const s = JSON.parse(localStorage.getItem('agri_student'));
        const name = s ? s.name : "Anonymous";
        const msg = prompt("Send a message to Admin:");
        if(msg) {
            const inbox = JSON.parse(localStorage.getItem('agri_inbox') || "[]");
            inbox.push({user: name, msg: msg});
            localStorage.setItem('agri_inbox', JSON.stringify(inbox));
            alert("Feedback sent to Robin!");
        }
    },
    clearInbox: function() { localStorage.setItem('agri_inbox', "[]"); this.sync(); },
    postBroadcast: function() { const msg = prompt("Enter broadcast:"); if(msg) { localStorage.setItem('agri_broadcast', msg); this.sync(); } },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } else { alert("Denied"); } },
    logout: function() { this.isAdmin = false; this.sync(); },
    renderWeather: function() { document.getElementById('section-weather').innerHTML = '<div class="card" style="background:#001d3d; border:1px solid #ffc300;"><h3 style="color:#ffc300;">📉 Market Ticker</h3><p>Nairobi: KES 3,850 | Eldoret: KES 3,100</p></div>'; },
    renderAcademy: function() { const s = JSON.parse(localStorage.getItem('agri_student')); document.getElementById('section-academy').innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>🎓 Academy</h3>' + (s ? '<p>Student: <b>' + s.name + '</b></p>' : '<button class="btn" onclick="agriEngine.enroll()">Register</button>') + '</div>'; },
    renderFinancials: function() { const l = JSON.parse(localStorage.getItem('agri_loan')), g = JSON.parse(localStorage.getItem('agri_group')); if(!l && !g) { document.getElementById('section-financials').innerHTML = ''; return; } let h = '<div class="card" style="background:#111; border:1px solid #9d4edd;"><h3>🏦 Projections</h3>'; if(l) h += '<p style="color:#9d4edd;">Loan: <b>KES ' + l.limit.toLocaleString() + '</b></p>'; if(g) h += '<p style="color:#06d6a0;">Group: <b>' + g.totalBags + ' Bags</b></p>'; h += '</div>'; document.getElementById('section-financials').innerHTML = h; },
    renderAdmin: function() {
        let h = '<div class="card" style="background:#000; border:1px solid #333;"><div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>';
        if(this.isAdmin) {
            h += '<button class="btn" style="width:100%; margin-top:10px; background:#ff9100; color:black;" onclick="agriEngine.postBroadcast()">📢 Update Broadcast</button>';
        } else {
            h += '<button class="btn" style="background:none; border:1px solid #444; color:#666; width:100%; margin-top:10px;" onclick="agriEngine.login()">Admin Login</button>';
        }
        h += '</div>';
        document.getElementById('section-admin').innerHTML = h;
    },
    enroll: function() { const n = prompt("Name:"); if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n})); this.sync(); } },
    calcYield: function() { const a = prompt("Acres:"); if(a) alert("Yield: " + (a*28) + " bags"); },
    checkLoan: function() { const b = prompt("Bags:"); if(b) { localStorage.setItem('agri_loan', JSON.stringify({limit: (b*3500*0.4)})); this.sync(); } },
    checkGroup: function() { const m = prompt("Members:"); if(m) { localStorage.setItem('agri_group', JSON.stringify({totalBags: (m*30)})); this.sync(); } },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Confirm Wipe?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
