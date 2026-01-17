const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'student',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        listings: JSON.parse(localStorage.getItem('agri_listings') || '[]'),
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        orders: JSON.parse(localStorage.getItem('agri_orders') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="ghost-trigger" style="height:5px; background:#111; cursor:crosshair;" ondblclick="agriEngine.unlockAdmin()"></div>
            <div id="viewport" style="min-height:100vh; padding-bottom:100px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:10px 0; box-shadow:0 -5px 15px rgba(0,0,0,0.1); z-index:9999; border-top:1px solid #eee;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        // DASHBOARD ROUTING
        if (this.state.activeTab === 'admin') this.renderAdminDashboard(view);
        else if (this.state.activeTab === 'tools') this.renderToolDashboard(view);
        else if (this.state.activeTab === 'market') this.renderMarketDashboard(view);
        else this.renderStudentDashboard(view);
    },
    // --- COORDINATED EAST-WEST NAVIGATION ---
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        // Defined Sequence: Admin -> Academy (student) -> Tools -> Market
        const tabs = [
            { id: 'admin', label: 'Admin', icon: '👤', secure: true },
            { id: 'student', label: 'Academy', icon: '🎓', secure: false },
            { id: 'tools', label: 'Tools', icon: '🛠️', secure: false },
            { id: 'market', label: 'Market', icon: '📈', secure: false }
        ];
        nav.innerHTML = tabs.map(t => {
            // Only show Admin tab if admin mode is unlocked
            if(t.secure && !this.state.isAdmin) return '';
            return `
                <button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; text-align:center; transition:0.3s; cursor:pointer; color:${this.state.activeTab === t.id ? '#2d6a4f' : '#bbb'}">
                    <div style="font-size:22px; margin-bottom:4px;">${t.icon}</div>
                    <div style="font-size:10px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">${t.label}</div>
                    ${this.state.activeTab === t.id ? '<div style="width:20px; height:3px; background:#2d6a4f; margin:4px auto 0; border-radius:10px;"></div>' : ''}
                </button>
            `;
        }).join('');
    },
    setTab: function(id) {
        this.state.activeTab = id;
        localStorage.setItem('agri_tab', id);
        this.render();
    },
    // --- 1. ADMIN DASHBOARD (WEST) ---
    renderAdminDashboard: function(view) {
        view.innerHTML = `
            <div style="padding:20px; background:#1a1a1a; color:white; min-height:100vh;">
                <h2 style="color:#40916c;">⚡ System Control</h2>
                <div style="background:#2d2d2d; padding:15px; border-radius:12px; margin-top:20px;">
                    <h4>Student Registry</h4>
                    ${this.state.directory.map(s => `<div style="font-size:12px; padding:8px 0; border-bottom:1px solid #3d3d3d;">${s.name}</div>`).join('')}
                </div>
                <button onclick="localStorage.removeItem('agri_admin_mode'); location.reload();" style="margin-top:30px; width:100%; padding:12px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold;">LOCK ADMIN ACCESS</button>
            </div>
        `;
    },
    // --- 2. ACADEMY DASHBOARD (CENTRAL-WEST) ---
    renderStudentDashboard: function(view) {
        if(!this.state.user) { view.innerHTML = this.getRegHTML(); return; }
        view.innerHTML = `
            <div style="padding:20px;">
                <div style="background:#fff; padding:20px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05); margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div><small style="color:#888;">AgriWallet Balance</small><h2 style="margin:0; color:#2d6a4f;">KSh ${this.state.wallet.toLocaleString()}</h2></div>
                        <button onclick="agriEngine.topUp()" style="background:#2d6a4f; color:white; border:none; padding:8px 12px; border-radius:20px; font-size:12px; cursor:pointer;">+ TOP UP</button>
                    </div>
                </div>
                <h3>Welcome back, ${this.state.user.name}</h3>
                <div style="background:#d8f3dc; padding:15px; border-radius:10px; border-left:5px solid #2d6a4f;">
                    <b>Unit Progress:</b> 45% Complete
                </div>
            </div>
        `;
    },
    // --- 3. TOOL DASHBOARD (CENTRAL-EAST) ---
    renderToolDashboard: function(view) {
        const tools = [{n:"Soil pH Tester", p:2500, i:"🧪"}, {n:"Irrigation Kit", p:12000, i:"💧"}, {n:"Grain Dryer", p:45000, i:"☀️"}];
        view.innerHTML = `
            <div style="padding:20px;">
                <h2 style="color:#2d6a4f; margin-bottom:20px;">AgriTools Store</h2>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    ${tools.map(t => `
                        <div style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                            <div style="height:110px; background:#f8f9fa; display:flex; align-items:center; justify-content:center; font-size:45px;">${t.i}</div>
                            <div style="padding:12px;">
                                <div style="font-weight:bold; font-size:13px;">${t.n}</div>
                                <div style="color:#e67e22; font-weight:bold; margin:6px 0;">KSh ${t.p.toLocaleString()}</div>
                                <button onclick="agriEngine.buyTool('${t.n}', ${t.p})" style="width:100%; background:#2d6a4f; color:white; border:none; padding:10px; border-radius:6px; cursor:pointer; font-weight:bold;">BUY</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    // --- 4. MARKET DASHBOARD (EAST) ---
    renderMarketDashboard: function(view) {
        view.innerHTML = `
            <div style="padding:20px;">
                <h2 style="color:#2d6a4f;">Market & Trade</h2>
                <div style="background:white; padding:15px; border-radius:12px; margin-top:15px;">
                    <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #eee;"><span>Maize (Eldoret)</span><b>KSh 3,800</b></div>
                    <div style="display:flex; justify-content:space-between; padding:12px 0;"><span>Beans (Nairobi)</span><b>KSh 9,200</b></div>
                </div>
            </div>
        `;
    },
    // LOGIC HELPERS
    topUp: function() { 
        this.state.wallet += 10000; 
        localStorage.setItem('agri_wallet', this.state.wallet); 
        this.render(); 
    },
    buyTool: function(n, p) {
        if(this.state.wallet >= p) {
            this.state.wallet -= p;
            localStorage.setItem('agri_wallet', this.state.wallet);
            alert("Ordered: " + n);
            this.render();
        } else { alert("Insufficient Funds"); }
    },
    unlockAdmin: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }},
    getRegHTML: function() { return '<div style="padding:50px; text-align:center;"><h2>AgriMastery Login</h2><input id="rn" placeholder="Your Name" style="width:100%; padding:12px; border-radius:8px; border:1px solid #ddd;"><button onclick="agriEngine.doReg()" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:8px; margin-top:10px;">ENTER ACADEMY</button></div>'; },
    doReg: function() { const n = document.getElementById('rn').value; if(n){ localStorage.setItem('agri_student', JSON.stringify({name:n})); this.render(); }}
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
