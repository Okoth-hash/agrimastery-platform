const agriEngine = {
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
        // --- STUDENT DASHBOARD WITH PROGRESS BAR ---
        if(!student) {
            ui += '<div class="card"><h3>🎓 Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#000; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enrol Now</button></div>';
        } else {
            const prog = student.progress || 10; // Default 10% on start
            ui += '<div class="card" style="border-left:5px solid #ffcc00;">' +
                  '<h3>🎓 Student: ' + student.name + '</h3>' +
                  '<p>Course: Maize Mastery | Month 1</p>' +
                  '<div style="width:100%; background:#333; height:10px; border-radius:5px; margin:10px 0;">' +
                  '<div style="width:' + prog + '%; background:#ffcc00; height:100%; border-radius:5px; transition:0.5s;"></div>' +
                  '</div>' +
                  '<small>' + prog + '% Complete</small>' +
                  '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.updateProg()">Read Next Lesson</button></div>';
        }
        // --- MARKET & ADMIN ---
        ui += '<div class="card"><h3>📦 Market</h3>';
        market.slice(-1).forEach(m => { ui += '<p>' + m.name + ': KES ' + m.price + '</p>'; });
        ui += '</div>';
        ui += '<div class="card" style="background:rgba(0,0,0,0.5);"><h3>🛡️ Admin</h3>' +
              '<p>Student Progress: ' + (student ? (student.progress || 10) + '%' : 'N/A') + '</p>' +
              '<button class="btn" style="background:red;" onclick="agriEngine.hardReset()">Hard Reset</button></div>';
        view.innerHTML = ui;
    },
    reg: function() {
        const n = document.getElementById('nameIn').value;
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n, progress: 10}));
            this.sync();
        }
    },
    updateProg: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        if(s.progress < 100) {
            s.progress += 15; // Increase by 15% per "lesson"
            localStorage.setItem('agri_student', JSON.stringify(s));
            this.sync();
        } else {
            alert("Month 1 Complete! Certification Pending...");
        }
    },
    hardReset: function() {
        localStorage.clear();
        location.reload();
    }
};
agriEngine.init();
