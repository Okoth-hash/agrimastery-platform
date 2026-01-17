(function() {
    // 1. STYLESHEET INJECTION (Ensures visibility)
    const style = document.createElement('style');
    style.innerHTML = 'body, html { visibility: visible !important; opacity: 1 !important; display: block !important; background: #f0f2f5; } #app-viewport { display: block !important; }';
    document.head.appendChild(style);
    const agriEngine = {
        init: function() {
            const view = document.getElementById('app-viewport') || document.body;
            const user = JSON.parse(localStorage.getItem('agri_logged_in_user') || '{"name":"Farmer"}');
            view.innerHTML = \
                <div style="background:#000; color:#0f0; padding:15px; font-family:monospace; font-size:12px; border-bottom:2px solid #0f0;">
                    🛰️ SYSTEM ONLINE | v6.0 FINAL | \
                </div>
                <div style="padding:20px; max-width:600px; margin:auto;">
                    <div style="background:white; padding:25px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                        <h2 style="margin:0; color:#1b4332;">🎓 Academy Active</h2>
                        <p>Welcome, <b>\</b>. Your 1,000-page manual is ready.</p>
                        <button style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; font-size:16px;">ENTER ACADEMY</button>
                    </div>
                    <div style="margin-top:20px; background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c;">
                        <h3 style="margin:0;">📈 Market Intel: Online</h3>
                    </div>
                </div>\;
        }
    };
    window.onload = agriEngine.init;
    if(document.readyState === 'complete') agriEngine.init();
})();