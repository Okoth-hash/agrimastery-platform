const agriEngine = {
    author: {
        name: "Omondi Robin Okoth",
        phone: "0742178833",
        email: "okothrobin323@gmail.com"
    },
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
        // --- 1. STUDENT PORTAL ---
        if(!student) {
            ui += '<div class="card"><h3>🎓 Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#111; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enroll Now</button></div>';
        } else if (student.passedQuiz) {
            ui += '<div class="card" style="border:2px solid #ffcc00; text-align:center;">' +
                  '<h3>🏆 Certified</h3><p>Well done, ' + student.name + '!</p></div>';
        } else if (student.currentLesson >= this.lessons.length) {
            ui += '<div class="card"><h3>📝 Final Quiz</h3>' +
                  '<p>' + this.quiz.question + '</p>';
            this.quiz.options.forEach((opt, idx) => {
                ui += '<button class="btn" style="background:#1a1a1a; margin:5px 0; width:100%; text-align:left;" onclick="agriEngine.checkQuiz(' + idx + ')">' + (idx+1) + '. ' + opt + '</button>';
            });
            ui += '</div>';
        } else {
            ui += '<div class="card"><h3>🎓 Lesson ' + (student.currentLesson + 1) + '</h3>' +
                  '<h4>' + this.lessons[student.currentLesson].title + '</h4>' +
                  '<p>' + this.lessons[student.currentLesson].content + '</p>' +
                  '<button class="btn" style="width:100%;" onclick="agriEngine.next()">Next</button></div>';
        }
        // --- 2. MARKET MANAGER ---
        ui += '<div class="card"><h3>📦 Market Updates</h3>' +
              '<input type="text" id="mItem" placeholder="Crop" style="width:45%;"> <input type="number" id="mPrice" placeholder="Price" style="width:45%;">' +
              '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.updateMarket()">Update</button></div>';
        // --- 3. ADMIN & AUTHOR ACKNOWLEDGMENT ---
        ui += '<div class="card" style="background:rgba(0,0,0,0.7); border:1px solid #444; color:#888; font-size:0.85em;">' +
              '<h3 style="color:#ffcc00; margin-bottom:5px;">🛡️ System Control</h3>' +
              '<p>Student Status: <strong>' + (student?.passedQuiz ? 'CERTIFIED' : 'ACTIVE') + '</strong></p>' +
              '<hr style="border:0; border-top:1px solid #333; margin:10px 0;">' +
              '<p><strong>Author:</strong> ' + this.author.name + '</p>' +
              '<p><strong>Contact:</strong> ' + this.author.phone + '</p>' +
              '<p><strong>Email:</strong> ' + this.author.email + '</p>' +
              '<button class="btn" style="background:none; border:1px solid red; color:red; font-size:9px; width:100%; margin-top:10px;" onclick="agriEngine.reset()">Hard Reset System</button>' +
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
            alert("Incorrect!");
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
    reset: function() { localStorage.clear(); location.reload(); }
};
agriEngine.init();
