// 1. EMERGENCY BOOT SEQUENCE
console.log("System Booting...");
window.agriEngine = {
    state: {
        activeTab: 'market',
        wallet: 15000,
        isAdminLoggedIn: false,
        isLoggedIn: false,
        userName: "ROBIN",
        registeredUnits: [],
        inventory: []
    }
};
// 2. DATA RECOVERY (Load from LocalStorage if exists)
try {
    const saved = JSON.parse(localStorage.getItem('agriMasteryData'));
    if (saved) {
        agriEngine.state.wallet = saved.wallet || 15000;
        agriEngine.state.registeredUnits = saved.registeredUnits || [];
        console.log("Data Recovered Successfully");
    }
} catch (e) {
    console.log("New Profile Created");
}
agriEngine.save = function() {
    localStorage.setItem('agriMasteryData', JSON.stringify({
        wallet: this.state.wallet,
        registeredUnits: this.state.registeredUnits
    }));
};
// 3. GENERATE MARKET (110 Items)
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i, n: "Agri-Pro Item #" + i, p: 1200 + (i*10), op: 2500,
        i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
    });
}
// 4. RENDERER (Admin, Academy, Tools, Market)
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(!v || !n) return;
    if(this.state.activeTab === 'admin') {
        if(!this.state.isAdminLoggedIn) {
            v.innerHTML = `<div style="padding:40px; text-align:center; background:#0f172a; height:100vh; color:white;">
                <h2>Admin Login</h2>
                <input type="password" id="ap" placeholder="PIN" style="padding:15px; border-radius:10px; width:100px; text-align:center;">
                <button onclick="if(document.getElementById('ap').value==='1234'){agriEngine.state.isAdminLoggedIn=true; agriEngine.render();}" style="width:100%; margin-top:20px; background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:10px; font-weight:bold;">UNLOCK</button>
            </div>`;
        } else {
            v.innerHTML = `<div style="padding:20px; background:#0f172a; color:white; min-height:100vh;">
                <h3>COMMANDER: ${this.state.userName}</h3>
                <p>Wallet: KSh ${this.state.wallet.toLocaleString()}</p>
                <button onclick="agriEngine.state.wallet+=10000; agriEngine.save(); agriEngine.render();" style="width:100%; padding:15px; background:#4ade80; color:black; border:none; border-radius:10px; font-weight:bold;">GIFT KSh 10,000</button>
            </div>`;
        }
    } 
    else if(this.state.activeTab === 'academy') {
        v.innerHTML = `<div style="padding:20px;"><h2>ACADEMY PORTAL</h2><p>Student: ${this.state.userName}</p></div>`;
    }
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h2>20 TOOLS READY</h2></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; padding:15px; color:white;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div>
        <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            ${this.state.inventory.slice(0,10).map(i=>`<div style="background:white; padding:10px; border-radius:8px;">
                <div style="font-size:11px;">${i.n}</div><div style="font-weight:bold; color:#f68b1e;">KSh ${i.p}</div>
            </div>`).join('')}
        </div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px;">${t.l}</div>`).join('');
};
// 5. START SYSTEM
document.addEventListener('DOMContentLoaded', () => agriEngine.render());
// Fallback if DOM already loaded
if (document.readyState === "complete" || document.readyState === "interactive") { agriEngine.render(); }
