const agriEngine = {
    init: function() {
        console.log('AgriMastery Integrated System: Online');
        this.syncDashboards();
    },
    // Communication Layer: Syncs data across all modules
    syncDashboards: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        // Load Global State
        const user = JSON.parse(localStorage.getItem('agri_student')) || null;
        const market = JSON.parse(localStorage.getItem('agri_market')) || [];
        this.renderUnifiedUI(view, user, market);
    },
    renderUnifiedUI: function(view, user, market) {
        let html = '';
        // 1. STUDENT PORTAL SECTION
        if(!user) {
            html += '<div class="card"><h3>🎓 Student Enrollment</h3>' +
                    '<input type="text" id="sName" placeholder="Name" style="width:90%; padding:10px; margin:5px 0;">' +
                    '<button class="btn" onclick="agriEngine.register()">Register Student</button></div>';
        } else {
            html += '<div class="card" style="border-left:5px solid gold;"><h3>🎓 Welcome, ' + user.name + '</h3>' +
                    '<p>Course: Maize Mastery | Month: 1</p></div>';
        }
        // 2. MARKET MANAGER SECTION (Communicating Live Inventory)
        html += '<div class="card"><h3>📦 Live Market Manager</h3>' +
                '<input type="text" id="itemName" placeholder="Crop Name" style="width:40%; padding:10px;"> ' +
                '<input type="number" id="itemPrice" placeholder="Price" style="width:40%; padding:10px;">' +
                '<button class="btn" onclick="agriEngine.addToMarket()">Update Market</button>';
        market.forEach(item => {
            html += '<div class="result-card">' + item.name + ' - KES ' + item.price + '</div>';
        });
        html += '</div>';
        // 3. ADMIN DASHBOARD (Watching Student Activity)
        if(user) {
            html += '<div class="card" style="background:#1a1a1a;"><h3>🛡️ Admin Oversight</h3>' +
                    '<p>Active Students: 1 (' + user.name + ')</p>' +
                    '<p>System Health: Optimal</p></div>';
        }
        view.innerHTML = html;
    },
    register: function() {
        const name = document.getElementById('sName').value;
        if(name) {
            localStorage.setItem('agri_student', JSON.stringify({name: name, date: new Date()}));
            this.syncDashboards();
        }
    },
    addToMarket: function() {
        const name = document.getElementById('itemName').value;
        const price = document.getElementById('itemPrice').value;
        if(name && price) {
            let market = JSON.parse(localStorage.getItem('agri_market')) || [];
            market.push({name, price});
            localStorage.setItem('agri_market', JSON.stringify(market));
            this.syncDashboards();
        }
    }
};
agriEngine.init();
