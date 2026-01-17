const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    version: "2.0.0-P4-Final",
    // --- PHASE 4 CORE LOGIC ---
    init: function() {
        console.log("PHASE 4: Final Integration Initiated.");
        this.buildEnvironment();
        this.loadState();
        this.pulse();
        // Listeners to keep Phase 3 Persistence active
        window.addEventListener('scroll', () => this.pulse());
        window.addEventListener('click', () => this.pulse());
    },
    buildEnvironment: function() {
        document.body.innerHTML = '<div id="agri-app"></div>';
        const app = document.getElementById('agri-app');
        app.style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f7f6; min-height:100vh;";
        app.innerHTML = \
            <div id="p4-status" style="background:#1a1a1a; color:#00ff88; padding:10px; font-family:monospace; font-size:12px; position:sticky; top:0; border-bottom:2px solid #00ff88; z-index:9999;"></div>
            <div style="padding:20px; max-width:900px; margin:auto;">
                <h1 style="color:#1b4332; text-align:center;">AgriMastery Unified Platform</h1>
                <div id="p2-admin-intel"></div>
                <div id="p3-academy-persistence"></div>
                <div id="p2-market-intel"></div>
                <div id="p1-glossary-foundation"></div>
            </div>\;
    },
    loadState: function() {
        this.isAdmin = localStorage.getItem('agri_admin_active') === 'true';
        this.user = JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null');
        this.renderModules();
    },
    pulse: function() {
        const status = document.getElementById('p4-status');
        if(status) status.innerHTML = "🛰️ PHASE 4 ACTIVE | HEARTBEAT: " + new Date().toLocaleTimeString() + " | DATA SECURE";
    },
    renderModules: function() {
        // Phase 2: Admin Intel
        document.getElementById('p2-admin-intel').innerHTML = this.isAdmin ? 
            '<div style="background:#0b0f19; color:#00ff88; padding:15px; border-radius:10px; margin-bottom:15px;">👨‍✈️ Admin: System Oversight Active</div>' : 
            '<div style="background:#fff; padding:15px; border-radius:10px; border:1px solid #ddd; margin-bottom:15px; text-align:center;"><button onclick="agriEngine.login()" style="cursor:pointer; border:none; background:none; color:#666;">Admin Access</button></div>';
        // Phase 3: Academy Persistence
        const pg = this.user ? (this.user.lastPage || 1) : 0;
        document.getElementById('p3-academy-persistence').innerHTML = \
            <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border-left:8px solid #2d6a4f; margin-bottom:15px;">
                <h3>🎓 Academy Module</h3>
                \
            </div>\;
        // Phase 2: Market Intel
        document.getElementById('p2-market-intel').innerHTML = \
            <div style="background:#fff7ed; padding:20px; border-radius:12px; border-top:5px solid #ea580c; margin-bottom:15px;">
                <h3>📈 Market Intel</h3>
                <p>Nairobi: KSh 4,200 | Eldoret: KSh 3,800</p>
            </div>\;
        // Phase 1: Glossary Foundation
        document.getElementById('p1-glossary-foundation').innerHTML = \
            <div style="background:white; padding:20px; border-radius:12px; border:1px solid #eee;">
                <h3>🔍 Visual Glossary</h3>
                <input type="text" placeholder="Search 5,000+ terms..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd;">
            </div>\;
    },
    login: function() { if(prompt("Key:")==="1234") { localStorage.setItem('agri_admin_active','true'); location.reload(); } }
};
window.onload = () => agriEngine.init();
