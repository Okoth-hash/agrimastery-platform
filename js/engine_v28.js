// 1. DATA PERSISTENCE (Safe Load)
const saved = JSON.parse(localStorage.getItem('agriMasteryData')) || {};
agriEngine.state = agriEngine.state || {
    activeTab: 'admin',
    wallet: saved.wallet || 15000,
    isLoggedIn: false,
    registeredUnits: saved.registeredUnits || [],
    inventory: []
};
// 2. DATA PROTECTION (Save Function)
agriEngine.save = function() {
    localStorage.setItem('agriMasteryData', JSON.stringify({
        wallet: this.state.wallet,
        registeredUnits: this.state.registeredUnits
    }));
};
// 3. RESTORE MARKET DATA
if(agriEngine.state.inventory.length === 0) {
    for(let i=1; i<=110; i++) {
        agriEngine.state.inventory.push({
            id: i, n: "Agri-Master Pro SKU-" + i, p: 1250 + (i * 25), op: 2800,
            i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
        });
    }
}
// 4. NEW ADMIN RENDERER (Enhanced)
agriEngine.renderAdmin = (v) => {
    v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 style="color:#38bdf8; margin:0;">SYSTEM ADMIN</h2>
            <div style="background:#10b981; padding:5px 10px; border-radius:20px; font-size:10px; font-weight:bold;">DATA LOCKED ??</div>
        </div>
        <div style="background:#1e293b; padding:20px; border-radius:15px; border:1px solid #334155; margin-bottom:15px;">
            <p style="font-size:12px; color:#94a3b8; margin:0;">WALLET BALANCE</p>
            <h2 style="margin:5px 0; color:#4ade80;">KSh ${agriEngine.state.wallet.toLocaleString()}</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:15px;">
                <button onclick="agriEngine.state.wallet+=5000; agriEngine.save(); agriEngine.render();" style="background:#334155; color:white; border:none; padding:10px; border-radius:5px; font-size:11px; cursor:pointer;">+5K</button>
                <button onclick="agriEngine.state.wallet+=10000; agriEngine.save(); agriEngine.render();" style="background:#334155; color:white; border:none; padding:10px; border-radius:5px; font-size:11px; cursor:pointer;">+10K</button>
                <button onclick="agriEngine.state.wallet+=50000; agriEngine.save(); agriEngine.render();" style="background:#38bdf8; color:#0f172a; border:none; padding:10px; border-radius:5px; font-weight:bold; font-size:11px; cursor:pointer;">+50K</button>
            </div>
        </div>
        <div style="background:#1e293b; padding:20px; border-radius:15px; border:1px solid #334155;">
            <h4 style="margin:0 0 15px; color:#38bdf8;">STUDENT PROGRESS</h4>
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:10px;">
                <span>Registered Units:</span>
                <span style="color:#4ade80; font-weight:bold;">${agriEngine.state.registeredUnits.length}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:10px;">
                <span>Market Inventory:</span>
                <span style="color:#4ade80; font-weight:bold;">110 Items</span>
            </div>
            <button onclick="if(confirm('Wipe all local data?')){localStorage.clear(); location.reload();}" style="width:100%; background:none; border:1px solid #ef4444; color:#ef4444; padding:10px; border-radius:5px; margin-top:10px; font-size:11px; cursor:pointer;">SYSTEM RESET</button>
        </div>
    </div>`;
};
// 5. MASTER RENDERER SYNC
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') this.renderAdmin(v);
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h3>TOOLS</h3><p>20 Agri-Calculators Loaded</p></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; color:white; padding:15px; font-weight:bold;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">${t.l}</div>`).join('');
};
agriEngine.render();
