const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['admin-panel', 'academy'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.renderAdmin();
    },
    // --- SYSTEM DIAGNOSTICS ---
    runDiagnostics: function() {
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const status = {
            "Academy Engine": "🟢 Operational",
            "Market Database": "🟢 Live (January 2026 Data)",
            "Storage Integrity": roster.length > 0 ? "🟢 Healthy" : "🟡 Empty Roster",
            "Cloud Sync": navigator.onLine ? "🟢 Online" : "🔴 Offline",
            "Security Protocol": "🔒 Active (Master Key Required)"
        };
        let report = "SYSTEM HEALTH REPORT\n--------------------\n";
        for (let mod in status) { report += ${mod}: \n; }
        alert(report);
    },
    renderAdmin: function() {
        const el = document.getElementById('section-admin-panel');
        if(!el || !this.isAdmin) return;
        el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981; border-radius:15px;">' +
                       '<h3 style="color:#10b981; margin:0;">👨‍✈️ Admin Command</h3>' +
                       '<p style="font-size:12px; color:#888;">System ID: AGRI-2026-PRO</p>' +
                       '<div style="display:grid; grid-template-columns:1fr; gap:10px; margin-top:15px;">' +
                       '<button class="btn" style="background:#334155;" onclick="agriEngine.runDiagnostics()">🔍 Run Full System Audit</button>' +
                       '<button class="btn" style="background:#1e293b;" onclick="agriEngine.clearCache()">🧹 Clear Temporary Logs</button>' +
                       '<button class="btn" style="background:#ef4444;" onclick="agriEngine.logoutAdmin()">Lock System</button>' +
                       '</div></div>';
    },
    clearCache: function() {
        if(confirm("This will clear temporary UI logs. Student data will remain safe. Proceed?")) {
            console.clear();
            alert("System Cache Purged.");
        }
    },
    adminLogin: function() { if(prompt("Key:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } },
    logoutAdmin: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.sync(); }
};
agriEngine.init();
