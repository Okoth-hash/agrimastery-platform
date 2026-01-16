const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | GROUP MODULE ACTIVE";
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
        // 1. UPDATED ACTION PANEL
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Community Tools</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.checkGroup()" style="background:#06d6a0;">👥 Group Power</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. GROUP POWER DISPLAY
        const groupData = JSON.parse(localStorage.getItem('agri_group'));
        if(groupData) {
            html += '<div class="card" style="background:#073b4c; border:1px solid #06d6a0;">' +
                    '<h3 style="color:#06d6a0;">🤝 Group Collective</h3>' +
                    '<p>Total Farmers: <b>' + groupData.members + '</b></p>' +
                    '<p>Total Bags: <b>' + groupData.totalBags + '</b></p>' +
                    '<p>Group Loan Limit: <b style="color:lime;">KES ' + groupData.groupLimit.toLocaleString() + '</b></p>' +
                    '<small style="color:#aaa;">*Collective bargaining increases price per bag.</small>' +
                    '<button class="btn" style="width:100%; margin-top:10px; font-size:9px;" onclick="localStorage.removeItem(\'agri_group\'); agriEngine.sync()">Disband Group</button></div>';
        }
        // 3. BRANDING
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    checkGroup: function() {
        const members = prompt("How many farmers in your group?", "10");
        const avgBags = prompt("Average bags per farmer?", "30");
        if(members && avgBags) {
            const totalBags = members * avgBags;
            const groupValue = totalBags * 3800; // Better price (3800) due to bulk volume
            const groupLimit = groupValue * 0.50; // Higher credit limit (50%) for groups
            localStorage.setItem('agri_group', JSON.stringify({
                members: members, 
                totalBags: totalBags, 
                groupLimit: groupLimit
            }));
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
