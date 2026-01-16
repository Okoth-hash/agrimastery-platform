const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | GRID STABILIZED";
        }, 1000);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        this.render(view);
    },
    render: function(view) {
        // We create separate "buckets" for each feature so they don't overwrite
        let actionHtml = '';
        let educationHtml = '';
        let financialHtml = '';
        let adminHtml = '';
        // 1. ACTION PANEL (Always Visible)
        actionHtml = '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                     '<h3>🛠️ Main Tools</h3>' +
                     '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                     '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                     '<button class="btn" onclick="agriEngine.checkLoan()" style="background:#8338ec;">💰 Loan Check</button>' +
                     '<button class="btn" onclick="agriEngine.checkGroup()" style="background:#06d6a0;">👥 Group Power</button>' +
                     '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                     '</div></div>';
        // 2. EDUCATION SECTION (Always Visible)
        const student = JSON.parse(localStorage.getItem('agri_student'));
        educationHtml = '<div class="card" style="border-left:5px solid #2d6a4f;">' +
                        '<h3>🎓 Academy</h3>' +
                        (student ? '<p>Welcome back, <b>' + student.name + '</b>. Keep learning!</p>' : '<button class="btn" onclick="agriEngine.enroll()">Register Student</button>') +
                        '</div>';
        // 3. FINANCIALS (Visible only if data exists, but doesn't displace others)
        const loanData = JSON.parse(localStorage.getItem('agri_loan'));
        const groupData = JSON.parse(localStorage.getItem('agri_group'));
        if(loanData || groupData) {
            financialHtml += '<div class="card" style="background:#1a1a1a; border:1px solid #9d4edd;">' +
                             '<h3>🏦 Financial Status</h3>';
            if(loanData) financialHtml += '<p>Individual Limit: <b style="color:lime;">KES ' + loanData.limit.toLocaleString() + '</b></p>';
            if(groupData) financialHtml += '<p>Group Power: <b style="color:#06d6a0;">' + groupData.totalBags + ' Bags</b></p>';
            financialHtml += '<button class="btn" style="width:100%; font-size:9px; margin-top:5px;" onclick="agriEngine.clearFin()">Clear Financials</button></div>';
        }
        // 4. ADMIN (Always Bottom)
        adminHtml = '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                    '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                    '<p style="font-size:0.8em;">Dev: ' + this.author.name + '</p>' +
                    '<button class="btn" style="background:none; border:1px solid red; color:red; width:100%; margin-top:5px;" onclick="agriEngine.reset()">System Reset</button>' +
                    '</div>';
        // COMBINE ALL WITHOUT OVERWRITING
        view.innerHTML = actionHtml + educationHtml + financialHtml + adminHtml;
    },
    // Logic Functions
    clearFin: function() { localStorage.removeItem('agri_loan'); localStorage.removeItem('agri_group'); this.sync(); },
    enroll: function() { const n = prompt("Enter Name:"); if(n) { localStorage.setItem('agri_student', JSON.stringify({name:n})); this.sync(); } },
    calcYield: function() { const a = prompt("Acres:"); if(a) alert("Yield: " + (a*28) + " bags"); },
    checkLoan: function() { const b = prompt("Bags:"); if(b) { localStorage.setItem('agri_loan', JSON.stringify({limit: (b*3500*0.4)})); this.sync(); } },
    checkGroup: function() { const m = prompt("Members:"); if(m) { localStorage.setItem('agri_group', JSON.stringify({totalBags: (m*30)})); this.sync(); } },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Clear all?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
