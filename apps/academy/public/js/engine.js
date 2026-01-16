const agriEngine = {
    lessons: [
        { title: "Introduction to Soil pH", content: "Maize thrives in pH 5.8 to 7.0. Acidic soil locks nutrients." },
        { title: "Nitrogen (N) Essentials", content: "Nitrogen drives leaf growth. Apply top-dressing at knee-high stage." },
        { title: "Phosphorus (P) for Roots", content: "P is critical during planting for strong root establishment." },
        { title: "Potassium (K) & Strength", content: "K helps the stalk stay strong against wind and pests." }
    ],
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
        // --- STUDENT DASHBOARD WITH LESSON AREA ---
        if(!student) {
            ui += '<div class="card"><h3>🎓 Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#000; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enrol Now</button></div>';
        } else {
            const progIndex = student.currentLesson || 0;
            const progPercent = (progIndex / this.lessons.length) * 100;
            ui += '<div class="card" style="border-left:5px solid #ffcc00;">' +
                  '<h3>🎓 Student: ' + student.name + '</h3>' +
                  '<div style="width:100%; background:#333; height:10px; border-radius:5px; margin:10px 0;">' +
                  '<div style="width:' + progPercent + '%; background:#ffcc00; height:100%; border-radius:5px; transition:0.5s;"></div>' +
                  '</div>' +
                  '<div class="result-card" style="background:#1a1a1a; margin-top:15px;">' +
                  '<h4>📖 ' + this.lessons[progIndex].title + '</h4>' +
                  '<p style="font-size:0.9em; color:#ddd;">' + this.lessons[progIndex].content + '</p>' +
                  '</div>' +
                  '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.nextLesson()">Complete & Next Lesson</button></div>';
        }
        // --- ADMIN DASHBOARD ---
        ui += '<div class="card" style="background:rgba(0,0,0,0.5);"><h3>🛡️ Admin Oversight</h3>' +
              '<p>Student Name: ' + (student ? student.name : 'None') + '</p>' +
              '<p>Lessons Finished: ' + (student ? student.currentLesson : 0) + '</p>' +
              '<button class="btn" style="background:#500; border:none; font-size:10px;" onclick="agriEngine.reset()">System Reset</button></div>';
        view.innerHTML = ui;
    },
    reg: function() {
        const n = document.getElementById('nameIn').value;
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n, currentLesson: 0}));
            this.sync();
        }
    },
    nextLesson: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        if(s.currentLesson < this.lessons.length - 1) {
            s.currentLesson += 1;
            localStorage.setItem('agri_student', JSON.stringify(s));
            this.sync();
        } else {
            alert("Congratulations! You have completed the Soil Chemistry module.");
        }
    },
    reset: function() { localStorage.clear(); location.reload(); }
};
agriEngine.init();
