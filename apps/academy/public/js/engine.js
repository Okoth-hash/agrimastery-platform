const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    // Month 4: Post-Harvest Content
    month4: [
        { title: "Drying Standards", content: "Dry maize on tarpaulins, never on bare ground. Aim for 13% moisture content." },
        { title: "Shelling Safety", content: "Wait until the cob is completely dry. Avoid breaking the grains to prevent pest entry." },
        { title: "Hermetic Storage", content: "Use PICS bags or metal silos to suffocate weevils without using chemicals." }
    ],
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | POST-HARVEST ACTIVE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const student = JSON.parse(localStorage.getItem('agri_student'));
        this.render(view, student);
    },
    render: function(view, student) {
        let html = '';
        // 1. UPDATED ACTION PANEL
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Farmer Tools</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.checkMoisture()" style="background:#0096c7;">💧 Moisture Test</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. POST-HARVEST ACADEMY
        if(!student) {
            html += '<div class="card"><h3>🎓 Enrollment</h3>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; background:#111; color:white; border:1px solid #333;">' +
                    '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.enroll()">Register</button></div>';
        } else {
            const m4Step = student.m4Step || 0;
            if(m4Step >= this.month4.length) {
                html += '<div class="card" style="border:2px solid #2d6a4f; text-align:center; background:rgba(45,106,79,0.1);">' +
                        '<h3>✅ Professional Farmer</h3><p>You have mastered the full Maize Cycle.</p></div>';
            } else {
                html += '<div class="card" style="border-left: 5px solid #2d6a4f;">' +
                        '<h3>🌾 Month 4: Post-Harvest</h3>' +
                        '<h4>' + this.month4[m4Step].title + '</h4>' +
                        '<p>' + this.month4[m4Step].content + '</p>' +
                        '<button class="btn" style="width:100%; background:#2d6a4f;" onclick="agriEngine.nextM4()">Complete Step</button></div>';
            }
        }
        // 3. ADMIN & BRANDING
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    checkMoisture: function() {
        alert("The Salt Test: Place dry maize and salt in a dry jar. Shake for 1 minute. If salt sticks to the glass, moisture is above 13.5% and not safe for storage.");
    },
    enroll: function() {
        const n = document.getElementById('sName').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, m4Step: 0})); this.sync(); }
    },
    nextM4: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.m4Step = (s.m4Step || 0) + 1;
        localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    calcYield: function() {
        const acres = prompt("Enter acreage:");
        if(acres) alert("Potential: " + (acres * 28) + " bags.");
    },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Clear system?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
