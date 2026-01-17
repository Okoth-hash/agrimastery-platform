const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'student',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        listings: JSON.parse(localStorage.getItem('agri_listings') || '[]'),
        // NEW: Wallet and Order State
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        orders: JSON.parse(localStorage.getItem('agri_orders') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="ghost-trigger" style="height:8px; background:#111; cursor:pointer;" ondblclick="agriEngine.unlockAdmin()"></div>
            <div id="viewport" style="min-height:100vh; padding-bottom:80px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; padding:15px; box-shadow:0 -2px 15px rgba(0,0,0,0.1); z-index:9999;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'admin' && this.state.isAdmin) this.renderAdminDashboard(view);
        else if (this.state.activeTab === 'tools') this.renderToolDashboard(view);
        else if (this.state.activeTab === 'market') this.renderMarketDashboard(view);
        else this.renderStudentDashboard(view);
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [
            { id: 'student', label: 'Academy', icon: '🎓' },
            { id: 'tools', label: 'Tools', icon: '🛒' },
            { id: 'market', label: 'Market', icon: '📉' }
        ];
        if(this.state.isAdmin) tabs.push({ id: 'admin', label: 'Admin', icon: '⚡' });
        nav.innerHTML = tabs.map(t => `
            <button onclick="agriEngine.setTab('${t.id}')" style="border:none; background:none; text-align:center; color:${this.state.activeTab === t.id ? '#2d6a4f' : '#999'}">
                <div style="font-size:20px;">${t.icon}</div>
                <div style="font-size:10px; font-weight:bold;">${t.label}</div>
            </button>
        `).join('');
    },
    setTab: function(id) {
        this.state.activeTab = id;
        localStorage.setItem('agri_tab', id);
        this.render();
    },
    // --- STUDENT DASHBOARD WITH WALLET ---
    renderStudentDashboard: function(view) {
        if(!this.state.user) { view.innerHTML = this.getRegHTML(); return; }
        view.innerHTML = `
            <div style="padding:20px;">
                <div style="background:linear-gradient(to right, #2d6a4f, #1b4332); color:white; padding:25px; border-radius:15px; margin-bottom:15px;">
                    <small>Available Balance</small>
                    <h1 style="margin:0;">KSh ${this.state.wallet.toLocaleString()}</h1>
                    <p style="margin:5px 0 0 0; opacity:0.8;">Student: ${this.state.user.name}</p>
                </div>
                <h3>Active Orders</h3>
                ${this.state.orders.length === 0 ? '<p style="color:#999;">No recent purchases.</p>' : 
                this.state.orders.map(o => `
                    <div style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border-left:4px solid #e67e22;">
                        <div><b>${o.item}</b><br><small style="color:#666;">Status: ${o.status}</small></div>
                        <div style="font-weight:bold; color:#2d6a4f;">- ${o.price}</div>
                    </div>
                `).join('')}
                <button onclick="agriEngine.logout()" style="margin-top:20px; padding:10px; width:100%; border-radius:5px; border:1px solid #ddd; background:white; cursor:pointer;">Sign Out</button>
            </div>
        `;
    },
    // --- TOOL DASHBOARD WITH PURCHASE LOGIC ---
    renderToolDashboard: function(view) {
        const tools = [
            { id:1, n:"Soil pH Tester", p:2500, i:"🧪" },
            { id:2, n:"Drip Irrigation Kit", p:12000, i:"💧" },
            { id:3, n:"Solar Grain Dryer", p:45000, i:"☀️" }
        ];
        view.innerHTML = `
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h2 style="color:#2d6a4f;">AgriTools Store</h2>
                    <b style="color:#e67e22;">KSh ${this.state.wallet.toLocaleString()}</b>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:15px;">
                    ${tools.map(t => `
                        <div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                            <div style="height:100px; background:#f8f9fa; display:flex; align-items:center; justify-content:center; font-size:40px;">${t.i}</div>
                            <div style="padding:10px;">
                                <div style="font-weight:bold; font-size:13px;">${t.n}</div>
                                <div style="color:#e67e22; font-weight:bold; margin:5px 0;">KSh ${t.p.toLocaleString()}</div>
                                <button onclick="agriEngine.buyTool('${t.n}', ${t.p})" style="width:100%; background:#2d6a4f; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; font-size:11px;">BUY NOW</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    buyTool: function(name, price) {
        if(this.state.wallet >= price) {
            this.state.wallet -= price;
            const newOrder = { item: name, price: price, status: 'Processing', date: new Date().toLocaleDateString() };
            this.state.orders.unshift(newOrder);
            localStorage.setItem('agri_wallet', this.state.wallet);
            localStorage.setItem('agri_orders', JSON.stringify(this.state.orders));
            alert(`Purchase Successful: ${name}`);
            this.render();
        } else {
            alert("Insufficient funds in your AgriWallet.");
        }
    },
    renderMarketDashboard: function(view) {
        view.innerHTML = `<div style="padding:20px;"><h2>Market Dashboard</h2><p>Real-time trading active.</p></div>`;
    },
    renderAdminDashboard: function(view) {
        view.innerHTML = `<div style="padding:20px; background:#111; color:white;"><h2>Admin Command</h2><p>Student Directory & Security Active.</p></div>`;
    },
    unlockAdmin: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }},
    logout: function() { localStorage.removeItem('agri_student'); location.reload(); },
    getRegHTML: function() { return '<div style="padding:50px; text-align:center;"><input id="rn" placeholder="Enter Full Name" style="width:100%; padding:10px;"><button onclick="agriEngine.doReg()" style="width:100%; padding:10px; background:#2d6a4f; color:white; border:none; margin-top:10px; cursor:pointer;">REGISTER</button></div>'; },
    doReg: function() { const n = document.getElementById('rn').value; if(n){ localStorage.setItem('agri_student', JSON.stringify({name:n})); this.render(); }}
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
