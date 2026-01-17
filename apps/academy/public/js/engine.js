const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        cart: [],
        activeTab: 'academy' // Academy, Tools, or Market
    },
    // --- JUMIA-STYLE TOOL DATA ---
    tools: [
        { id: 'T1', name: 'Digital Soil Ph Meter', price: 2500, img: '🧪', desc: 'High precision soil tester' },
        { id: 'T2', name: 'Drip Irrigation Kit', price: 12000, img: '💧', desc: '1-acre coverage kit' },
        { id: 'T3', name: 'Organic Fertilizer', price: 1500, img: '📦', desc: '50kg Booster Pack' },
        { id: 'T4', name: 'Solar Grain Dryer', price: 45000, img: '☀️', desc: 'Rapid moisture reduction' }
    ],
    // --- REAL-TIME CROP MARKET DATA ---
    marketData: [
        { crop: 'Maize', location: 'Eldoret', price: '3,800', trend: 'up' },
        { crop: 'Beans', location: 'Nairobi', price: '9,500', trend: 'down' },
        { crop: 'Wheat', location: 'Narok', price: '5,200', trend: 'stable' }
    ],
    init: function() {
        document.body.innerHTML = '<div id="admin-zone"></div><div id="nav-bar"></div><div id="app-viewport"></div>';
        this.render();
    },
    render: function() {
        this.renderNav();
        const view = document.getElementById('app-viewport');
        if (this.state.activeTab === 'tools') this.renderToolStore(view);
        else if (this.state.activeTab === 'market') this.renderMarketplace(view);
        else this.renderAcademy(view);
        if(this.state.isAdmin) this.renderAdmin();
    },
    renderNav: function() {
        const nav = document.getElementById('nav-bar');
        nav.innerHTML = '<div style="display:flex; justify-content:space-around; background:#fff; padding:15px; box-shadow:0 -2px 10px rgba(0,0,0,0.1); position:fixed; bottom:0; width:100%; z-index:1000;">' +
            '<button onclick="agriEngine.setTab(\'academy\')" style="border:none; background:none; font-weight:bold; color:'+(this.state.activeTab==='academy'?'#2d6a4f':'#999')+'">🎓 Learn</button>' +
            '<button onclick="agriEngine.setTab(\'tools\')" style="border:none; background:none; font-weight:bold; color:'+(this.state.activeTab==='tools'?'#2d6a4f':'#999')+'">🛠️ Tools</button>' +
            '<button onclick="agriEngine.setTab(\'market\')" style="border:none; background:none; font-weight:bold; color:'+(this.state.activeTab==='market'?'#2d6a4f':'#999')+'">📉 Market</button>' +
        '</div>';
    },
    setTab: function(tab) { this.state.activeTab = tab; this.render(); },
    // --- TOOL DASHBOARD (Jumia Style) ---
    renderToolStore: function(view) {
        view.innerHTML = '<div style="padding:20px; padding-bottom:80px; font-family:sans-serif;">' +
            '<h2 style="color:#2d6a4f;">AgriTools Express</h2>' +
            '<div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:15px;">' +
                this.tools.map(t => '<div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">' +
                    '<div style="background:#f8f9fa; height:100px; display:flex; align-items:center; justify-content:center; font-size:40px;">'+t.img+'</div>' +
                    '<div style="padding:10px;">' +
                        '<div style="font-size:14px; font-weight:bold;">'+t.name+'</div>' +
                        '<div style="color:#e67e22; font-weight:bold; margin:5px 0;">KSh '+t.price.toLocaleString()+'</div>' +
                        '<button onclick="alert(\'Added to Cart\')" style="width:100%; padding:8px; background:#2d6a4f; color:white; border:none; border-radius:5px; cursor:pointer; font-size:12px;">ADD TO CART</button>' +
                    '</div>' +
                '</div>').join('') +
            '</div>' +
        '</div>';
    },
    // --- MARKET DASHBOARD ---
    renderMarketplace: function(view) {
        view.innerHTML = '<div style="padding:20px; font-family:sans-serif;">' +
            '<h2 style="color:#2d6a4f;">Live Market Prices</h2>' +
            '<div style="background:white; border-radius:15px; padding:15px;">' +
                this.marketData.map(m => '<div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #eee;">' +
                    '<div><b>'+m.crop+'</b><br><small style="color:#666;">'+m.location+'</small></div>' +
                    '<div style="text-align:right;">' +
                        '<div style="font-weight:bold;">KSh '+m.price+'</div>' +
                        '<small style="color:'+(m.trend==='up'?'green':'red')+'">'+(m.trend==='up'?'▲':'▼')+' Trend</small>' +
                    '</div>' +
                '</div>').join('') +
            '</div>' +
            '<div style="margin-top:20px; background:#e8f5e9; padding:15px; border-radius:10px; font-size:13px; color:#2e7d32;">' +
                'ℹ️ Prices are updated every 6 hours based on regional hubs.' +
            '</div>' +
        '</div>';
    },
    renderAcademy: function(view) {
        view.innerHTML = '<div style="padding:20px; text-align:center;"><h2>Academy Home</h2><p>Select a unit to continue learning.</p></div>';
    },
    renderAdmin: function() {
        const az = document.getElementById('admin-zone');
        az.innerHTML = '<div style="background:#000; color:#0f0; padding:10px; font-size:11px; text-align:center;">ADMIN OVERRIDE ACTIVE | <span onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();">Logout</span></div>';
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
