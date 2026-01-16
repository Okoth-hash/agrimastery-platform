const agriEngine = {
    author: {
        name: "Omondi Robin Okoth",
        phone: "254742178833",
        email: "okothrobin323@gmail.com"
    },
    weather: { temp: "24°C", condition: "Partly Cloudy" },
    lessons: [
        { 
            title: "Soil pH & Testing", 
            content: "Measure pH before planting. Target 5.8-7.0 for maximum yield.",
            weatherAdvice: "Low wind today. Perfect for taking soil samples."
        },
        { 
            title: "Fertilizer Timing", 
            content: "Apply DAP at planting and CAN/Urea 3-4 weeks after germination.",
            weatherAdvice: "Rain expected in 48hrs. Ideal time for Top-dressing!"
        },
        { 
            title: "Pest Management", 
            content: "Scout for Fall Armyworm early morning or late evening.",
            weatherAdvice: "High humidity tonight. Watch for fungal activity."
        }
    ],
    quiz: { q: "Which fertilizer is best for top-dressing maize?", options: ["DAP", "CAN/Urea", "NPK"], correct: 1 },
    init: function() {
        // Kill old processes
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        // Start System Heartbeat (Clock)
        setInterval(() => this.updateClock(), 1000);
        this.sync();
    },
    updateClock: function() {
        const clockEl = document.getElementById('sys-clock');
        if(clockEl) {
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString() + " | System Active";
        }
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
        let currentAdvice = student ? (student.passed ? "Mastery Achieved." : this.lessons[student.step].weatherAdvice) : "Register to see advice.";
        // 1. SMART WEATHER
        html += '<div class="card" style="border-left:5px solid #00b4d8;">' +
                '<h3 style="color:#00b4d8;">☁️ Smart Forecast</h3>' +
                '<div style="display:flex; justify-content:space-between;">' +
                '<div><h2>' + this.weather.temp + '</h2><small>' + this.weather.condition + '</small></div>' +
                '<div style="text-align:right; max-width:60%;"><strong>' + currentAdvice + '</strong></div>' +
                '</div></div>';
        // 2. ACADEMY
        if(!student) {
            html += '<div class="card"><h3>🎓 Student Academy</h3>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; margin-bottom:10px; background:#111; color:white; border:1px solid #2d6a4f;">' +
                    '<button class="btn" onclick="agriEngine.enroll()">Begin Mastery</button></div>';
        } else if(student.passed) {
            html += '<div class="card" style="border:2px solid #ffcc00; text-align:center;"><h3>🏆 Certified Producer</h3>' +
                    '<p>' + student.name + '</p><button class="btn" style="background:#ffcc00; color:#000;">Download Cert</button></div>';
        } else if(student.step >= this.lessons.length) {
            html += '<div class="card"><h3>📝 Final Quiz</h3><p>' + this.quiz.q + '</p>';
            this.quiz.options.forEach((o, i) => {
                html += '<button class="btn" style="width:100%; margin:4px 0; background:#222;" onclick="agriEngine.solve(' + i + ')">' + o + '</button>';
            });
            html += '</div>';
        } else {
            html += '<div class="card"><h3>📖 ' + this.lessons[student.step].title + '</h3>' +
                    '<p>' + this.lessons[student.step].content + '</p>' +
                    '<button class="btn" onclick="agriEngine.nextStep()">Complete Lesson</button></div>';
        }
        // 3. MARKET MANAGER
        html += '<div class="card"><h3>📦 Market Logistics</h3>' +
                '<div style="display:flex; gap:5px;">' +
                '<input type="text" id="mItem" placeholder="Crop" style="flex:2; padding:8px; background:#000; color:white; border:1px solid #333;">' +
                '<input type="number" id="mPrice" placeholder="Price" style="flex:1; padding:8px; background:#000; color:white; border:1px solid #333;">' +
                '</div>' +
                '<button class="btn" style="width:100%; margin-top:8px;" onclick="agriEngine.postMarket()">Update Prices</button></div>';
        // 4. ADMIN & CLOCK
        const waMsg = encodeURIComponent("Hello Omondi, system check required.");
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="font-family:monospace; color:lime; font-size:12px; margin-bottom:10px;">Initializing...</div>' +
                '<p style="font-size:0.8em; margin:0;">Author: ' + this.author.name + '</p>' +
                '<div style="display:flex; gap:10px; margin-top:10px;">' +
                '<a href="https://wa.me/' + this.author.phone + '?text=' + waMsg + '" class="btn" style="background:#25d366; color:white; flex:1; text-align:center; text-decoration:none;">WhatsApp</a>' +
                '<button class="btn" style="background:none; border:1px solid red; color:red; flex:1; font-size:10px;" onclick="agriEngine.reset()">Reset</button>' +
                '</div></div>';
        view.innerHTML = html;
    },
    enroll: function() {
        const n = document.getElementById('sName').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, step: 0, passed: false})); this.sync(); }
    },
    nextStep: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.step++; localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    solve: function(i) {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        if(i === this.quiz.correct) { s.passed = true; } else { s.step = 0; alert("Wrong! Reviewing Soil Basics."); }
        localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    postMarket: function() {
        const i = document.getElementById('mItem').value, p = document.getElementById('mPrice').value;
        if(i && p) {
            let m = JSON.parse(localStorage.getItem('agri_market')) || [];
            m.push({name: i, price: p});
            localStorage.setItem('agri_market', JSON.stringify(m)); this.sync();
        }
    },
    reset: function() { if(confirm("Hard Reset System?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
