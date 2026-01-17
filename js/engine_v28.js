// 1. DATA PROTECTION LAYER
agriEngine.state = agriEngine.state || {
    activeTab: 'academy',
    wallet: 15000,
    isLoggedIn: false,
    selectedCourse: null,
    registeredUnits: [],
    userName: "OMONDI ROBIN",
    inventory: []
};
// 2. MARKET DATA PRESERVATION
if(agriEngine.state.inventory.length === 0) {
    for(let i=1; i<=110; i++) {
        agriEngine.state.inventory.push({
            id: i, n: "Agri-Master SKU-" + i, p: 1250 + (i * 25), op: 2800,
            i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
        });
    }
}
// 3. ACADEMY RENDERER (With Student Image)
agriEngine.renderAcademy = (v) => {
    if (!agriEngine.state.isLoggedIn) {
        v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#f8fafc; min-height:100vh;">
            <div style="background:white; padding:30px; border-radius:25px; box-shadow:0 15px 35px rgba(0,0,0,0.1);">
                <img src="https://cdn-icons-png.flaticon.com/128/3443/3443421.png" style="width:100px; height:100px; margin-bottom:15px;">
                <h2 style="color:#065f46; margin:0;">Student Portal</h2>
                <p style="color:#64748b; font-size:14px; margin-bottom:25px;">Enter PIN to access courses</p>
                <input type="password" id="p" placeholder="••••" style="width:100px; padding:15px; border-radius:10px; border:2px solid #e2e8f0; margin-bottom:20px; text-align:center; font-size:24px;">
                <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.state.isLoggedIn=true; agriEngine.render();}else{alert('Access Denied')}" style="width:100%; background:#065f46; color:white; border:none; padding:18px; border-radius:12px; font-weight:bold; cursor:pointer;">SIGN IN</button>
            </div>
        </div>`;
    } else {
        v.innerHTML = `<div style="padding:20px; background:#f1f5f9; min-height:100vh;">
            <div style="background:white; padding:20px; border-radius:20px; display:flex; align-items:center; margin-bottom:20px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <img src="https://cdn-icons-png.flaticon.com/128/201/201614.png" style="width:60px; height:60px; border-radius:50%; border:3px solid #065f46; padding:3px; background:#e8f5e9;">
                <div style="margin-left:15px;">
                    <h4 style="margin:0; color:#1e293b;">${agriEngine.state.userName}</h4>
                    <p style="margin:0; font-size:12px; color:#065f46; font-weight:bold;">Student ID: AM-2026</p>
                </div>
            </div>
            <h3 style="color:#334155;">Available Courses</h3>
            <div onclick="agriEngine.state.selectedCourse='1'; agriEngine.render();" style="background:white; padding:20px; border-radius:15px; margin-bottom:10px; border-left:6px solid #f68b1e; cursor:pointer;">
                <h4 style="margin:0;">Modern Agribusiness</h4>
                <p style="margin:5px 0 0; font-size:12px; color:#64748b;">3 Core Units Available</p>
            </div>
            <div onclick="alert('Unit enrollment active')" style="background:white; padding:20px; border-radius:15px; margin-bottom:10px; border-left:6px solid #065f46; opacity:0.7;">
                <h4 style="margin:0;">Soil Science Diploma</h4>
                <p style="margin:5px 0 0; font-size:12px; color:#64748b;">Register to unlock</p>
            </div>
        </div>`;
    }
};
// 4. MAIN DASHBOARD CONTROLLER
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') {
        v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;"><h2>ADMIN</h2><p>Wallet: KSh ${this.state.wallet.toLocaleString()}</p><button onclick="agriEngine.state.wallet+=10000; agriEngine.render();" style="padding:15px; background:#38bdf8; width:100%; border:none; border-radius:10px; font-weight:bold;">GIFT 10K</button></div>`;
    } 
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h3>20 TOOLS ACTIVE</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">${['Soil','Irrigation','Rain','Pests'].map(t=>`<div style="background:white; padding:20px; border-radius:10px; text-align:center; border-bottom:3px solid #065f46;">${t}</div>`).join('')}</div></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; padding:15px; color:white; font-weight:bold;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div><div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">${this.state.inventory.slice(0,10).map(i=>`<div style="background:white; padding:10px; border-radius:5px;"><img src="${i.i}" style="width:100%; height:80px; object-fit:cover;"><div style="font-size:11px; margin-top:5px;">${i.n}</div><div style="font-weight:bold; color:#f68b1e;">KSh ${i.p}</div></div>`).join('')}</div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">${t.l}</div>`).join('');
};
agriEngine.render();
