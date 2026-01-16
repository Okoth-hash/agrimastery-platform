const agriEngine = {
    author: {
        name: "Omondi Robin Okoth",
        phone: "254742178833",
        email: "okothrobin323@gmail.com"
    },
    // Agronomy Data for Weather Card
    weather: {
        temp: "24°C",
        condition: "Partly Cloudy",
        forecast: "Rain expected in 48hrs",
        advice: "Good timing for Top-dressing (CAN)."
    },
    lessons: [
        { title: "Soil pH & Testing", content: "Measure pH before planting. Target 5.8-7.0 for maximum yield." },
        { title: "Fertilizer Timing", content: "Apply DAP at planting and CAN/Urea 3-4 weeks after germination." },
        { title: "Pest Management", content: "Scout for Fall Armyworm early morning or late evening." }
    ],
    quiz: { q: "Which fertilizer is best for top-dressing maize?", options: ["DAP", "CAN/Urea", "NPK"], correct: 1 },
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
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
        // --- 1. WEATHER & PLANTING FORECAST (New Utility) ---
        html += '<div class="card" style="border-left:5px solid #00b4d8; background:rgba(0, 180, 216, 0.05);">' +
                '<h3 style="color:#00b4d8;">☁️ Weather Forecast</h3>' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                '<div><h2 style="margin:0;">' + this.weather.temp + '</h2><small>' + this.weather.condition + '</small></div>' +
                '<div style="text-align:right;"><small style="color:#aaa;">Advice:</small><br><strong>' + this.weather.advice + '</strong></div>' +
                '</div></div>';
        // --- 2. STUDENT ACADEMY ---
        if(!student) {
            html += '<div class="card"><h3>🎓 Student Academy</h3>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; margin-bottom:10px; background:#111; color:white; border:1px solid #2d6a4f;">' +
                    '<button class="btn" onclick="agriEngine.enroll()">Begin Mastery</button></div>';
        } else if(student.passed) {
            html += '<div class="card" style="border:2px solid #ffcc00;"><h3>🏆 Certified Producer</h3>' +
                    '<p>Student: ' + student.name + '</p></div>';
        } else if(student.step >= this.lessons.length) {
            html += '<div class="card"><h3>📝 Certification Quiz</h3><p>' + this.quiz.q + '</p>';
            this.quiz.options.forEach((o, i) => {
                html += '<button class="btn" style="width:100%; margin:4px 0; background:#222;" onclick="agriEngine.solve(' + i + ')">' + o + '</button>';
            });
            html += '</div>';
        } else {
            html += '<div class="card"><h3>📖 ' + this.lessons[student.step].title + '</h3>' +
                    '<p>' + this.lessons[student.step].content + '</p>' +
                    '<button class="btn" onclick="agriEngine.nextStep()">Complete Lesson</button></div>';
        }
        // --- 3. MARKET MANAGER ---
        html += '<div class="card"><h3>📦 Market Manager</h3>' +
                '<div style="display:flex; gap:5px;">' +
                '<input type="text" id="mItem" placeholder="Crop" style="flex:2; padding:8px; background:#000; color:white; border:1px solid #333;">' +
                '<input type="number" id="mPrice" placeholder="Price" style="flex:1; padding:8px; background:#000; color:white; border:1px solid #333;">' +
                '</div>' +
                '<button class="btn" style="width:100%; margin-top:8px;" onclick="agriEngine.postMarket()">Post Update</button></div>';
        // --- 4. ADMIN & AUTHOR CREDITS ---
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<h3>🛡️ Admin Dashboard</h3>' +
                '<p style="font-size:0.8em;">Author: ' + this.author.name + '</p>' +
                '<a href="https://wa.me/' + this.author.phone + '" class="btn" style="background:#25d366; color:white; display:block; text-align:center; text-decoration:none; margin:10px 0;">WhatsApp Author</a>' +
                '<button class="btn" style="background:none; border:1px solid red; color:red; width:100%; font-size:10px;" onclick="agriEngine.reset()">System Reset</button>' +
                '</div>';
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
        if(i === this.quiz.correct) { s.passed = true; } else { s.step = 0; alert("Wrong! Restarting lessons."); }
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
    reset: function() { if(confirm("Clear System?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
