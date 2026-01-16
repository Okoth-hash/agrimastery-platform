const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    // --- MARKET DATABASE (Prices per 90kg bag) ---
    marketPrices: [
        { region: "Nairobi", price: 4200, trend: "up" },
        { region: "Eldoret", price: 3800, trend: "stable" },
        { region: "Mombasa", price: 4500, trend: "up" },
        { region: "Nakuru", price: 3900, trend: "down" }
    ],
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'market', 'academy', 'admin'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('market', this.getMarketHtml());
        this.updateSection('academy', this.getAcademyHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    // --- MARKETPLACE DASHBOARD ---
    getMarketHtml: function() {
        let h = '<div class="card" style="background:#f8f9fa; border-top:5px solid #ff9100;">';
        h += '<h3>📈 Real-Time Market Prices (KES)</h3>';
        h += '<div style="display:flex; flex-direction:column; gap:5px;">';
        this.marketPrices.forEach(m => {
            const icon = m.trend === "up" ? "🔺" : (m.trend === "down" ? "🔻" : "➖");
            h += <div style="display:flex; justify-content:space-between; background:white; padding:10px; border-radius:5px; border:1px solid #eee;">
                    <b></b> 
                    <span>KSh  </span>
                  </div>;
        });
        h += '</div>';
        // Trading Controls
        h += '<div style="margin-top:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">';
        h += '<button class="btn" style="background:#2d6a4f;" onclick="agriEngine.sellProduce()">💰 List My Produce</button>';
        h += '<button class="btn" style="background:#3d5a80;" onclick="agriEngine.findBuyers()">🤝 Find Buyers</button>';
        h += '</div></div>';
        return h;
    },
    sellProduce: function() {
        if(!this.currentUser) return alert("Login to access the market.");
        const amount = prompt("How many 90kg bags do you have for sale?");
        const price = prompt("Asking price per bag?");
        if(amount && price) {
            alert(Success! Your  bags are now visible to buyers in .);
            // Here you would typically save this to a 'market_listings' array
        }
    },
    findBuyers: function() {
        alert("Connecting to NCPB (National Cereals and Produce Board) and local millers...");
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Academy</h3><button class="btn" onclick="agriEngine.adminLogin()">Login</button></div>';
        return '<div class="card"><h3>👋 ' + this.currentUser.name + '</h3><p>Ready to trade?</p></div>';
    },
    adminLogin: function() { if(prompt("Pass:") === "1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); location.reload(); } }
};
agriEngine.init();
