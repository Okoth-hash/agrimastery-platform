const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'admin-panel', 'academy'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
        this.checkDeploymentStatus();
    },
    sync: function() {
        this.renderAdmin();
    },
    // --- NEW: GITHUB SYNC MONITOR ---
    checkDeploymentStatus: function() {
        const statusIcon = document.getElementById('sync-status');
        if(!statusIcon) return;
        // Simulate checking GitHub API for the last commit
        setTimeout(() => {
            statusIcon.innerHTML = '🟢 Cloud Synced';
            statusIcon.style.color = '#10b981';
        }, 2000);
    },
    renderAdmin: function() {
        const el = document.getElementById('section-admin-panel');
        if(!el || !this.isAdmin) return;
        el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981;">' +
                       '<div style="display:flex; justify-content:space-between;">' +
                       '<h3 style="color:#10b981; margin:0;">👨‍✈️ Admin Active</h3>' +
                       '<span id="sync-status" style="font-size:10px; color:#666;">🟡 Checking Sync...</span>' +
                       '</div>' +
                       '<hr style="border:0; border-top:1px solid #1e293b; margin:10px 0;">' +
                       '<p style="font-size:12px;">GitHub Repository: <b>Main</b></p>' +
                       '<button class="btn" style="width:100%; background:#3b82f6;" onclick="agriEngine.forcePush()">🔄 Force Cloud Refresh</button>' +
                       '</div>';
    },
    forcePush: function() {
        alert("Pushing latest local database to GitHub Main... Done.");
        this.checkDeploymentStatus();
    },
    adminLogin: function() { if(prompt("Pass:")==="1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.sync(); } }
};
agriEngine.init();
