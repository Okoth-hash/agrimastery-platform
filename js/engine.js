// 1. DATA CORE (Maintains your Profile & Wallet)
const saved = JSON.parse(localStorage.getItem('agriMasteryData')) || {};
window.agriEngine = {
    state: {
        activeTab: 'market',
        wallet: saved.wallet || 15000,
        isLoggedIn: false,
        isAdminLoggedIn: false,
        userName: "ROBIN",
        registeredUnits: saved.registeredUnits || [],
        inventory: []
    }
};
agriEngine.save = function() {
    localStorage.setItem('agriMasteryData', JSON.stringify({
        wallet: this.state.wallet,
        registeredUnits: this.state.registeredUnits
    }));
};
// 2. GENERATE 110 REAL-LIFE MARKET PRODUCTS
const categories = ['Fertilizers', 'Seeds', 'Tools', 'Irrigation'];
for(let i=1; i<=110; i++) {
    const cat = categories[i % categories.length];
    agriEngine.state.inventory.push({
        id: i, 
        n: `${cat} Premium SKU-${100+i}`, 
        p: 1200 + (i * 45), 
        op: 3500 + (i * 20),
        c: cat,
        i: `https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300`
    });
}
// 3. MARKET RENDERER (Professional UI)
agriEngine.renderMarket = function(v) {
    v.innerHTML = `
        <div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0; z-index:100; box-shadow:0 2px 10px rgba(0,0,0,0.1); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:bold; letter-spacing:1px;">AGRI-SHOP</div>
            <div style="background:rgba(255,255,255,0.2); padding:5px 12px; border-radius:15px; font-size:12px;">Wallet: KSh ${this.state.wallet.toLocaleString()}</div>
        </div>
        <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#f1f1f2; padding-bottom:100px;">
            ${this.state.inventory.map(item => `
                <div style="background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); position:relative;">
                    <div style="position:absolute; top:5px; left:5px; background:#065f46; color:white; font-size:8px; padding:3px 6px; border-radius:3px; font-weight:bold;">${item.c}</div>
                    <img src="${item.i}" style="width:100%; height:110px; object-fit:cover;">
                    <div style="padding:10px;">
                        <div style="font-size:12px; color:#333; height:32px; overflow:hidden; line-height:1.3; margin-bottom:5px;">${item.n}</div>
                        <div style="font-weight:bold; color:#f68b1e; font-size:15px;">KSh ${item.p.toLocaleString()}</div>
                        <div style="font-size:11px; color:#999; text-decoration:line-through;">KSh ${item.op.toLocaleString()}</div>
                    </div>
                    <button onclick="if(agriEngine.state.wallet >= ${item.p}){ agriEngine.state.wallet -= ${item.p}; agriEngine.save(); agriEngine.render(); alert('Purchase Successful!'); } else { alert('Insufficient Funds!'); }" 
                        style="width:100%; background:#f68b1e; color:white; border:none; padding:12px; font-weight:bold; font-size:11px; cursor:pointer;">
                        BUY NOW
                    </button>
                </div>
            `).join('')}
        </div>
    `;
};
// 4. MASTER RENDERER (Restores Admin & Academy)
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(!v || !n) return;
    if(this.state.activeTab === 'market') this.renderMarket(v);
    else if(this.state.activeTab === 'admin') {
        v.innerHTML = `<div style="padding:40px; background:#0f172a; height:100vh; color:white;">
            <h2 style="color:#38bdf8;">SECURE ADMIN</h2>
            <p>Admin: ${this.state.userName}</p>
            <button onclick="agriEngine.state.wallet+=50000; agriEngine.save(); agriEngine.render();" style="width:100%; padding:15px; background:#4ade80; border:none; border-radius:10px; font-weight:bold;">ADD KSh 50,000</button>
        </div>`;
    }
    else if(this.state.activeTab === 'academy') {
        v.innerHTML = `<div style="padding:20px; background:#f8fafc; height:100vh;">
            <div style="display:flex; align-items:center; background:white; padding:15px; border-radius:15px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <img src="https://cdn-icons-png.flaticon.com/128/201/201614.png" style="width:50px;">
                <div style="margin-left:15px;"><h4 style="margin:0;">${this.state.userName}</h4><p style="margin:0; font-size:11px; color:green;">Active Student</p></div>
            </div>
            <h3 style="margin-top:20px;">Course Progress</h3>
            <p style="color:#666; font-size:13px;">Units Registered: ${this.state.registeredUnits.length}</p>
        </div>`;
    }
    else {
        v.innerHTML = `<div style="padding:20px;"><h2>20 AGRICULTURE TOOLS ACTIVE</h2></div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">${t.l}</div>`).join('');
};
// Start System
setTimeout(() => agriEngine.render(), 100);
