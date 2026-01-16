const agriEngine = {
    init: function() {
        // Kill all old background loops to stop the 'backtracking'
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
        // STUDENT DASHBOARD (L7 UI)
        if(!student) {
            ui += '<div class="card"><h3>🎓 Student Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Enter Full Name" style="width:90%; padding:10px; margin-bottom:10px; background:#000; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enroll Now</button></div>';
        } else {
            ui += '<div class="card" style="border-left:5px solid #ffcc00;"><h3>🎓 Student: ' + student.name + '</h3>' +
                  '<p>Progress: Month 1 - Soil Prep</p></div>';
        }
        // MARKET DASHBOARD (L6 Data)
        ui += '<div class="card"><h3>📦 Market Manager</h3>' +
              '<input type="text" id="itemIn" placeholder="Crop" style="width:45%;"> ' +
              '<input type="number" id="priceIn" placeholder="Price" style="width:45%;">' +
              '<button class="btn" style="margin-top:10px;" onclick="agriEngine.addM()">Update Market</button>';
        market.forEach(m => {
            ui += '<div class="result-card">' + m.name + ' - KES ' + m.price + '</div>';
        });
        ui += '</div>';
        // ADMIN DASHBOARD (L5 Session Oversight)
        ui += '<div class="card" style="background:#111; opacity:0.9;"><h3>🛡️ Admin Dashboard</h3>' +
              '<p>Active Students: ' + (student ? '1' : '0') + '</p>' +
              '<p>Market Items: ' + market.length + '</p></div>';
        view.innerHTML = ui;
    },
    reg: function() {
        const n = document.getElementById('nameIn').value;
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n}));
            this.sync();
        }
    },
    addM: function() {
        const i = document.getElementById('itemIn').value;
        const p = document.getElementById('priceIn').value;
        if(i && p) {
            let m = JSON.parse(localStorage.getItem('agri_market')) || [];
            m.push({name: i, price: p});
            localStorage.setItem('agri_market', JSON.stringify(m));
            this.sync();
        }
    }
};
agriEngine.init();
