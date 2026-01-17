(function() {
    const agriEngine = {
        init: function() {
            const viewport = document.getElementById('app-viewport');
            if (!viewport) return;
            // Load saved state
            const user = JSON.parse(localStorage.getItem('agri_logged_in_user') || '{"name":"Farmer", "lastPage":1}');
            const isAdmin = localStorage.getItem('agri_admin_active') === 'true';
            viewport.innerHTML = \
                <div style="background:#000; color:#0f0; padding:12px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between;">
                    <span>🛰️ SYSTEM ONLINE (v5.0)</span>
                    <span>\</span>
                </div>
                <div style="max-width:800px; margin:auto; padding:20px;">
                    \
                    <div style="background:white; padding:25px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 10px 20px rgba(0,0,0,0.05); margin-bottom:20px;">
                        <h2 style="margin:0; color:#1b4332;">🎓 Academy Dashboard</h2>
                        <p style="color:#666;">Welcome back, <b>\</b></p>
                        <p>Progress: <b>Page \ of 1,000</b></p>
                        <button style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; font-size:16px;">RESUME TRAINING</button>
                    </div>
                    <div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:6px solid #ea580c; margin-bottom:20px;">
                        <h3 style="margin:0; color:#9a3412;">📈 Market Intelligence</h3>
                        <p>Nairobi: KSh 4,200 | Eldoret: KSh 3,800</p>
                    </div>
                    <div style="background:white; padding:25px; border-radius:15px; border:1px solid #e5e7eb;">
                        <h3 style="margin:0; color:#1b4332;">🔍 Visual Glossary</h3>
                        <input type="text" placeholder="Search 5,000+ terms..." style="width:100%; padding:15px; border:1px solid #ddd; border-radius:10px; margin-top:15px; font-size:16px; box-sizing:border-box;">
                    </div>
                </div>\;
        }
    };
    // Immediate execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', agriEngine.init);
    } else {
        agriEngine.init();
    }
})();
