const agriEngine = {
    author: {
        name: "Omondi Robin Okoth",
        phone: "254742178833",
        displayPhone: "0742178833",
        email: "okothrobin323@gmail.com"
    },
    // Intended Purpose: Educational Content Data
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
        // --- PURPOSE: STUDENT EDUCATION ---
        if(!student) {
            html += '<div class="card"><h3>🎓 Student Academy</h3>' +
                    '<p>Enroll to access Month 1 content.</p>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; margin-bottom:10px; background:#111; color:white; border:1px solid #2d6a4f;">' +
                    '<button class="btn" onclick="agriEngine.enroll()">Begin Mastery</button></div>';
        } else if(student.passed) {
            html += '<div class="card" style="border:2px solid #ffcc00;"><h3>🏆 Certified Producer</h3>' +
                    '<p>Student: ' + student.name + '</p><p style="color:#ffcc00;">Status: Mastery Level 1 Achieved</p></div>';
        } else if(student.step >= this.lessons.length) {
            html += '<div class="card"><h3>📝 Certification Quiz</h3><p>' + this.quiz.q + '</p>';
            this.quiz.options.forEach((o, i) => {
                html += '<button class="btn" style="width:100%; margin:4px 0; background:#222;" onclick="agriEngine.solve(' + i + ')">' + o + '</button>';
            });
            html += '</div>';
        } else {
            const p = (student.step / this.lessons.length) * 100;
            html += '<div class="card"><h3>📖 ' + this.lessons[student.step].title + '</h3>' +
                    '<div style="width:100%; background:#333; height:6px; border-radius:3px; margin:10px 0;"><div style="width:' + p + '%; background:#2d6a4f; height:100%;"></div></div>' +
                    '<p>' + this.lessons[student.step].content + '</p>' +
                    '<button class="btn" onclick="agriEngine.nextStep()">Complete Lesson</button></div>';
        }
        // --- PURPOSE: MARKET LOGISTICS ---
        html += '<div class="card"><h3>📦 Market Manager</h3>' +
                '<p style="font-size:0.8em; color:#888;">Live Price Discovery (KES)</p>' +
                '<div style="display:flex; gap:5px;">' +
                '<input type="text" id="mItem" placeholder="Crop" style="flex:2; padding:8px; background:#000; color:white; border:1px solid #333;">' +
                '<input type="number" id="mPrice" placeholder="Price" style="flex:1; padding:8px; background:#000; color:white; border:1px solid #333;">' +
                '</div>' +
                '<button class="btn" style="width:100%; margin-top:8px;" onclick="agriEngine.postMarket()">Post Update</button>';
        market.slice(-2).reverse().forEach(m => {
            html += '<div class="result-card" style="display:flex; justify-content:space-between;"><span>' + m.name + '</span><strong style="color:lime;">' + m.price + '/=</strong></div>';
        });
        html += '</div>';
        // --- PURPOSE: ADMIN & AUTHORSHIP ---
        const waMsg = encodeURIComponent("Hello Omondi, I am a user on AgriMastery. Help me with my dashboard.");
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<h3>🛡️ Admin Dashboard</h3>' +
                '<div style="font-size:0.85em; color:#aaa;">' +
                '<p>System: <strong>Operational</strong></p>' +
                '<p>Student: ' + (student ? student.name : 'None') + '</p>' +
                '<hr style="border:0; border-top:1px solid #333; margin:10px 0;">' +
                '<p>Author: ' + this.author.name + '</p>' +
                '<a href="https://wa.me/' + this.author.phone + '?text=' + waMsg + '" class="btn" style="background:#25d366; color:white; display:block; text-align:center; margin:10px 0;">WhatsApp Omondi</a>' +
                '<button class="btn" style="background:none; border:1px solid red; color:red; width:100%; font-size:10px;" onclick="agriEngine.reset()">System Reset</button>' +
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
