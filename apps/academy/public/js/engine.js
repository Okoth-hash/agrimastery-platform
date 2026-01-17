/**
 * AGRIMASTERY ENGINE v4.0.1 - CACHE BUSTER
 * Forced Content Re-Injection
 */
const agriEngine = {
    version: "4.0.1",
    author: "Omondi Robin Okoth",
    init: function() {
        // 1. CLEAR STUCK UI IMMEDIATELY
        document.documentElement.innerHTML = '<html><body id="agri-body"></body></html>';
        const body = document.getElementById('agri-body');
        body.style = "margin:0; background:#f0f2f5; font-family:sans-serif; min-height:100vh;";
        // 2. DATA RECOVERY
        this.isAdmin = localStorage.getItem('agri_admin_active') === 'true';
        this.user = JSON.parse(localStorage.getItem('agri_logged_in_user') || '{"name":"Farmer", "lastPage":1}');
        this.renderMasterUI(body);
        console.log("CACHE PURGED: System Reactivated.");
    },
    renderMasterUI: function(container) {
        container.innerHTML = \
            <div style="background:#000; color:#0f0; padding:10px; font-family:monospace; font-size:10px; display:flex; justify-content:space-between;">
                <span>🛰️ SYSTEM LIVE v\</span>
                <span>\</span>
            </div>
            <div style="max-width:800px; margin:auto; padding:20px;">
                <div style="background:#0b0f19; color:#0f0; padding:15px; border-radius:10px; border:1px solid #0f0; margin-bottom:20px; \">
                    👨‍✈️ Admin Console Active
                </div>
                <div style="background:white; padding:25px; border-radius:15px; border-left:8px solid #2d6a4f; box-shadow:0 4px 10px rgba(0,0,0,0.1); margin-bottom:20px;">
                    <h2 style="margin:0;">🎓 Professional Academy</h2>
                    <p>Student: <b>\</b> | Progress: \/1000</p>
                    <button style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">RESUME TRAINING</button>
                </div>
                <div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c; margin-bottom:20px;">
                    <h3 style="margin:0;">📈 Market Intel</h3>
                    <div style="display:flex; justify-content:space-between; margin-top:10px;"><span>Nairobi</span><b>KSh 4,200</b></div>
                </div>
                <div style="background:white; padding:20px; border-radius:15px; border:1px solid #ddd;">
                    <h3>🔍 Visual Glossary</h3>
                    <input type="text" placeholder="Search 5,000+ terms..." style="width:100%; padding:12px; border:1px solid #ccc; border-radius:8px; box-sizing:border-box;">
                </div>
            </div>\;
    }
};
// Force boot
window.addEventListener('load', () => agriEngine.init());
// Backup boot if load event already fired
if (document.readyState === 'complete') { agriEngine.init(); }
