(function() {
    const start = () => {
        const root = document.getElementById('root');
        if (!root) return;
        // Force visibility
        document.body.style.display = 'block';
        root.innerHTML = \
            <div style="background:#000; color:#0f0; padding:15px; font-family:monospace; font-size:12px;">
                🛰️ SYSTEM ONLINE | v8.0 | \
            </div>
            <div style="padding:20px; max-width:600px; margin:auto;">
                <div style="background:white; padding:25px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                    <h2 style="margin:0; color:#1b4332;">🎓 Academy Dashboard</h2>
                    <p>System successfully reactivated by Omondi Robin Okoth.</p>
                    <button style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; font-size:16px;">RESUME 1,000-PAGE MANUAL</button>
                </div>
                <div style="margin-top:20px; background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c;">
                    <h3 style="margin:0;">📈 Market Intel: Online</h3>
                    <p>Nairobi: KSh 4,200 | Eldoret: KSh 3,800</p>
                </div>
            </div>\;
    };
    // Run on load
    window.onload = start;
    if(document.readyState === 'complete') start();
})();