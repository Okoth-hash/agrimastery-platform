const agriEngine = {
    author: { 
        name: "Omondi Robin Okoth", 
        phone: "254742178833", 
        email: "okothrobin323@gmail.com" 
    },
    lessons: [
        { title: "Soil pH & Testing", content: "Target 5.8-7.0 pH.", advice: "Low wind: Good for sampling." },
        { title: "Seed Variety", content: "High altitude? Use H6213.", advice: "Sunny: Check soil moisture." },
        { title: "Planting Logic", content: "75cm x 25cm spacing.", advice: "Rain in 48h: Prepare to plant." }
    ],
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | SYSTEM ONLINE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const student = JSON.parse(localStorage.getItem('agri_student'));
        const market = JSON.parse(localStorage.getItem('agri_market')) || [];
        this.render(view, student, market);
    },
    render: function(view, student, market) {
        let html = '';
        // 1. ACTION PANEL
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Farmer Tools</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.getAdvice()">💡 Expert Tip</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 WhatsApp</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. ACADEMY
        if(!student) {
            html += '<div class="card"><h3>🎓 Enrollment</h3>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; background:#111; color:white; border:1px solid #333;">' +
                    '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.enroll()">Register</button></div>';
        } else {
            const step = student.step || 0;
            if(step >= this.lessons.length) {
                html += '<div class="card" style="border:2px solid gold; text-align:center;"><h3>🏆 Mastery Certified</h3></div>';
            } else {
                html += '<div class="card"><h3>📖 ' + this.lessons[step].title + '</h3>' +
                        '<p>' + this.lessons[step].content + '</p>' +
                        '<button class="btn" style="width:100%;" onclick="agriEngine.next()">Mark Complete</button></div>';
            }
        }
        // 3. MARKET MANAGER
        html += '<div class="card"><h3>📦 Market</h3>' +
                '<input type="text" id="mI" placeholder="Crop" style="width:45%; background:#000; color:white; border:1px solid #333; padding:5px;"> ' +
                '<input type="number" id="mP" placeholder="Price" style="width:45%; background:#000; color:white; border:1px solid #333; padding:5px;">' +
                '<button class="btn" style="width:100%; margin-top:8px;" onclick="agriEngine.post()">Post Price</button></div>';
        // 4. ADMIN
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    enroll: function() {
        const n = document.getElementById('sName').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, step: 0})); this.sync(); }
    },
    next: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.step++; localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    calcYield: function() {
        const acres = prompt("Enter acreage (e.g., 2):");
        if(acres) alert("Projected Yield: " + (acres * 28) + " bags (90kg each).");
    },
    getAdvice: function() {
        alert("Tip: North-South row orientation maximizes photosynthesis!");
    },
    contactDev: function() {
        window.location.href = "https://wa.me/" + this.author.phone;
    },
    post: function() {
        const i = document.getElementById('mI').value, p = document.getElementById('mP').value;
        if(i && p) alert("Market Updated: " + i + " at KES " + p);
    },
    reset: function() { if(confirm("Clear system?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
