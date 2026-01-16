const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        view.innerHTML = '<div id="section-tools"></div><div id="section-weather"></div><div id="section-academy"></div><div id="section-financials"></div><div id="section-admin"></div>';
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | SYSTEM SECURE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        this.renderTools();
        this.renderWeather();
        this.renderAcademy();
        this.renderFinancials();
        this.renderAdmin();
    },
    renderTools: function() {
        document.getElementById('section-tools').innerHTML = '<div class="card" style="border-bottom: 3px solid #ffcc00;"><h3>🛠️ Farmer Tools</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;"><button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button><button class="btn" onclick="agriEngine.checkLoan()" style="background:#8338ec;">💰 Loan Check</button><button class="btn" onclick="agriEngine.checkGroup()" style="background:#06d6a0;">👥 Group Power</button><button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button></div></div>';
    },
    renderWeather: function() {
        const markets = [
            { city: "Nairobi", price: "3,850", trend: "🔼" },
            { city: "Eldoret", price: "3,100", trend: "🔽" },
            { city: "Nakuru", price: "3,400", trend: "↔️" }
        ];
        let h = '<div class="card" style="background:#001d3d; border:1px solid #ffc300;"><h3 style="color:#ffc300;">📉 Market Prices (90kg)</h3>';
        markets.forEach(m => {
            h += '<div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #003566;"><span>' + m.city + '</span><span style="color:white;">KES ' + m.price + ' ' + m.trend + '</span></div>';
        });
        h += '<p style="font-size:10px; color:#aaa; margin-top:10px;">🌤️ Weather: Expected light rains in Rift Valley.</p></div>';
        document.getElementById('section-weather').innerHTML = h;
    },
    renderAcademy: function() {
        const s = JSON.parse(localStorage.getItem('agri_student'));
        document.getElementById('section-academy').innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>🎓 Learning Portal</h3>' + (s ? '<p>Student: <b>' + s.name + '</b></p>' : '<button class="btn" onclick="agriEngine.enroll()">Register</button>') + '</div>';
    },
    renderFinancials: function() {
        const l = JSON.parse(localStorage.getItem('agri_loan')), g = JSON.parse(localStorage.getItem('agri_group'));
        if(!l && !g) { document.getElementById('section-financials').innerHTML = ''; return; }
        let h = '<div class="card" style="background:#111; border:1px solid #9d4edd;"><h3>🏦 Projections</h3>';
        if(l) h += '<p style="color:#9d4edd;">Loan: <b>KES ' + l.limit.toLocaleString() + '</b></p>';
        if(g) h += '<p style="color:#06d6a0;">Group: <b>' + g.totalBags + ' Bags</b></p>';
        h += '<button class="btn" style="width:100%; font-size:9px;" onclick="agriEngine.clearFin()">Clear</button></div>';
        document.getElementById('section-financials').innerHTML = h;
    },
    renderAdmin: function() {
        document.getElementById('section-admin').innerHTML = '<div class="card" style="background:#000; border:1px solid #333;"><div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div><p style="font-size:0.8em; margin:5px 0;">Dev: ' + this.author.name + '</p><button class="btn" style="background:none; border:1px solid red; color:red; width:100%;" onclick="agriEngine.reset()">Full Reset</button></div>';
    },
    enroll: function() { const n = prompt("Name:"); if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n})); this.sync(); } },
    calcYield: function() { const a = prompt("Acres:"); if(a) alert("Yield: " + (a*28) + " bags"); },
    checkLoan: function() { const b = prompt("Bags:"); if(b) { localStorage.setItem('agri_loan', JSON.stringify({limit: (b*3500*0.4)})); this.sync(); } },
    checkGroup: function() { const m = prompt("Members:"); if(m) { localStorage.setItem('agri_group', JSON.stringify({totalBags: (m*30)})); this.sync(); } },
    clearFin: function() { localStorage.removeItem('agri_loan'); localStorage.removeItem('agri_group'); this.sync(); },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Reset all?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
