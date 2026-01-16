const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    weather: { temp: "26°C", condition: "Sunny", moisture: "Moderate" },
    // Month 2 Content Data
    month2: [
        { title: "Variety Selection", content: "Choose H6213 for high altitude or PH4 for dry areas. Check the 'Sell By' date." },
        { title: "Planting Depth", content: "Plant at 5cm depth. If soil is very dry, go slightly deeper to reach moisture." },
        { title: "Spacing Logic", content: "75cm between rows and 25cm between plants for optimal sunlight." }
    ],
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | ALL MODULES ACTIVE";
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
        // 1. SMART WEATHER (Month 2 Aware)
        let advice = "Waiting for enrollment...";
        if(student) advice = student.passed ? "Good moisture for planting today." : "Complete Month 1 to unlock planting weather.";
        html += '<div class="card" style="border-left:5px solid #00b4d8; background:rgba(0,180,216,0.05);">' +
                '<h3 style="color:#00b4d8;">☁️ Smart Forecast</h3>' +
                '<p><strong>' + this.weather.temp + ' - ' + this.weather.condition + '</strong></p>' +
                '<small>' + advice + '</small></div>';
        // 2. INTEGRATED ACADEMY (Month 1 + Month 2)
        if(!student) {
            html += '<div class="card"><h3>🎓 Enrollment</h3>' +
                    '<input type="text" id="sName" placeholder="Name" style="width:90%; padding:10px; background:#111; color:white; border:1px solid #2d6a4f;">' +
                    '<button class="btn" onclick="agriEngine.enroll()">Start Phase 1</button></div>';
        } else if (student.passed) {
            // MONTH 2 UI
            const m2Step = student.m2Step || 0;
            if(m2Step >= this.month2.length) {
                html += '<div class="card" style="border:2px solid gold;"><h3>🏅 Professional Maize Farmer</h3><p>You have mastered Soil & Planting.</p></div>';
            } else {
                html += '<div class="card" style="border-left:5px solid #ffcc00;"><h3>🌱 Month 2: Planting</h3>' +
                        '<h4>' + this.month2[m2Step].title + '</h4>' +
                        '<p>' + this.month2[m2Step].content + '</p>' +
                        '<button class="btn" style="background:#ffcc00; color:#000;" onclick="agriEngine.nextM2()">Next Lesson</button></div>';
            }
        } else {
            // MONTH 1 UI (Simplified for flow)
            html += '<div class="card"><h3>📖 Month 1 In Progress</h3><p>Complete your Soil Chemistry quiz to unlock Month 2.</p>' +
                    '<button class="btn" onclick="agriEngine.passM1()">Fast-Track to Month 2 (Admin)</button></div>';
        }
        // 3. MARKET MANAGER
        html += '<div class="card"><h3>📦 Market</h3><div style="display:flex; gap:5px;">' +
                '<input type="text" id="mI" placeholder="Crop" style="flex:2; background:#000; color:white; border:1px solid #333; padding:5px;">' +
                '<input type="number" id="mP" placeholder="Price" style="flex:1; background:#000; color:white; border:1px solid #333; padding:5px;">' +
                '</div><button class="btn" style="width:100%; margin-top:5px;" onclick="agriEngine.post()">Update</button></div>';
        // 4. ADMIN & AUTHOR
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:11px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '<div style="display:flex; gap:5px;">' +
                '<a href="https://wa.me/' + this.author.phone + '" class="btn" style="background:#25d366; color:white; flex:1; text-align:center; text-decoration:none;">WhatsApp</a>' +
                '<button class="btn" style="background:none; border:1px solid red; color:red; flex:1;" onclick="agriEngine.reset()">Reset</button>' +
                '</div></div>';
        view.innerHTML = html;
    },
    enroll: function() {
        const n = document.getElementById('sName').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, passed: false, m2Step: 0})); this.sync(); }
    },
    passM1: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.passed = true; localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    nextM2: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.m2Step++; localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    post: function() {
        const i = document.getElementById('mI').value, p = document.getElementById('mP').value;
        if(i && p) {
            let m = JSON.parse(localStorage.getItem('agri_market')) || [];
            m.push({name: i, price: p});
            localStorage.setItem('agri_market', JSON.stringify(m)); this.sync();
        }
    },
    reset: function() { localStorage.clear(); location.reload(); }
};
agriEngine.init();
