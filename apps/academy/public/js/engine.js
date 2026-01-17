const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        activeTab: localStorage.getItem('agri_tab') || 'student',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        cart: JSON.parse(localStorage.getItem('agri_cart') || '[]'),
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        contact: "0742178833"
    },
    init: function() {
        document.body.innerHTML = `
            <div id="global-header" style="position:fixed; top:0; width:100%; height:55px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding:0 15px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:10000; box-sizing:border-box;">
                <div style="font-weight:900; color:#f68b1e; font-size:22px; letter-spacing:-1px;">EasyShop</div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="color:#2d6a4f; font-weight:bold; font-size:14px;">KSh ${this.state.wallet.toLocaleString()}</div>
                    <div onclick="agriEngine.toggleCart()" style="position:relative; cursor:pointer;">
                        <span style="font-size:24px;">🛒</span>
                        <div id="cart-count" style="position:absolute; top:-5px; right:-8px; background:#f68b1e; color:white; font-size:10px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; border-radius:50%; font-weight:bold;">${this.state.cart.length}</div>
                    </div>
                </div>
            </div>
            <div id="viewport" style="min-height:100vh; padding-top:55px; padding-bottom:100px; background:#f1f1f2; font-family:Roboto, Arial, sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:10px 0; box-shadow:0 -2px 15px rgba(0,0,0,0.05); z-index:9999; border-top:1px solid #ddd;"></div>
            <div id="cart-modal" style="display:none; position:fixed; top:55px; right:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10001;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'admin') this.renderAdmin(view);
        else if (this.state.activeTab === 'tools') this.renderTools(view);
        else if (this.state.activeTab === 'market') this.renderEasyShop(view);
        else this.renderAcademy(view);
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [
            { id: 'admin', label: 'Admin', icon: '👤', color: '#1e3a8a' },
            { id: 'student', label: 'Academy', icon: '🎓', color: '#2d6a4f' },
            { id: 'tools', label: 'Tools', icon: '🛠️', color: '#1b4332' },
            { id: 'market', label: 'Market', icon: '🏪', color: '#f68b1e' }
        ];
        nav.innerHTML = tabs.map(t => `
            <button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; cursor:pointer; color:${this.state.activeTab === t.id ? t.color : '#75757a'}">
                <div style="font-size:20px;">${t.icon}</div>
                <div style="font-size:11px; font-weight:${this.state.activeTab === t.id ? 'bold' : 'normal'}; margin-top:2px;">${t.label}</div>
            </button>
        `).join('');
    },
    setTab: function(id) { this.state.activeTab = id; localStorage.setItem('agri_tab', id); this.render(); },
    // --- FULL JUMIA-STYLE MARKET ---
    renderEasyShop: function(v) {
        const products = [
            { n: "High Yield Maize (90kg)", p: 3850, op: 4500, i: "🌽", off: "14%" },
            { n: "DAP Planting Fertilizer", p: 6100, op: 7200, i: "📦", off: "15%" },
            { n: "Solar Water Pump v2", p: 18400, op: 22000, i: "☀️", off: "16%" },
            { n: "Poultry Layers Mash", p: 2950, op: 3200, i: "🐔", off: "8%" }
        ];
        v.innerHTML = `
            <div style="background:#fff; padding:10px 15px; display:flex; gap:10px; align-items:center;">
                <div style="flex:1; background:#f1f1f2; border-radius:4px; padding:8px 12px; display:flex; align-items:center; color:#75757a; font-size:14px;">
                    🔍 Search on EasyShop
                </div>
            </div>
            <div style="margin:10px; height:140px; border-radius:8px; background:linear-gradient(90deg, #f68b1e, #ff9d2e); display:flex; align-items:center; padding:20px; color:#fff;">
                <div><h2 style="margin:0; font-size:24px;">FLASH SALES</h2><p style="margin:5px 0 0 0; font-size:14px;">New arrivals every Monday!</p></div>
            </div>
            <div style="background:#fff; margin-bottom:10px; padding:12px 15px; display:flex; justify-content:space-between; align-items:center; font-size:13px; border-top:1px solid #eee;">
                <span>Need Help? Contact us</span>
                <a href="tel:${this.state.contact}" style="color:#f68b1e; font-weight:bold; text-decoration:none;">📞 ${this.state.contact}</a>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0 8px;">
                ${products.map(p => `
                    <div style="background:#fff; border-radius:4px; overflow:hidden; display:flex; flex-direction:column; position:relative;">
                        <div style="position:absolute; top:5px; right:5px; background:#feefde; color:#f68b1e; font-size:10px; padding:2px 4px; font-weight:bold;">-${p.off}</div>
                        <div style="height:140px; background:#f8f8f8; display:flex; align-items:center; justify-content:center; font-size:50px;">${p.i}</div>
                        <div style="padding:10px; flex:1;">
                            <div style="font-size:13px; color:#313133; height:34px; overflow:hidden; line-height:1.3;">${p.n}</div>
                            <div style="font-size:16px; font-weight:bold; color:#313133; margin-top:5px;">KSh ${p.p.toLocaleString()}</div>
                            <div style="font-size:12px; color:#75757a; text-decoration:line-through;">KSh ${p.op.toLocaleString()}</div>
                            <button onclick="agriEngine.addToCart('${p.n}', ${p.p})" style="width:100%; background:#f68b1e; color:#fff; border:none; padding:10px; border-radius:4px; margin-top:10px; font-weight:bold; box-shadow:0 2px 4px rgba(246,139,30,0.3); cursor:pointer;">ADD TO CART</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    addToCart: function(name, price) {
        this.state.cart.push({ name, price });
        localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        document.getElementById('cart-count').innerText = this.state.cart.length;
        // Visual Feedback
        const btn = event.target;
        btn.innerText = "ADDED ✅"; btn.style.background = "#2d6a4f";
        setTimeout(() => { btn.innerText = "ADD TO CART"; btn.style.background = "#f68b1e"; }, 1500);
    },
    toggleCart: function() {
        const modal = document.getElementById('cart-modal');
        if (modal.style.display === 'block') { modal.style.display = 'none'; return; }
        const total = this.state.cart.reduce((s, i) => s + i.price, 0);
        modal.style.display = 'block';
        modal.innerHTML = `
            <div style="position:absolute; right:0; top:0; width:85%; height:100%; background:#fff; padding:20px; box-sizing:border-box;">
                <h3 style="margin-top:0;">Cart (${this.state.cart.length})</h3>
                <div style="max-height:70%; overflow-y:auto;">
                    ${this.state.cart.map((i, idx) => `
                        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
                            <span style="font-size:13px;">${i.name}</span>
                            <b>KSh ${i.price.toLocaleString()}</b>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:20px; border-top:2px solid #f1f1f2; padding-top:15px;">
                    <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:bold;">
                        <span>Total:</span><span>KSh ${total.toLocaleString()}</span>
                    </div>
                    <button onclick="agriEngine.checkout()" style="width:100%; background:#f68b1e; color:#fff; border:none; padding:15px; border-radius:4px; margin-top:20px; font-weight:bold; font-size:16px;">CHECKOUT NOW</button>
                    <p style="text-align:center; font-size:12px; color:#75757a; margin-top:15px;">Enquiries: ${this.state.contact}</p>
                </div>
            </div>
        `;
    },
    checkout: function() {
        const total = this.state.cart.reduce((s, i) => s + i.price, 0);
        if(this.state.wallet >= total) {
            this.state.wallet -= total;
            this.state.cart = [];
            localStorage.setItem('agri_wallet', this.state.wallet);
            localStorage.setItem('agri_cart', '[]');
            alert("Order Placed Successfully!");
            location.reload();
        } else { alert("Insufficient AgriWallet Balance!"); }
    },
    renderAdmin: function(v) { v.innerHTML = `<div style="padding:20px; background:#1e3a8a; color:white; min-height:100vh;"><h2>Admin Console</h2><p>Managing EasyShop Active Line: ${this.state.contact}</p></div>`; },
    renderAcademy: function(v) { v.innerHTML = `<div style="padding:20px;"><h2>Academy Dashboard</h2></div>`; },
    renderTools: function(v) { v.innerHTML = `<div style="padding:20px;"><h2>Hardware Tools Store</h2></div>`; }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
