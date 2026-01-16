const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | FINANCIAL ENGINE LIVE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        this.render(view);
    },
    render: function(view) {
        let html = '';
        // 1. UPDATED ACTION PANEL WITH LOAN CALCULATOR
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Farmer Financials</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.checkLoan()" style="background:#8338ec;">💰 Loan Check</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. LOAN STATUS DISPLAY
        const loanData = JSON.parse(localStorage.getItem('agri_loan'));
        if(loanData) {
            html += '<div class="card" style="background:#3c096c; border:1px solid #9d4edd;">' +
                    '<h3 style="color:#ff9e00;">🏦 Credit Estimate</h3>' +
                    '<p>Crop Value: <b>KES ' + loanData.value.toLocaleString() + '</b></p>' +
                    '<p>Eligible Loan: <b style="color:lime;">KES ' + loanData.limit.toLocaleString() + '</b></p>' +
                    '<small style="color:#aaa;">*Max limit is 40% of projected harvest value.</small>' +
                    '<button class="btn" style="width:100%; margin-top:10px; font-size:9px;" onclick="localStorage.removeItem(\'agri_loan\'); agriEngine.sync()">New Calculation</button></div>';
        }
        // 3. BRANDING & CLOCK
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    checkLoan: function() {
        const bags = prompt("Enter your projected harvest (bags):", "50");
        if(bags) {
            const pricePerBag = 3500; // Estimated market price
            const totalValue = bags * pricePerBag;
            const loanLimit = totalValue * 0.40; // 40% safety limit
            localStorage.setItem('agri_loan', JSON.stringify({value: totalValue, limit: loanLimit}));
            this.sync();
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
