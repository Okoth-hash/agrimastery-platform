const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    // Month 3 Content: Pests & Diseases
    month3: [
        { title: "Fall Armyworm", content: "Look for 'window pane' holes in leaves. Apply pesticides late evening when they are active." },
        { title: "Maize Lethal Necrosis", content: "Yellowing leaves and stunted growth. Uproot and burn infected plants immediately." },
        { title: "Weed Competition", content: "The first 4 weeks are critical. Ensure the field is 100% weed-free during early growth." }
    ],
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | PHASE 3 ACTIVE";
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
        // 1. FARMER TOOLS
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Farmer Tools</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.getAdvice()">💡 Pest Tip</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. ACADEMY (Month 3 Aware)
        if(!student) {
            html += '<div class="card"><h3>🎓 Enrollment</h3>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; background:#111; color:white; border:1px solid #333;">' +
                    '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.enroll()">Register</button></div>';
        } else {
            const m3Step = student.m3Step || 0;
            if(m3Step >= this.month3.length) {
                html += '<div class="card" style="border:2px solid gold; text-align:center;">' +
                        '<h3>🏆 Master Farmer Status</h3>' +
                        '<p>You have completed Soil, Planting, and Pest Management.</p></div>';
            } else {
                html += '<div class="card" style="border-left: 5px solid #e63946;">' +
                        '<h3>🐛 Month 3: Protection</h3>' +
                        '<h4>' + this.month3[m3Step].title + '</h4>' +
                        '<p>' + this.month3[m3Step].content + '</p>' +
                        '<button class="btn" style="width:100%; background:#e63946;" onclick="agriEngine.nextM3()">Mark Guarded</button></div>';
            }
        }
        // 3. ADMIN & BRANDING
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    enroll: function() {
        const n = document.getElementById('sName').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, m3Step: 0})); this.sync(); }
    },
    nextM3: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.m3Step++; localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    calcYield: function() {
        const acres = prompt("Enter acreage:");
        if(acres) alert("Potential: " + (acres * 28) + " bags. Protect against pests to reach this target!");
    },
    getAdvice: function() {
        alert("Pest Alert: Check the 'funnel' (center) of the maize plant for small green droppings - this is a sign of Armyworm.");
    },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Clear system?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
