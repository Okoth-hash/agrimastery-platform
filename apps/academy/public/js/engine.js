const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: false,
    creds: { user: "robin", pass: "1234" },
    // FULL SYLLABUS DATA
    syllabus: [
        { month: 1, title: "Month 1: Foundation & Planting", steps: [
            "Soil Testing: Ensure pH is between 5.5 and 7.0.",
            "Land Prep: Minimum tillage to preserve soil moisture.",
            "Seed Selection: Choose certified hybrids (e.g., H614 or DK series).",
            "Planting: 75cm x 25cm spacing; 2 inches deep."
        ]},
        { month: 2, title: "Month 2: Nutrition & Protection", steps: [
            "First Weeding: 2-3 weeks after germination.",
            "Top Dressing: Apply CAN or Urea at knee-high stage.",
            "Pest Scouting: Watch for Fall Armyworm in the funnel.",
            "Thinning: Remove weak seedlings to reduce competition."
        ]},
        { month: 3, title: "Month 3: Maturation & Monitoring", steps: [
            "Second Weeding: Prevent nutrients from being stolen during tasseling.",
            "Moisture Stress: Ensure soil stays damp during silking.",
            "Bird Control: Guard the field as grains begin to milk.",
            "Field Inspection: Identify healthy cobs for future planning."
        ]},
        { month: 4, title: "Month 4: Harvest & Wealth", steps: [
            "Proper Drying: Leave cobs on stalks until moisture drops.",
            "Salt Test: Ensure grain is below 13% moisture for storage.",
            "Hermetic Storage: Use PICS bags to stop weevil damage.",
            "Market Timing: Avoid selling immediately during harvest glut."
        ]}
    ],
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        view.innerHTML = '<div id="section-broadcast"></div><div id="section-auth"></div><div id="section-academy"></div><div id="section-tools"></div><div id="section-weather"></div><div id="section-financials"></div><div id="section-admin"></div>';
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + (this.isAdmin ? " | ADMIN MODE" : " | LEARNING ACTIVE");
        }, 1000);
        this.sync();
    },
    sync: function() {
        this.renderBroadcast();
        this.renderAuth();
        this.renderAcademy();
        this.renderTools();
        this.renderWeather();
        this.renderFinancials();
        this.renderAdmin();
    },
    renderAcademy: function() {
        const s = JSON.parse(localStorage.getItem('agri_student'));
        const div = document.getElementById('section-academy');
        if(!s) {
            div.innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;"><h3>🎓 Enroll in Academy</h3><p>Start your journey to becoming a certified Master Farmer.</p><button class="btn" onclick="agriEngine.enroll()">Register Now</button></div>';
            return;
        }
        const mIdx = s.month || 0;
        const sIdx = s.step || 0;
        if(mIdx >= this.syllabus.length) {
            div.innerHTML = '<div class="card" style="background:#2d6a4f; color:white; text-align:center;"><h3>🏆 GRADUATED</h3><p>Congratulations, <b>' + s.name + '</b>! You are now a Master Farmer.</p><button class="btn" onclick="agriEngine.resetEdu()" style="background:#000;">Retake Course</button></div>';
            return;
        }
        const currentMonth = this.syllabus[mIdx];
        const currentStepContent = currentMonth.steps[sIdx];
        div.innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;">' +
            '<h3 style="color:#2d6a4f;">' + currentMonth.title + '</h3>' +
            '<div style="background:#f0f0f0; padding:10px; border-radius:5px; margin:10px 0; color:#333;">' +
            '<b>Task ' + (sIdx + 1) + ':</b> ' + currentStepContent + '</div>' +
            '<div style="font-size:10px; color:#666; margin-bottom:10px;">Progress: ' + (mIdx + 1) + '/4 Months</div>' +
            '<button class="btn" style="width:100%;" onclick="agriEngine.nextStep()">Mark Task as Complete</button></div>';
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.step = (s.step || 0) + 1;
        if(s.step >= this.syllabus[s.month || 0].steps.length) {
            s.month = (s.month || 0) + 1;
            s.step = 0;
            alert("Congratulations! You have advanced to the next month.");
        }
        localStorage.setItem('agri_student', JSON.stringify(s));
        this.sync();
    },
    enroll: function() {
        const n = prompt("Enter Student Full Name:");
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n, month: 0, step: 0}));
            this.sync();
        }
    },
    resetEdu: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.month = 0; s.step = 0;
        localStorage.setItem('agri_student', JSON.stringify(s));
        this.sync();
    },
    // RE-INTEGRATING PREVIOUS TOOLS (Simplified for space)
    renderTools: function() { document.getElementById('section-tools').innerHTML = '<div class="card" style="border-bottom: 3px solid #ffcc00;"><h3>🛠️ Tools</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;"><button class="btn" onclick="agriEngine.calcYield()">📊 Yield</button><button class="btn" onclick="agriEngine.sendFeedback()" style="background:#4361ee;">📩 Message</button></div></div>'; },
    renderWeather: function() { document.getElementById('section-weather').innerHTML = '<div class="card" style="background:#001d3d; border:1px solid #ffc300;"><h3 style="color:#ffc300;">📉 Markets</h3><p>Nairobi: KES 3,850 | Eldoret: KES 3,100</p></div>'; },
    renderFinancials: function() { const l = JSON.parse(localStorage.getItem('agri_loan')); document.getElementById('section-financials').innerHTML = l ? '<div class="card"><h3>🏦 Finance</h3><p>Loan: KES ' + l.limit.toLocaleString() + '</p></div>' : ''; },
    renderAdmin: function() { let h = '<div class="card" style="background:#000;">'; if(this.isAdmin) { h += '<button class="btn" style="width:100%; background:#ff9100; color:black;" onclick="agriEngine.postBroadcast()">📢 Send Alert</button>'; } else { h += '<button class="btn" style="background:none; border:1px solid #444; width:100%;" onclick="agriEngine.login()">Admin Login</button>'; } h += '</div>'; document.getElementById('section-admin').innerHTML = h; },
    renderBroadcast: function() { const msg = localStorage.getItem('agri_broadcast'); document.getElementById('section-broadcast').innerHTML = msg ? '<div style="background:#ff9100; color:black; padding:8px; text-align:center;"><marquee>' + msg + '</marquee></div>' : ''; },
    renderAuth: function() { if(this.isAdmin) { document.getElementById('section-auth').innerHTML = '<div class="card" style="background:#1b4332; color:white;">🛡️ Admin: robin <button class="btn" onclick="agriEngine.logout()">Logout</button></div>'; } else { document.getElementById('section-auth').innerHTML = ''; } },
    login: function() { const u = prompt("User:"), p = prompt("Pass:"); if(u === this.creds.user && p === this.creds.pass) { this.isAdmin = true; this.sync(); } },
    logout: function() { this.isAdmin = false; this.sync(); },
    calcYield: function() { const a = prompt("Acres:"); if(a) alert("Yield: " + (a*28) + " bags"); },
    sendFeedback: function() { const m = prompt("Message to Admin:"); if(m) { const i = JSON.parse(localStorage.getItem('agri_inbox') || "[]"); i.push({user: "Farmer", msg: m}); localStorage.setItem('agri_inbox', JSON.stringify(i)); alert("Sent!"); } },
    postBroadcast: function() { const m = prompt("Broadcast:"); if(m) { localStorage.setItem('agri_broadcast', m); this.sync(); } }
};
agriEngine.init();
