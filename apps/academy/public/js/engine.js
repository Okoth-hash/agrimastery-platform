const agriEngine = {
    init: function() {
        // Kill all old background loops to stop 'backtracking'
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        console.log('AgriMastery: 3-Module Integration Online');
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        // Retrieve shared data from L6 (Data Layer)
        const student = JSON.parse(localStorage.getItem('agri_student'));
        const market = JSON.parse(localStorage.getItem('agri_market')) || [];
        this.renderAll(view, student, market);
    },
    renderAll: function(view, student, market) {
        let ui = '';
        // --- STUDENT PORTAL ---
        if(!student) {
            ui += '<div class="card" style="border-top: 4px solid #2d6a4f;">' +
                  '<h3>🎓 Student Enrollment</h3>' +
                  '<p style="font-size:0.8em; color:#aaa;">Join the 3-Month Mastery Track</p>' +
                  '<input type="text" id="nameIn" placeholder="Full Name" style="width:90%; padding:10px; margin:10px 0; background:#000; color:#fff; border:1px solid #2d6a4f;">' +
                  '<button class="btn" onclick="agriEngine.reg()">Enrol Now</button></div>';
        } else {
            ui += '<div class="card" style="border-left:5px solid #ffcc00;">' +
                  '<h3>🎓 Student: ' + student.name + '</h3>' +
                  '<p>Status: Active | <strong>Month 1: Soil Prep</strong></p></div>';
        }
        // --- MARKET MANAGER ---
        ui += '<div class="card" style="border-top: 4px solid #1b4332;">' +
              '<h3>📦 Market Manager</h3>' +
              '<div style="display:flex; gap:5px;">' +
              '<input type="text" id="itemIn" placeholder="Crop" style="flex:2; padding:8px; background:#000; color:#fff; border:1px solid #333;">' +
              '<input type="number" id="priceIn" placeholder="Price" style="flex:1; padding:8px; background:#000; color:#fff; border:1px solid #333;">' +
              '</div>' +
              '<button class="btn" style="margin-top:10px; width:100%;" onclick="agriEngine.addM()">Update Price List</button>';
        market.slice(-3).forEach(m => {
            ui += '<div class="result-card" style="font-size:0.9em;">' + m.name + ' <span style="color:var(--accent);">KES ' + m.price + '</span></div>';
        });
        ui += '</div>';
        // --- ADMIN DASHBOARD ---
        ui += '<div class="card" style="background:rgba(0,0,0,0.4); border:1px dashed #333;">' +
              '<h3>🛡️ Admin Dashboard</h3>' +
              '<div style="display:flex; justify-content:space-around; text-align:center;">' +
              '<div><small>STUDENTS</small><br><strong>' + (student ? '1' : '0') + '</strong></div>' +
              '<div><small>MARKET ITEMS</small><br><strong>' + market.length + '</strong></div>' +
              '<div><small>HEALTH</small><br><strong style="color:lime;">OK</strong></div>' +
              '</div>' +
              '<button class="btn" style="background:none; color:red; font-size:10px; margin-top:15px; border:1px solid #444;" onclick="localStorage.clear(); location.reload();">Hard Reset System</button>' +
              '</div>';
        view.innerHTML = ui;
    },
    reg: function() {
        const n = document.getElementById('nameIn').value;
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n, date: new Date()}));
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
