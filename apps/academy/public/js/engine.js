const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        activeTab: localStorage.getItem('agri_tab') || 'student',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        cart: JSON.parse(localStorage.getItem('agri_cart') || '[]'),
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="global-header" style="position:fixed; top:0; width:100%; height:50px; background:white; display:flex; justify-content:space-between; align-items:center; padding:0 15px; box-shadow:0 2px 10px rgba(0,0,0,0.05); z-index:10000; box-sizing:border-box;">
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
        // Admin is now ALWAYS visible (secure: false)
        const tabs = [
            { id: 'admin', label: 'Admin', icon: '👤' },
            { id: 'student', label: 'Academy', icon: '🎓' },
            { id: 'tools', label: 'Tools', icon: '🛠️' },
            { id: 'market', label: 'EasyShop', icon: '🏪' }
        ];
        nav.innerHTML = tabs.map(t => {
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
    renderAdmin: function(v) { 
        v.innerHTML = `<div style="padding:20px; background:#111; color:white; min-height:100vh;">
            <h2>⚡ Admin Command</h2>
            <div style="background:#222; padding:15px; border-radius:10px; border:1px solid #333;">
                <p>System Status: Online</p>
                <p>Total Users: ${this.state.directory.length}</p>
            </div>
        </div>`; 
    },
    renderAcademy: function(v) { v.innerHTML = `<div style="padding:20px;"><h3>Academy Dashboard</h3></div>`; },
    renderTools: function(v) { v.innerHTML = `<div style="padding:20px;"><h3>Tools Dashboard</h3></div>`; },
    renderEasyShop: function(v) { v.innerHTML = `<div style="padding:20px;"><h3>EasyShop Market</h3></div>`; },
    toggleCart: function() { /* Cart logic remains the same as previous version */ },
    addToCart: function() { /* Cart logic remains the same */ }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
