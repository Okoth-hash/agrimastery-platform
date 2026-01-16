const agriEngine = {
    init: function() {
        // Stop any old loops from the 'Syncing' error
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        console.log('AgriMastery: Integrated System Live');
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        // Shared Data Layer (L6)
        const student = JSON.parse(localStorage.getItem('agri_student'));
        const market = JSON.parse(localStorage.getItem('agri_market')) || [];
        this.renderAll(view, student, market);
    },
    renderAll: function(view, student, market) {
        let ui = '';
        // --- STUDENT DASHBOARD ---
        if(!student) {
            ui += '<div class="card"><h3>🎓 Enrollment</h3>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:5px 0; background:#000; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enrol Now</button></div>';
        } else {
            ui += '<div class="card" style="border-left:5px solid #ffcc00;">' +
                  '<h3>🎓 Student: ' + student.name + '</h3>' +
                  '<p>Status: Active | Month 1</p></div>';
        }
        // --- MARKET MANAGER ---
        ui += '<div class="card"><h3>📦 Market</h3>' +
              '<input type="text" id="itemIn" placeholder="Crop" style="width:45%;"> ' +
              '<input type="number" id="priceIn" placeholder="Price" style="width:45%;">' +
              '<button class="btn" style="margin-top:10px; width:100%;" onclick="agriEngine.addM()">Update Market</button>';
        market.slice(-2).forEach(m => {
            ui += '<div class="result-card">' + m.name + ' - KES ' + m.price + '</div>';
        });
        ui += '</div>';
        // --- ADMIN DASHBOARD (COMMUNICATING SECTION) ---
        ui += '<div class="card" style="background:rgba(0,0,0,0.5); border:1px dashed #444;">' +
              '<h3>🛡️ Admin Dashboard</h3>' +
              '<p>Active Students: ' + (student ? '1' : '0') + '</p>' +
              '<p>Market Items: ' + market.length + '</p>' +
              '<button class="btn" style="background:#800; color:white; width:100%; margin-top:10px;" onclick="agriEngine.hardReset()">⚠️ HARD RESET SYSTEM</button>' +
              '</div>';
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
    },
    hardReset: function() {
        if(confirm("This will delete ALL students and market data. Continue?")) {
            localStorage.clear();
            location.reload();
        }
    }
};
agriEngine.init();
