// 1. DATA PERSISTENCE & USER IDENTITY
const saved = JSON.parse(localStorage.getItem('agriMasteryData')) || {};
agriEngine.state = {
    activeTab: 'academy',
    wallet: saved.wallet || 15000,
    isLoggedIn: false,
    isAdminLoggedIn: false,
    userName: "ROBIN",
    selectedCourse: null,
    registeredUnits: saved.registeredUnits || [],
    inClassroom: false,
    currentUnit: null,
    inventory: []
};
agriEngine.save = function() {
    localStorage.setItem('agriMasteryData', JSON.stringify({
        wallet: this.state.wallet,
        registeredUnits: this.state.registeredUnits
    }));
};
// 2. MARKET DATA RESTORATION
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i, n: "Agri-Master Pro SKU-" + i, p: 1250 + (i * 25), op: 2800,
        i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
    });
}
// 3. ACADEMY RENDERER (Professional Portal)
agriEngine.renderAcademy = (v) => {
    // A. LOGIN SCREEN
    if (!agriEngine.state.isLoggedIn) {
        v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#f8fafc; min-height:100vh;">
            <div style="background:white; padding:30px; border-radius:25px; box-shadow:0 15px 35px rgba(0,0,0,0.1);">
                <img src="https://cdn-icons-png.flaticon.com/128/3443/3443421.png" style="width:80px; margin-bottom:15px;">
                <h2 style="color:#065f46; margin:0;">Student Portal</h2>
                <p style="color:#64748b; font-size:12px; margin-bottom:20px;">Welcome back, ROBIN</p>
                <input type="password" id="p" placeholder="PIN" style="width:80px; padding:15px; border:2px solid #ddd; border-radius:10px; text-align:center; font-size:20px;">
                <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.state.isLoggedIn=true; agriEngine.render();}else{alert('Wrong PIN')}" 
                    style="width:100%; background:#065f46; color:white; border:none; padding:18px; border-radius:12px; font-weight:bold; margin-top:20px; cursor:pointer;">SIGN IN</button>
            </div>
        </div>`;
        return;
    }
    // B. MAIN DASHBOARD (Profile & Courses)
    v.innerHTML = `<div style="padding:20px; background:#f1f5f9; min-height:100vh;">
        <div style="background:white; padding:20px; border-radius:20px; display:flex; align-items:center; margin-bottom:20px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            <img src="https://cdn-icons-png.flaticon.com/128/201/201614.png" style="width:60px; height:60px; border-radius:50%; border:3px solid #065f46; padding:3px;">
            <div style="margin-left:15px;">
                <h4 style="margin:0; color:#1e293b; text-transform:uppercase;">${agriEngine.state.userName}</h4>
                <p style="margin:0; font-size:12px; color:#065f46; font-weight:bold;">Student ID: AM-2026</p>
                <p style="margin:0; font-size:11px; color:#64748b;">Wallet: KSh ${agriEngine.state.wallet.toLocaleString()}</p>
            </div>
        </div>
        <h3 style="color:#334155;">My Registered Units</h3>
        ${agriEngine.state.registeredUnits.length === 0 ? 
            `<div style="background:#e2e8f0; padding:20px; border-radius:15px; text-align:center; color:#64748b; font-size:13px;">No units registered. Enroll below.</div>` : 
            agriEngine.state.registeredUnits.map(unit => `
                <div style="background:white; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border-left:6px solid #f68b1e; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <span style="font-weight:bold; font-size:14px;">${unit}</span>
                    <button onclick="alert('Accessing Unit Content...')" style="background:#065f46; color:white; border:none; padding:8px 15px; border-radius:8px; font-size:11px; font-weight:bold;">STUDY</button>
                </div>
            `).join('')
        }
        <h3 style="color:#334155; margin-top:25px;">Course Catalog</h3>
        <div style="display:grid; gap:12px;">
            <div onclick="if(!agriEngine.state.registeredUnits.includes('Modern Agribusiness')){agriEngine.state.registeredUnits.push('Modern Agribusiness'); agriEngine.save(); agriEngine.render();}" 
                style="background:white; padding:20px; border-radius:15px; border-left:6px solid #065f46; cursor:pointer; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                <h4 style="margin:0;">Modern Agribusiness</h4>
                <p style="margin:5px 0 0; font-size:11px; color:#64748b;">3 Core Units | Register to Start</p>
            </div>
            <div onclick="if(!agriEngine.state.registeredUnits.includes('Soil Science')){agriEngine.state.registeredUnits.push('Soil Science'); agriEngine.save(); agriEngine.render();}" 
                style="background:white; padding:20px; border-radius:15px; border-left:6px solid #065f46; cursor:pointer; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                <h4 style="margin:0;">Soil Science Diploma</h4>
                <p style="margin:5px 0 0; font-size:11px; color:#64748b;">5 Core Units | Register to Start</p>
            </div>
        </div>
        <button onclick="agriEngine.state.isLoggedIn=false; agriEngine.render();" style="width:100%; margin-top:30px; background:none; border:none; color:#ef4444; font-weight:bold; font-size:12px;">LOGOUT PORTAL</button>
    </div>`;
};
// 4. MAIN RENDER ENGINE
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(!v || !n) return;
    if(this.state.activeTab === 'admin') {
        if(!this.state.isAdminLoggedIn) {
            v.innerHTML = `<div style="padding:40px; text-align:center; background:#0f172a; min-height:100vh; color:white;">
                <h2 style="color:#38bdf8;">Admin Login</h2>
                <input type="password" id="ap" placeholder="PIN" style="padding:15px; border-radius:10px; width:100px; text-align:center; margin-top:20px;">
                <button onclick="if(document.getElementById('ap').value==='1234'){agriEngine.state.isAdminLoggedIn=true; agriEngine.render();}" style="width:100%; margin-top:20px; background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:10px; font-weight:bold;">UNLOCK ADMIN</button>
            </div>`;
        } else {
            v.innerHTML = `<div style="padding:20px; background:#0f172a; color:white; min-height:100vh;">
                <h3 style="color:#38bdf8;">ADMIN COMMAND: ${this.state.userName}</h3>
                <div style="background:#1e293b; padding:20px; border-radius:15px; border:1px solid #334155;">
                    <p style="font-size:12px; color:#94a3b8;">SYSTEM WALLET</p>
                    <h2 style="color:#4ade80;">KSh ${this.state.wallet.toLocaleString()}</h2>
                    <button onclick="agriEngine.state.wallet+=10000; agriEngine.save(); agriEngine.render();" style="width:100%; padding:15px; background:#38bdf8; color:#0f172a; border:none; border-radius:10px; font-weight:bold;">INJECT KSh 10,000</button>
                </div>
                <button onclick="agriEngine.state.isAdminLoggedIn=false; agriEngine.render();" style="width:100%; margin-top:20px; background:none; color:#ef4444; border:1px solid #ef4444; padding:10px; border-radius:10px;">LOGOUT ADMIN</button>
            </div>`;
        }
    } 
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h3>20 AGRICULTURE TOOLS</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">${['Soil pH','Rainfall','Profit','NPK','Pests','Irrigation'].map(t=>`<div style="background:white; padding:20px; border-radius:12px; text-align:center; border-bottom:4px solid #065f46; font-size:12px; font-weight:bold;">${t.toUpperCase()}</div>`).join('')}</div></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; padding:15px; color:white; font-weight:bold; position:sticky; top:0;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div>
        <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-bottom:100px;">
            ${this.state.inventory.slice(0,20).map(i=>`<div style="background:white; border-radius:5px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <img src="${i.i}" style="width:100%; height:100px; object-fit:cover;">
                <div style="padding:8px;"><div style="font-size:11px; color:#333;">${i.n}</div><div style="font-weight:bold; color:#f68b1e;">KSh ${i.p.toLocaleString()}</div></div>
                <button onclick="alert('Added to Cart')" style="width:100%; background:#f68b1e; color:white; border:none; padding:8px; font-size:10px; font-weight:bold;">ADD TO CART</button>
            </div>`).join('')}
        </div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">${t.l}</div>`).join('');
};
// Start System
agriEngine.render();
