const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'student',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        cart: JSON.parse(localStorage.getItem('agri_cart') || '[]'),
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="ghost-trigger" style="height:5px; background:#111; cursor:crosshair;" ondblclick="agriEngine.unlockAdmin()"></div>
            <div id="global-header" style="position:fixed; top:5px; width:100%; height:50px; background:white; display:flex; justify-content:space-between; align-items:center; padding:0 15px; box-shadow:0 2px 10px rgba(0,0,0,0.05); z-index:10000; box-sizing:border-box;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="background:#f68b1e; color:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px;">KSh</div>
                    <b style="color:#2d6a4f;">${this.state.wallet.toLocaleString()}</b>
                </div>
                <div onclick="agriEngine.toggleCart()" style="position:relative; cursor:pointer;">
                    <span style="font-size:20px;">🛒</span>
                    <div id="cart-count" style="position:absolute; top:-5px; right:-8px; background:#f68b1e; color:white; font-size:10px; padding:2px 5px; border-radius:10px;">${this.state.cart.length}</div>
                </div>
            </div>
            <div id="viewport" style="min-height:100vh; padding-top:60px; padding-bottom:100px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:12px 0; box-shadow:0 -5px 15px rgba(0,0,0,0.1); z-index:9999; border-top:1px solid #eee;"></div>
            <div id="cart-modal" style="display:none; position:fixed; top:60px; right:15px; width:280px; background:white; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:10001; padding:15px; max-height:400px; overflow-y:auto;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'admin') this.renderAdmin(view);
        else if (this.state.activeTab === 'student') this.renderAcademy(view);
        else if (this.state.activeTab === 'tools') this.renderTools(view);
        else if (this.state.activeTab === 'market') this.renderEasyShop(view);
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [
            { id: 'admin', label: 'Admin', icon: '👤', secure: true },
            { id: 'student', label: 'Academy', icon: '🎓', secure: false },
            { id: 'tools', label: 'Tools', icon: '🛠️', secure: false },
            { id: 'market', label: 'EasyShop', icon: '🏪', secure: false }
        ];
        nav.innerHTML = tabs.map(t => {
            if(t.secure && !this.state.isAdmin) return '';
            const isActive = this.state.activeTab === t.id;
            return `<button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; color:${isActive ? '#2d6a4f' : '#bbb'}">
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
    // --- SHARED COMMERCE LOGIC ---
    addToCart: function(name, price) {
        this.state.cart.push({ name, price });
        localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        document.getElementById('cart-count').innerText = this.state.cart.length;
        this.toggleCart(true);
    },
    toggleCart: function(forceOpen = false) {
        const modal = document.getElementById('cart-modal');
        if (modal.style.display === 'block' && !forceOpen) {
            modal.style.display = 'none';
        } else {
            const total = this.state.cart.reduce((sum, item) => sum + item.price, 0);
            modal.style.display = 'block';
            modal.innerHTML = `
                <h4 style="margin:0 0 10px 0;">Your Cart</h4>
                ${this.state.cart.map((item, i) => `<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;"><span>${item.name}</span><b>KSh ${item.price}</b></div>`).join('')}
                <hr>
                <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:10px;"><span>Total:</span><span>KSh ${total}</span></div>
                <button onclick="agriEngine.checkout()" style="width:100%; padding:10px; background:#f68b1e; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">CHECKOUT</button>
            `;
        }
    },
    checkout: function() {
        const total = this.state.cart.reduce((sum, item) => sum + item.price, 0);
        if (this.state.wallet >= total) {
            this.state.wallet -= total;
            this.state.cart = [];
            localStorage.setItem('agri_wallet', this.state.wallet);
            localStorage.setItem('agri_cart', '[]');
            alert("Payment Successful! Orders are being processed.");
            location.reload();
        } else { alert("Insufficient Wallet Balance!"); }
    },
    // --- DASHBOARD RENDERS (TRUNCATED FOR LOGIC) ---
    renderAcademy: function(v) { v.innerHTML = `<div style="padding:20px;"><h3>Welcome to Academy</h3><p>Your wallet is synced across all shops.</p></div>`; },
    renderTools: function(v) { 
        v.innerHTML = `<div style="padding:20px;"><h2>Tools</h2><button onclick="agriEngine.addToCart('pH Tester', 2500)" style="padding:10px; background:#1b4332; color:white; border:none; border-radius:5px; width:100%;">Add pH Tester to Cart</button></div>`; 
    },
    renderEasyShop: function(v) { 
        v.innerHTML = `<div style="padding:20px;"><h2 style="color:#f68b1e;">EasyShop</h2><button onclick="agriEngine.addToCart('Maize 90kg', 3800)" style="padding:10px; background:#f68b1e; color:white; border:none; border-radius:5px; width:100%;">Add Maize to Cart</button></div>`; 
    },
    renderAdmin: function(v) { v.innerHTML = `<div style="padding:20px; background:#111; color:white; min-height:100vh;"><h2>Admin Console</h2></div>`; },
    unlockAdmin: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }}
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
