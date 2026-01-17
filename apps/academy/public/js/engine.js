const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'student',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        orders: JSON.parse(localStorage.getItem('agri_orders') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="ghost-trigger" style="height:5px; background:#111; cursor:crosshair;" ondblclick="agriEngine.unlockAdmin()"></div>
            <div id="viewport" style="min-height:100vh; padding-bottom:100px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:10px 0; box-shadow:0 -5px 15px rgba(0,0,0,0.1); z-index:9999;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'admin') this.renderAdminDashboard(view);
        else if (this.state.activeTab === 'tools') this.renderToolDashboard(view);
        else if (this.state.activeTab === 'market') this.renderEasyShop(view);
        else this.renderStudentDashboard(view);
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [
            { id: 'admin', label: 'Admin', icon: '👤', secure: true },
            { id: 'student', label: 'Academy', icon: '🎓', secure: false },
            { id: 'tools', label: 'Tools', icon: '🛠️', secure: false },
            { id: 'market', label: 'Market', icon: '🏪', secure: false }
        ];
        nav.innerHTML = tabs.map(t => {
            if(t.secure && !this.state.isAdmin) return '';
            const isActive = this.state.activeTab === t.id;
            return `<button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; text-align:center; color:${isActive ? '#f68b1e' : '#999'}">
                <div style="font-size:22px;">${t.icon}</div>
                <div style="font-size:10px; font-weight:bold;">${t.label}</div>
            </button>`;
        }).join('');
    },
    setTab: function(id) {
        this.state.activeTab = id;
        localStorage.setItem('agri_tab', id);
        this.render();
    },
    // --- MARKET DASHBOARD: EASY SHOP ---
    renderEasyShop: function(view) {
        view.innerHTML = `
            <div style="background:#f1f1f2; min-height:100vh; font-family:Arial, sans-serif;">
                <div style="background:#fff; padding:10px; display:flex; gap:10px; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-weight:bold; color:#f68b1e; font-size:20px;">EasyShop</div>
                    <input type="text" placeholder="Search on EasyShop" style="flex:1; padding:8px; border-radius:4px; border:1px solid #ccc; background:#f1f1f2;">
                </div>
                <div style="margin:10px; background:linear-gradient(45deg, #f68b1e, #ffcc00); height:150px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:white; text-align:center; padding:20px;">
                    <div><h2 style="margin:0;">FLASH SALES!</h2><p>Up to 50% off Harvest Gear</p></div>
                </div>
                <div style="display:flex; overflow-x:auto; padding:10px; gap:15px; background:white;">
                    ${['Grains', 'Fertilizer', 'Tech', 'Seeds', 'Livestock'].map(c => `
                        <div style="text-align:center; font-size:11px;">
                            <div style="width:50px; height:50px; background:#f1f1f2; border-radius:50%; margin-bottom:5px; display:flex; align-items:center; justify-content:center; font-size:20px;">📦</div>
                            ${c}
                        </div>
                    `).join('')}
                </div>
                <div style="padding:10px;">
                    <h3 style="margin-bottom:10px;">Recommended for you</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${this.getMarketItems().map(p => `
                            <div style="background:white; border-radius:4px; overflow:hidden;">
                                <div style="height:120px; background:#eee; display:flex; align-items:center; justify-content:center; font-size:40px;">${p.img}</div>
                                <div style="padding:10px;">
                                    <div style="font-size:13px; height:32px; overflow:hidden;">${p.name}</div>
                                    <div style="font-weight:bold; font-size:16px; margin:5px 0;">KSh ${p.price.toLocaleString()}</div>
                                    <div style="font-size:11px; color:#f68b1e; text-decoration:line-through;">KSh ${Math.floor(p.price * 1.2).toLocaleString()}</div>
                                    <button onclick="agriEngine.buyMarket('${p.name}', ${p.price})" style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; border-radius:4px; margin-top:8px; font-weight:bold; cursor:pointer;">ADD TO CART</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    getMarketItems: function() {
        return [
            { name: "Premium Grade Maize (90kg)", price: 3800, img: "🌽" },
            { name: "Organic Poultry Feed", price: 2100, img: "🐔" },
            { name: "Hybrid Cabbage Seeds", price: 1500, img: "🌱" },
            { name: "Solar Powered Lantern", price: 950, img: "💡" }
        ];
    },
    buyMarket: function(n, p) {
        if(this.state.wallet >= p) {
            this.state.wallet -= p;
            localStorage.setItem('agri_wallet', this.state.wallet);
            this.state.orders.unshift({item: n, price: p, status: 'Shipped', date: new Date().toLocaleDateString()});
            localStorage.setItem('agri_orders', JSON.stringify(this.state.orders));
            alert("Order placed on EasyShop!");
            this.render();
        } else { alert("Insufficient funds in AgriWallet!"); }
    },
    renderAdminDashboard: function(view) { view.innerHTML = `<div style="padding:20px; background:#111; color:white; min-height:100vh;"><h2>System Admin</h2><p>Monitoring EasyShop transactions...</p></div>`; },
    renderStudentDashboard: function(view) { 
        if(!this.state.user) { view.innerHTML = `<div style="padding:50px; text-align:center;"><h2>Join EasyShop</h2><button onclick="agriEngine.doReg()" style="width:100%; padding:15px; background:#f68b1e; color:white; border:none; border-radius:5px;">REGISTER</button></div>`; return; }
        view.innerHTML = `<div style="padding:20px;"><h1>Academy Home</h1><p>Wallet: KSh ${this.state.wallet.toLocaleString()}</p></div>`;
    },
    renderToolDashboard: function(view) { view.innerHTML = `<div style="padding:20px;"><h2>Tools Dashboard</h2><p>Hardware and Equipment store.</p></div>`; },
    unlockAdmin: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }},
    doReg: function() { localStorage.setItem('agri_student', JSON.stringify({name:"AgriStudent"})); location.reload(); }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
