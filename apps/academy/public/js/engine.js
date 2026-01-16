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
        this.renderAll(view, student);
    },
    renderAll: function(view, student) {
        let ui = '';
        if(!student) {
            ui += '<div class="card"><h3>🎓 Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#000; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enrol Now</button></div>';
        } else if (student.passedQuiz) {
            ui += '<div class="card" style="border:2px solid #ffcc00; text-align:center;">' +
                  '<h3>🏆 Month 1 Certified</h3>' +
                  '<p>Congratulations ' + student.name + '! You have unlocked Month 2.</p>' +
                  '<button class="btn" style="background:#ffcc00; color:#000;">Enter Month 2 Modules</button></div>';
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
                  '<div style="width:100%; background:#333; height:8px; border-radius:4px;"><div style="width:' + prog + '%; background:#ffcc00; height:100%;"></div></div>' +
                  '<h4>' + this.lessons[student.currentLesson].title + '</h4>' +
                  '<p>' + this.lessons[student.currentLesson].content + '</p>' +
                  '<button class="btn" style="width:100%;" onclick="agriEngine.next()">Next Lesson</button></div>';
        }
        // --- ADMIN VIEW ---
        ui += '<div class="card" style="background:rgba(0,0,0,0.5); font-size:0.8em;">' +
              '<h3>🛡️ Admin Monitor</h3>' +
              '<p>Student: ' + (student ? student.name : 'None') + '</p>' +
              '<p>Status: ' + (student?.passedQuiz ? '✅ CERTIFIED' : '📖 LEARNING') + '</p></div>';
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
            alert("Incorrect. Review your lessons and try again!");
            let s = JSON.parse(localStorage.getItem('agri_student'));
            s.currentLesson = 0; // Reset to start for review
            localStorage.setItem('agri_student', JSON.stringify(s));
            this.sync();
        }
    }
};
agriEngine.init();
