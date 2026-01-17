const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'student',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        orders: JSON.parse(localStorage.getItem('agri_orders') || '[]'),
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="ghost-trigger" style="height:5px; background:#111; cursor:crosshair;" ondblclick="agriEngine.unlockAdmin()"></div>
            <div id="viewport" style="min-height:100vh; padding-bottom:100px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:12px 0; box-shadow:0 -5px 15px rgba(0,0,0,0.1); z-index:9999; border-top:1px solid #eee;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        // COORDINATED ROUTING
        if (this.state.activeTab === 'admin') this.renderAdmin(view);
        else if (this.state.activeTab === 'student') this.renderAcademy(view);
        else if (this.state.activeTab === 'tools') this.renderTools(view);
        else if (this.state.activeTab === 'market') this.renderEasyShop(view);
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [
            { id: 'admin', label: 'Admin', icon: '👤', color: '#000', secure: true },
            { id: 'student', label: 'Academy', icon: '🎓', color: '#2d6a4f', secure: false },
            { id: 'tools', label: 'Tools', icon: '🛠️', color: '#1b4332', secure: false },
            { id: 'market', label: 'EasyShop', icon: '🏪', color: '#f68b1e', secure: false }
        ];
        nav.innerHTML = tabs.map(t => {
            if(t.secure && !this.state.isAdmin) return '';
            const isActive = this.state.activeTab === t.id;
            return `
                <button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; text-align:center; color:${isActive ? t.color : '#bbb'}">
                    <div style="font-size:22px;">${t.icon}</div>
                    <div style="font-size:9px; font-weight:bold; margin-top:2px; text-transform:uppercase;">${t.label}</div>
                </button>
            `;
        }).join('');
    },
    setTab: function(id) {
        this.state.activeTab = id;
        localStorage.setItem('agri_tab', id);
        this.render();
    },
    // --- 1. ADMIN DASHBOARD (FAR WEST) ---
    renderAdmin: function(view) {
        view.innerHTML = `<div style="padding:20px; background:#1a1a1a; color:white; min-height:100vh;">
            <h2>⚡ System Command</h2>
            <div style="background:#333; padding:15px; border-radius:10px; margin-top:20px;">
                <h4>User Registry (${this.state.directory.length})</h4>
                ${this.state.directory.map(u => `<div style="padding:5px; border-bottom:1px solid #444; font-size:12px;">${u.name}</div>`).join('')}
            </div>
            <button onclick="localStorage.removeItem('agri_admin_mode'); location.reload();" style="width:100%; margin-top:20px; padding:12px; background:red; color:white; border:none; border-radius:5px;">LOCK SYSTEM</button>
        </div>`;
    },
    // --- 2. ACADEMY DASHBOARD (CENTRAL WEST) ---
    renderAcademy: function(view) {
        if(!this.state.user) { view.innerHTML = this.getRegHTML(); return; }
        view.innerHTML = `<div style="padding:20px;">
            <div style="background:#2d6a4f; color:white; padding:25px; border-radius:15px; box-shadow:0 10px 20px rgba(45,106,79,0.2);">
                <small>Wallet Balance</small>
                <h1 style="margin:0;">KSh ${this.state.wallet.toLocaleString()}</h1>
            </div>
            <h3 style="margin-top:25px;">Learning Modules</h3>
            <div style="background:white; padding:20px; border-radius:12px; border-left:5px solid #2d6a4f; margin-bottom:15px;">
                <b>Unit 1: Soil Fertility</b><br><small>Next: Nitrogen Fixation</small>
            </div>
            <button onclick="agriEngine.logout()" style="width:100%; padding:10px; border:1px solid #ddd; background:none; border-radius:5px; margin-top:50px;">Sign Out</button>
        </div>`;
    },
    // --- 3. TOOL DASHBOARD (CENTRAL EAST) ---
    renderTools: function(view) {
        const tools = [{n:"pH Meter", p:2500, i:"🧪"}, {n:"Drip Kit", p:12000, i:"💧"}, {n:"Sprayer", p:4500, i:"🚿"}];
        view.innerHTML = `<div style="padding:20px;">
            <h2 style="color:#1b4332;">Hardware Store</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                ${tools.map(t => `<div style="background:white; border-radius:12px; padding:15px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <div style="font-size:40px;">${t.i}</div>
                    <div style="font-weight:bold; margin-top:10px;">${t.n}</div>
                    <div style="color:#2d6a4f; font-weight:bold;">KSh ${t.p.toLocaleString()}</div>
                    <button onclick="agriEngine.buyItem('${t.n}', ${t.p})" style="width:100%; margin-top:10px; background:#1b4332; color:white; border:none; padding:8px; border-radius:5px;">ORDER</button>
                </div>`).join('')}
            </div>
        </div>`;
    },
    // --- 4. EASY SHOP MARKET (FAR EAST) ---
    renderEasyShop: function(view) {
        const products = [{n:"Yellow Maize 90kg", p:3800, i:"🌽"}, {n:"Fertilizer 50kg", p:6500, i:"📦"}, {n:"Poultry Feed", p:2200, i:"🐔"}];
        view.innerHTML = `
            <div style="background:#f4f4f4; min-height:100vh;">
                <div style="background:#fff; padding:15px; border-bottom:2px solid #f68b1e; display:flex; justify-content:space-between; align-items:center;">
                    <b style="color:#f68b1e; font-size:20px;">EasyShop</b>
                    <span style="font-size:12px; color:#666;">Balance: KSh ${this.state.wallet.toLocaleString()}</span>
                </div>
                <div style="padding:15px;">
                    <div style="background:linear-gradient(90deg, #f68b1e, #ff9d2e); color:white; padding:20px; border-radius:8px; margin-bottom:15px;">
                        <h2 style="margin:0;">WEEKLY DEALS</h2>
                        <small>Fresh from the farm to your door</small>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${products.map(p => `
                            <div style="background:white; border-radius:5px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                                <div style="height:100px; background:#fafafa; display:flex; align-items:center; justify-content:center; font-size:40px;">${p.i}</div>
                                <div style="padding:10px;">
                                    <div style="font-size:12px; height:32px;">${p.n}</div>
                                    <div style="font-weight:bold; color:#f68b1e; margin-top:5px;">KSh ${p.p.toLocaleString()}</div>
                                    <button onclick="agriEngine.buyItem('${p.n}', ${p.p}, 'EasyShop')" style="width:100%; background:#f68b1e; color:white; border:none; padding:8px; border-radius:3px; margin-top:5px; font-weight:bold;">ADD TO CART</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    },
    buyItem: function(n, p, source = "Store") {
        if(this.state.wallet >= p) {
            this.state.wallet -= p;
            localStorage.setItem('agri_wallet', this.state.wallet);
            this.state.orders.unshift({item: n, price: p, source: source, date: new Date().toLocaleDateString()});
            localStorage.setItem('agri_orders', JSON.stringify(this.state.orders));
            alert("Successful Purchase: " + n);
            this.render();
        } else { alert("Insufficient Balance!"); }
    },
    unlockAdmin: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }},
    logout: function() { localStorage.removeItem('agri_student'); location.reload(); },
    getRegHTML: function() { return '<div style="padding:50px; text-align:center;"><h2>AgriMastery</h2><input id="rn" placeholder="Enter Name" style="width:100%; padding:12px; border-radius:5px; border:1px solid #ddd;"><button onclick="agriEngine.doReg()" style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:5px; margin-top:10px;">JOIN ACADEMY</button></div>'; },
    doReg: function() { const n = document.getElementById('rn').value; if(n){ localStorage.setItem('agri_student', JSON.stringify({name:n})); this.state.directory.push({name:n}); localStorage.setItem('agri_directory', JSON.stringify(this.state.directory)); location.reload(); }}
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
