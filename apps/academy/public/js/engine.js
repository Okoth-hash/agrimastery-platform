(function() {
    const agriEngine = {
        marketData: [
            { loc: "Nairobi", price: "4,200" },
            { loc: "Eldoret", price: "3,800" },
            { loc: "Mombasa", price: "4,500" }
        ],
        init: function() {
            // Recovering your saved data from the browser vault
            this.user = JSON.parse(localStorage.getItem('agri_logged_in_user') || '{"name":"Farmer", "lastPage":1}');
            this.isAdmin = localStorage.getItem('agri_admin_active') === 'true';
            this.render();
        },
        render: function() {
            document.body.innerHTML = '<div id="main-ui"></div>';
            const ui = document.getElementById('main-ui');
            ui.style = "background:#f0f2f5; min-height:100vh; font-family:sans-serif; margin:0;";
            ui.innerHTML = \
                <div style="background:#000; color:#0f0; padding:15px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between;">
                    <span>🛰️ RECOVERY ACTIVE</span>
                    <span>\</span>
                </div>
                <div style="max-width:800px; margin:auto; padding:20px;">
                    <div style="background:white; padding:25px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 10px 30px rgba(0,0,0,0.1); margin-bottom:20px;">
                        <h2 style="margin:0; color:#1b4332;">🎓 Academy Dashboard</h2>
                        <p>Continuing from <b>Page \</b> of 1,000.</p>
                        <button style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">OPEN MANUAL</button>
                    </div>
                    <div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c; margin-bottom:20px;">
                        <h3 style="margin:0; color:#9a3412;">📈 Market Prices</h3>
                        <div id="market-list"></div>
                    </div>
                </div>\;
            // Logic to fill the market list without breaking PowerShell syntax
            const list = document.getElementById('market-list');
            this.marketData.forEach(m => {
                list.innerHTML += '<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>' + m.loc + '</span><b>KSh ' + m.price + '</b></div>';
            });
        }
    };
    window.onload = () => agriEngine.init();
})();