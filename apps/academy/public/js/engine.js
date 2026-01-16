const agriEngine = {
    lessons: [
        { title: "Soil pH", content: "Maize thrives in pH 5.8 to 7.0. Acidic soil locks nutrients." },
        { title: "Nitrogen (N)", content: "Nitrogen drives leaf growth. Apply top-dressing at knee-high stage." },
        { title: "Phosphorus (P)", content: "Critical during planting for strong root establishment." }
    ],
    quiz: {
        question: "What is the ideal pH range for Maize production?",
        options: ["4.0 - 5.0", "5.8 - 7.0", "8.0 - 9.0"],
        correct: 1
    },
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const student = JSON.parse(localStorage.getItem('agri_student'));
        const market = JSON.parse(localStorage.getItem('agri_market')) || [];
        this.renderAll(view, student, market);
    },
    renderAll: function(view, student, market) {
        let ui = '';
        // --- 1. STUDENT PORTAL (Top Section) ---
        if(!student) {
            ui += '<div class="card"><h3>🎓 Student Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#111; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enroll & Begin Month 1</button></div>';
        } else if (student.passedQuiz) {
            ui += '<div class="card" style="border:2px solid #ffcc00; background:rgba(255, 204, 0, 0.1); text-align:center;">' +
                  '<h3>🏆 Month 1 Certified</h3>' +
                  '<p>Congratulations ' + student.name + '! You have mastered Soil Chemistry.</p>' +
                  '<button class="btn" onclick="agriEngine.generateCert()">Download Certificate</button></div>';
        } else if (student.currentLesson >= this.lessons.length) {
            ui += '<div class="card"><h3>📝 Month 1 Final Quiz</h3>' +
                  '<p>' + this.quiz.question + '</p>';
            this.quiz.options.forEach((opt, idx) => {
                ui += '<button class="btn" style="background:#1a1a1a; margin:5px 0; width:100%; text-align:left;" onclick="agriEngine.checkQuiz(' + idx + ')">' + (idx+1) + '. ' + opt + '</button>';
            });
            ui += '</div>';
        } else {
            const prog = (student.currentLesson / this.lessons.length) * 100;
            ui += '<div class="card"><h3>🎓 Lesson ' + (student.currentLesson + 1) + '</h3>' +
                  '<div style="width:100%; background:#333; height:8px; border-radius:4px;"><div style="width:' + prog + '%; background:#ffcc00; height:100%; transition: 0.5s;"></div></div>' +
                  '<h4>' + this.lessons[student.currentLesson].title + '</h4>' +
                  '<p>' + this.lessons[student.currentLesson].content + '</p>' +
                  '<button class="btn" style="width:100%;" onclick="agriEngine.next()">Mark as Complete</button></div>';
        }
        // --- 2. MARKET MANAGER (Middle Section) ---
        ui += '<div class="card"><h3>📦 Market Logistics</h3>' +
              '<div style="display:flex; gap:5px;">' +
              '<input type="text" id="mItem" placeholder="Crop" style="flex:2; padding:8px; background:#000; color:#fff; border:1px solid #333;">' +
              '<input type="number" id="mPrice" placeholder="Price" style="flex:1; padding:8px; background:#000; color:#fff; border:1px solid #333;">' +
              '</div>' +
              '<button class="btn" style="margin-top:10px; width:100%;" onclick="agriEngine.updateMarket()">Post Price Update</button>';
        market.slice(-2).forEach(m => {
            ui += '<div class="result-card" style="font-size:0.85em;">' + m.name + ': <span style="color:#ffcc00;">KES ' + m.price + '</span></div>';
        });
        ui += '</div>';
        // --- 3. ADMIN DASHBOARD (Bottom Section) ---
        ui += '<div class="card" style="background:rgba(0,0,0,0.6); border:1px dashed #444;">' +
              '<h3>🛡️ Admin Control</h3>' +
              '<div style="display:flex; justify-content:space-around; text-align:center; margin-bottom:10px;">' +
              '<div><small>STUDENT</small><br><strong>' + (student ? student.name : 'None') + '</strong></div>' +
              '<div><small>STATUS</small><br><strong>' + (student?.passedQuiz ? 'CERTIFIED' : 'ACTIVE') + '</strong></div>' +
              '</div>' +
              '<button class="btn" style="background:none; border:1px solid red; color:red; font-size:10px; width:100%;" onclick="agriEngine.reset()">System Hard Reset</button>' +
              '</div>';
        view.innerHTML = ui;
    },
    reg: function() {
        const n = document.getElementById('nameIn').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, currentLesson: 0, passedQuiz: false})); this.sync(); }
    },
    next: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.currentLesson++;
        localStorage.setItem('agri_student', JSON.stringify(s));
        this.sync();
    },
    checkQuiz: function(idx) {
        if(idx === this.quiz.correct) {
            let s = JSON.parse(localStorage.getItem('agri_student'));
            s.passedQuiz = true;
            localStorage.setItem('agri_student', JSON.stringify(s));
            this.sync();
        } else {
            alert("Incorrect! Reviewing Lesson 1...");
            let s = JSON.parse(localStorage.getItem('agri_student'));
            s.currentLesson = 0;
            localStorage.setItem('agri_student', JSON.stringify(s));
            this.sync();
        }
    },
    updateMarket: function() {
        const i = document.getElementById('mItem').value;
        const p = document.getElementById('mPrice').value;
        if(i && p) {
            let m = JSON.parse(localStorage.getItem('agri_market')) || [];
            m.push({name: i, price: p});
            localStorage.setItem('agri_market', JSON.stringify(m));
            this.sync();
        }
    },
    generateCert: function() {
        const s = JSON.parse(localStorage.getItem('agri_student'));
        alert("Generating Certificate for " + s.name + "... [Month 1: Soil Mastery]");
    },
    reset: function() { if(confirm("Clear all data?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
