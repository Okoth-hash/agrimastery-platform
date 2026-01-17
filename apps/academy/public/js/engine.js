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
            <div id="global-header" style="position:fixed; top:0; width:100%; height:50px; background:white; display:flex; justify-content:space-between; align-items:center; padding:0 15px; box-shadow:0 2px 10px rgba(0,0,0,0.05); z-index:10000; box-sizing:border-box;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="background:#1e3a8a; color:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px;">KSh</div>
                    <b style="color:#1e3a8a;">${this.state.wallet.toLocaleString()}</b>
                </div>
                <div onclick="agriEngine.toggleCart()" style="position:relative; cursor:pointer;">
                    <span style="font-size:20px;">🛒</span>
                    <div id="cart-count" style="position:absolute; top:-5px; right:-8px; background:#f68b1e; color:white; font-size:10px; padding:2px 5px; border-radius:10px;">${this.state.cart.length}</div>
                </div>
            </div>
            <div id="viewport" style="min-height:100vh; padding-top:50px; padding-bottom:100px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:12px 0; box-shadow:0 -5px 15px rgba(0,0,0,0.1); z-index:9999; border-top:1px solid #eee;"></div>
            <div id="cart-modal" style="display:none; position:fixed; top:60px; right:15px; width:280px; background:white; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:10001; padding:15px;"></div>
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
            { id: 'market', label: 'EasyShop', icon: '🏪', color: '#f68b1e' }
        ];
        nav.innerHTML = tabs.map(t => `<button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; color:${this.state.activeTab === t.id ? t.color : '#bbb'}">
            <div style="font-size:22px;">${t.icon}</div>
            <div style="font-size:10px; font-weight:bold;">${t.label}</div>
        </button>`).join('');
    },
    setTab: function(id) { this.state.activeTab = id; localStorage.setItem('agri_tab', id); this.render(); },
    // --- ACTIVATED EASY SHOP ---
    renderEasyShop: function(v) {
        const items = [
            { n: "Hybrid Maize (90kg)", p: 3800, i: "🌽" },
            { n: "DAP Fertilizer", p: 6200, i: "📦" },
            { n: "Irrigation Pump", p: 15500, i: "⚙️" },
            { n: "Chicken Feed (50kg)", p: 2800, i: "🐔" }
        ];
        v.innerHTML = `
            <div style="background:#f4f4f4; min-height:100vh;">
                <div style="background:#fff; padding:15px; border-bottom:2px solid #f68b1e; display:flex; justify-content:space-between;">
                    <b style="color:#f68b1e; font-size:18px;">EasyShop</b>
                    <a href="tel:${this.state.contact}" style="color:#1e3a8a; font-size:12px; font-weight:bold; text-decoration:none;">📞 Support: ${this.state.contact}</a>
                </div>
                <div style="padding:15px;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        ${items.map(item => `
                            <div style="background:white; border-radius:8px; padding:10px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                                <div style="font-size:40px; text-align:center; padding:10px;">${item.i}</div>
                                <div style="font-size:13px; font-weight:bold; height:35px;">${item.n}</div>
                                <div style="color:#f68b1e; font-weight:bold; margin:5px 0;">KSh ${item.p.toLocaleString()}</div>
                                <button onclick="agriEngine.addToCart('${item.n}', ${item.p})" style="width:100%; background:#f68b1e; color:white; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer;">ADD TO CART</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    addToCart: function(name, price) {
        this.state.cart.push({ name, price });
        localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        document.getElementById('cart-count').innerText = this.state.cart.length;
        alert(`${name} added to cart!`);
    },
    toggleCart: function() {
        const modal = document.getElementById('cart-modal');
        if (modal.style.display === 'block') { modal.style.display = 'none'; return; }
        const total = this.state.cart.reduce((s, i) => s + i.price, 0);
        modal.style.display = 'block';
        modal.innerHTML = `
            <h3 style="margin:0 0 10px 0;">Your Order</h3>
            ${this.state.cart.map(i => `<div style="font-size:12px; margin-bottom:5px;">${i.name} - KSh ${i.price}</div>`).join('')}
            <div style="font-weight:bold; border-top:1px solid #eee; padding-top:10px; margin-top:10px;">Total: KSh ${total.toLocaleString()}</div>
            <button onclick="agriEngine.checkout()" style="width:100%; background:#1e3a8a; color:white; border:none; padding:12px; border-radius:5px; margin-top:10px; font-weight:bold; cursor:pointer;">PAY VIA WALLET</button>
            <p style="font-size:10px; text-align:center; color:#666; margin-top:10px;">M-Pesa Enquiries: ${this.state.contact}</p>
        `;
    },
    checkout: function() {
        const total = this.state.cart.reduce((s, i) => s + i.price, 0);
        if(this.state.wallet >= total) {
            this.state.wallet -= total;
            this.state.cart = [];
            localStorage.setItem('agri_wallet', this.state.wallet);
            localStorage.setItem('agri_cart', '[]');
            alert("Transaction Complete!");
            location.reload();
        } else { alert("Insufficient Balance in AgriWallet."); }
    },
    renderAdmin: function(v) { v.innerHTML = `<div style="padding:20px; background:#1e3a8a; color:white; min-height:100vh;"><h2>Admin Console</h2><p>Support Line: ${this.state.contact}</p></div>`; },
    renderAcademy: function(v) { v.innerHTML = `<div style="padding:20px;"><h2>Academy Dashboard</h2></div>`; },
    renderTools: function(v) { v.innerHTML = `<div style="padding:20px;"><h2>Tools Store</h2></div>`; }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
