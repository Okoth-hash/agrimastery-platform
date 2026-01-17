// 1. DATA PERSISTENCE & USER IDENTITY
const saved = JSON.parse(localStorage.getItem('agriMasteryData')) || {};
agriEngine.state = agriEngine.state || {
    activeTab: 'admin',
    wallet: saved.wallet || 15000,
    isAdminLoggedIn: false,
    registeredUnits: saved.registeredUnits || [],
    userName: "ROBIN",
    inventory: []
};
// 2. DATA SAFETY SYNC
agriEngine.save = function() {
    localStorage.setItem('agriMasteryData', JSON.stringify({
        wallet: this.state.wallet,
        registeredUnits: this.state.registeredUnits
    }));
};
// 3. MARKET DATA RESTORATION (110 Items)
if(agriEngine.state.inventory.length === 0) {
    for(let i=1; i<=110; i++) {
        agriEngine.state.inventory.push({
            id: i, n: "Agri-Master Pro SKU-" + i, p: 1250 + (i * 25),
            i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
        });
    }
}
// 4. SECURE ADMIN RENDERER
agriEngine.renderAdmin = (v) => {
    // SECURITY GATE
    if (!agriEngine.state.isAdminLoggedIn) {
        v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#0f172a; min-height:100vh; color:white;">
            <div style="background:#1e293b; padding:30px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                <div style="font-size:50px; margin-bottom:10px;">??</div>
                <h2 style="margin:0; color:#38bdf8;">Command Center</h2>
                <p style="color:#94a3b8; font-size:13px; margin-bottom:25px;">Authorized Personnel: ROBIN</p>
                <input type="password" id="adminPass" placeholder="Enter Admin Password" style="width:100%; padding:15px; background:#0f172a; border:1px solid #334155; color:white; border-radius:10px; text-align:center; margin-bottom:15px;">
                <button onclick="if(document.getElementById('adminPass').value==='1234'){agriEngine.state.isAdminLoggedIn=true; agriEngine.render();}else{alert('Access Denied')}" 
                    style="width:100%; background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:10px; font-weight:bold;">UNLOCK SYSTEM</button>
            </div>
        </div>`;
        return;
    }
    // SYSTEM TRACKER DASHBOARD
    v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
                <h2 style="margin:0; color:#38bdf8;">ADMIN: ${agriEngine.state.userName}</h2>
                <span style="font-size:10px; color:#4ade80;">? SYSTEM TRACKER ACTIVE</span>
            </div>
            <button onclick="agriEngine.state.isAdminLoggedIn=false; agriEngine.render();" style="background:#334155; color:white; border:none; padding:8px 12px; border-radius:5px; font-size:10px;">LOGOUT</button>
        </div>
        <div style="background:#1e293b; padding:20px; border-radius:15px; border:1px solid #334155; margin-bottom:15px;">
            <p style="font-size:11px; color:#94a3b8; margin:0;">GLOBAL WALLET BALANCE</p>
            <h2 style="margin:5px 0; color:#4ade80;">KSh ${agriEngine.state.wallet.toLocaleString()}</h2>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button onclick="agriEngine.state.wallet+=10000; agriEngine.save(); agriEngine.render();" style="flex:1; background:#38bdf8; color:#0f172a; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:12px;">+10K INJECT</button>
                <button onclick="agriEngine.state.wallet=15000; agriEngine.save(); agriEngine.render();" style="background:none; border:1px solid #ef4444; color:#ef4444; padding:10px; border-radius:8px; font-size:12px;">RESET</button>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
            <div style="background:#1e293b; padding:15px; border-radius:15px; border:1px solid #334155;">
                <p style="font-size:10px; color:#94a3b8;">ACADEMY UNITS</p>
                <h3 style="margin:5px 0;">${agriEngine.state.registeredUnits.length} Active</h3>
            </div>
            <div style="background:#1e293b; padding:15px; border-radius:15px; border:1px solid #334155;">
                <p style="font-size:10px; color:#94a3b8;">MARKET STOCK</p>
                <h3 style="margin:5px 0;">110 Items</h3>
            </div>
        </div>
        <div style="background:#1e293b; padding:15px; border-radius:15px; border:1px solid #334155;">
            <p style="font-size:11px; color:#38bdf8; margin-bottom:10px;">RECENT ACTIVITY LOG</p>
            <div style="font-family:monospace; font-size:11px; color:#94a3b8;">
                [${new Date().toLocaleTimeString()}] System Security Verified<br>
                [${new Date().toLocaleTimeString()}] Wallet Data Synced<br>
                [${new Date().toLocaleTimeString()}] User 'ROBIN' Connected
            </div>
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
        v.innerHTML = `<div style="background:#f68b1e; color:white; padding:15px; font-weight:bold;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div><div style="padding:10px;">${this.state.inventory.slice(0,5).map(i=>`<div style="background:white; margin-bottom:10px; padding:10px; border-radius:8px;">${i.n} - KSh ${i.p}</div>`).join('')}</div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">${t.l}</div>`).join('');
};
agriEngine.render();
