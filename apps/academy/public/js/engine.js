const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    user: JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null'),
    lang: localStorage.getItem('agri_lang') || 'en',
    init: function() {
        // 1. FORCE CLEAR THE "INITIALIZING" SCREEN
        document.body.innerHTML = '';
        document.body.style = "margin:0; background:#f0f2f5; font-family:sans-serif; display:block !important;";
        // 2. RECONSTRUCT CORE CONTAINERS
        const shell = document.createElement('div');
        shell.id = 'agri-shell';
        document.body.appendChild(shell);
        this.renderAll();
        console.log("FORCE LOAD: Content Restored.");
    },
    renderAll: function() {
        const shell = document.getElementById('agri-shell');
        const d = this.lang === 'sw' ? { academy: "Chuo cha Kilimo", market: "Soko", glossary: "Kamusi" } : { academy: "Professional Academy", market: "Market Intel", glossary: "Visual Glossary" };
        shell.innerHTML = \
            <div id="status-bar" style="background:#000; color:#0f0; padding:10px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between; position:sticky; top:0;">
                <span>🛰️ SYSTEM ONLINE</span>
                <span>\</span>
            </div>
            <div style="max-width:800px; margin:auto; padding:20px;">
                <div style="background:white; padding:25px; border-radius:15px; border-left:8px solid #2d6a4f; margin-bottom:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                    <h2 style="margin:0;">🎓 \</h2>
                    <p>Current Progress: \ / 1,000 Pages</p>
                    <button style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">RESUME MANUAL</button>
                </div>
                <div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c; margin-bottom:20px;">
                    <h3>📈 \</h3>
                    <p>Nairobi: KSh 4,200 | Eldoret: KSh 3,800</p>
                </div>
                <div style="background:white; padding:20px; border-radius:15px; border:1px solid #ddd;">
                    <h3>🔍 \</h3>
                    <input type="text" placeholder="Search 5,000+ terms..." style="width:100%; padding:12px; border:1px solid #ccc; border-radius:8px; box-sizing:border-box;">
                </div>
            </div>\;
    }
};
// Start immediately
agriEngine.init();
