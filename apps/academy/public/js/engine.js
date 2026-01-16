const agriEngine = {
    author: {
        name: "Omondi Robin Okoth",
        phone: "254742178833", // Format for WhatsApp (no +)
        displayPhone: "0742178833",
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
        // --- STUDENT PORTAL ---
        if(!student) {
            ui += '<div class="card"><h3>🎓 Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#111; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enroll Now</button></div>';
        } else if (student.passedQuiz) {
            ui += '<div class="card" style="border:2px solid #ffcc00; text-align:center;">' +
                  '<h3>🏆 Certified</h3><p>Well done, ' + student.name + '!</p></div>';
        } else if (student.currentLesson >= this.lessons.length) {
            ui += '<div class="card"><h3>📝 Final Quiz</h3><p>' + this.quiz.question + '</p>';
            this.quiz.options.forEach((opt, idx) => {
                ui += '<button class="btn" style="background:#1a1a1a; margin:5px 0; width:100%; text-align:left;" onclick="agriEngine.checkQuiz(' + idx + ')">' + (idx+1) + '. ' + opt + '</button>';
            });
            ui += '</div>';
        } else {
            ui += '<div class="card"><h3>🎓 Lesson ' + (student.currentLesson + 1) + '</h3><h4>' + this.lessons[student.currentLesson].title + '</h4><p>' + this.lessons[student.currentLesson].content + '</p>' +
                  '<button class="btn" style="width:100%;" onclick="agriEngine.next()">Next</button></div>';
        }
        // --- MARKET MANAGER ---
        ui += '<div class="card"><h3>📦 Market Updates</h3>' +
              '<input type="text" id="mItem" placeholder="Crop" style="width:45%;"> <input type="number" id="mPrice" placeholder="Price" style="width:45%;">' +
              '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.updateMarket()">Update</button></div>';
        // --- ADMIN & WHATSAPP AUTHOR ACKNOWLEDGMENT ---
        const waMsg = encodeURIComponent("Hello Omondi, I am a student on the AgriMastery Platform. I need some assistance.");
        ui += '<div class="card" style="background:rgba(0,0,0,0.85); border:1px solid #444; font-size:0.85em;">' +
              '<h3 style="color:#ffcc00; margin-bottom:5px;">🛡️ System Control</h3>' +
              '<p><strong>Author:</strong> ' + this.author.name + '</p>' +
              '<div style="margin-top:10px;">' +
              '<a href="https://wa.me/' + this.author.phone + '?text=' + waMsg + '" style="display:inline-block; background:#25d366; color:white; padding:8px 15px; text-decoration:none; border-radius:5px; font-weight:bold; margin-right:5px;">💬 WhatsApp</a>' +
              '<a href="tel:' + this.author.displayPhone + '" style="display:inline-block; background:#444; color:white; padding:8px 15px; text-decoration:none; border-radius:5px;">📞 Call</a>' +
              '</div>' +
              '<p style="margin-top:10px;"><strong>Email:</strong> <a href="mailto:' + this.author.email + '" style="color:cyan; text-decoration:none;">' + this.author.email + '</a></p>' +
              '<button class="btn" style="background:none; border:1px solid red; color:red; font-size:9px; width:100%; margin-top:15px;" onclick="agriEngine.reset()">Hard Reset System</button>' +
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
            alert("Incorrect! Reviewing lessons...");
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
    reset: function() { if(confirm("Clear all data?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
