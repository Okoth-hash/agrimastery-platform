const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | HARVEST ENGINE LIVE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const student = JSON.parse(localStorage.getItem('agri_student'));
        this.render(view, student);
    },
    render: function(view, student) {
        let html = '';
        // 1. UPDATED ACTION PANEL WITH HARVEST BUTTON
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Farmer Tools</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.startCountdown()" style="background:#fb8500;">🌽 Harvest Date</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. DYNAMIC COUNTDOWN DISPLAY
        const harvestData = JSON.parse(localStorage.getItem('agri_harvest'));
        if(harvestData) {
            html += '<div class="card" style="background:#023047; border:1px solid #ffb703;">' +
                    '<h3 style="color:#ffb703;">📅 Harvest Estimate</h3>' +
                    '<p>Planting Date: <b>' + harvestData.plantDate + '</b></p>' +
                    '<p>Estimated Harvest: <b style="color:lime;">' + harvestData.harvestDate + '</b></p>' +
                    '<small style="color:#aaa;">*Based on 135-day average maturity cycle.</small>' +
                    '<button class="btn" style="width:100%; margin-top:10px; font-size:9px;" onclick="localStorage.removeItem(\'agri_harvest\'); agriEngine.sync()">Clear Date</button></div>';
        }
        // 3. ACADEMY & BRANDING
        html += '<div class="card"><h3>🎓 Mastery Status</h3>' +
                '<p>Student: ' + (student ? student.name : 'Unregistered') + '</p></div>';
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    startCountdown: function() {
        const pDate = prompt("Enter your planting date (YYYY-MM-DD):", "2026-03-15");
        if(pDate) {
            const dateObj = new Date(pDate);
            if(!isNaN(dateObj.getTime())) {
                // Average maturity 135 days
                dateObj.setDate(dateObj.getDate() + 135);
                const hDate = dateObj.toDateString();
                localStorage.setItem('agri_harvest', JSON.stringify({plantDate: pDate, harvestDate: hDate}));
                this.sync();
            } else {
                alert("Invalid date format. Please use YYYY-MM-DD.");
            }
        }
    },
    calcYield: function() {
        const acres = prompt("Enter acreage:");
        if(acres) alert("Potential: " + (acres * 28) + " bags.");
    },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Clear system?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
