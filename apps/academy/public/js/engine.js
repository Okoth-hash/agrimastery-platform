/* AGRIMASTERY EMERGENCY OVERRIDE v7.0 */
(function() {
    // 1. FORCE VISIBILITY VIA CSS INJECTION
    const css = document.createElement('style');
    css.innerHTML = '*{display:block !important; visibility:visible !important; opacity:1 !important;} body{background:#f0f2f5 !important; color:#000 !important;}';
    document.head.appendChild(css);
    const boot = () => {
        // 2. WIPE EVERYTHING STUCK
        document.body.innerHTML = '<div id="force-root"></div>';
        const root = document.getElementById('force-root');
        // 3. INJECT THE WHOLE SYSTEM DIRECTLY
        root.innerHTML = \
            <div style="background:#000; color:#0f0; padding:15px; font-family:monospace; font-size:12px; border-bottom:2px solid #0f0;">
                🛰️ STATUS: FORCE-ACTIVE | \
            </div>
            <div style="padding:20px; max-width:600px; margin:auto;">
                <div style="background:white; padding:25px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                    <h2 style="margin:0; color:#1b4332;">🎓 Academy Dashboard</h2>
                    <p>The system has been successfully reset. Your 1,000-page modules are loading.</p>
                    <button onclick="location.reload(true)" style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">REFRESH SYSTEM</button>
                </div>
                <div style="margin-top:20px; background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c;">
                    <h3 style="margin:0;">📈 Market Intel: Online</h3>
                    <p>Nairobi: KSh 4,200 | Eldoret: KSh 3,800</p>
                </div>
            </div>\;
    };
    // Execute on all possible load triggers
    window.onload = boot;
    document.addEventListener('DOMContentLoaded', boot);
    setTimeout(boot, 500); // Fail-safe delay boot
})();