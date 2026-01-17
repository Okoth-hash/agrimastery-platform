// 1. SYSTEM INITIALIZATION
agriEngine.state = {
    wallet: 15000,
    userName: "OMONDI ROBIN",
    currentPage: 1,
    cart: [],
    inventory: [],
    activeTab: 'market' // Default view
};
agriEngine.adminSettings = { pin: "1234", isLocked: true };
agriEngine.marketSettings = { search: "" };
// 2. BUILD PRODUCT LIST (100+ items)
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i,
        n: "Agri-Product SKU-" + i,
        p: 1000 + (i * 50),
        i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300",
        cat: "General"
    });
}
// 3. TAB SWITCHER LOGIC
agriEngine.switchTab = function(tabId) {
    this.state.activeTab = tabId;
    this.render();
};
// 4. THE 4 DASHBOARD RENDERERS
agriEngine.renderAdmin = function(v) {
    if (this.adminSettings.isLocked) {
        v.innerHTML = '<div style="padding:100px 20px; text-align:center; background:#0f172a; color:white; min-height:100vh;"><h3>?? ADMIN LOCK</h3><input type="password" id="p" placeholder="PIN" style="padding:15px; width:80px; text-align:center; border-radius:5px;"><br><br><button onclick="if(document.getElementById(\'p\').value===\'1234\'){agriEngine.adminSettings.isLocked=false; agriEngine.render();}" style="background:#38bdf8; padding:10px 30px; border:none; border-radius:5px; font-weight:bold;">UNLOCK</button></div>';
    } else {
        v.innerHTML = '<div style="padding:20px;"><h2>?? Admin Dashboard</h2><p>Student: OMONDI ROBIN</p><button onclick="agriEngine.adminSettings.isLocked=true; agriEngine.render();" style="background:red; color:white; border:none; padding:10px;">LOCK</button></div>';
    }
};
agriEngine.renderAcademy = function(v) {
    v.innerHTML = '<div style="padding:20px;"><h2>?? Academy</h2><div style="background:#e8f5e9; padding:20px; border-radius:10px; border-left:5px solid #2d6a4f;"><h3>Chapter 1</h3><p>Page ' + this.state.currentPage + ' / 1000</p></div><button onclick="agriEngine.state.currentPage++; agriEngine.render();" style="width:100%; margin-top:20px; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:8px;">NEXT PAGE</button></div>';
};
agriEngine.renderTools = function(v) {
    const t = [{n:"Soil pH", i:"??"}, {n:"Rainfall", i:"???"}, {n:"Profit", i:"??"}, {n:"Harvest", i:"??"}];
    v.innerHTML = '<div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">' + t.map(x => '<div style="background:white; padding:20px; text-align:center; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); border-bottom:4px solid #2d6a4f;"><div style="font-size:30px;">'+x.i+'</div><b>'+x.n+'</b></div>').join('') + '</div>';
};
agriEngine.renderEasyShop = function(v) {
    const filtered = this.state.inventory.filter(i => i.n.toLowerCase().includes(this.marketSettings.search.toLowerCase()));
    v.innerHTML = '<div style="background:#f1f1f2; min-height:100vh;"><div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0;"><input type="text" placeholder="Search Market..." oninput="agriEngine.marketSettings.search=this.value; agriEngine.render()" style="width:100%; padding:10px; border-radius:5px; border:none;"></div><div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">' + filtered.map(i => '<div style="background:white; border-radius:5px; overflow:hidden;"><img src="'+i.i+'" style="width:100%; height:100px; object-fit:cover;"><div style="padding:10px; font-size:12px;"><b>'+i.n+'</b><div style="color:#f68b1e;">KSh '+i.p+'</div></div><button onclick="alert(\'Added\')" style="width:100%; background:#f68b1e; color:white; border:none; padding:8px;">ADD</button></div>').join('') + '</div></div>';
};
// 5. MASTER RENDERER WITH BOTTOM NAV (Admin -> Academy -> Tools -> Market)
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    if (this.state.activeTab === 'admin') this.renderAdmin(v);
    else if (this.state.activeTab === 'academy') this.renderAcademy(v);
    else if (this.state.activeTab === 'tools') this.renderTools(v);
    else this.renderEasyShop(v);
    // Bottom Navigation Bar
    let nav = document.getElementById('bottom-nav');
    if(!nav) {
        nav = document.createElement('div');
        nav.id = 'bottom-nav';
        document.body.appendChild(nav);
    }
    nav.style.cssText = "position:fixed; bottom:0; left:0; right:0; height:70px; background:white; display:flex; border-top:1px solid #ddd; z-index:9999;";
    const tabs = [
        { id: 'admin', icon: '??', label: 'Admin' },
        { id: 'academy', icon: '??', label: 'Academy' },
        { id: 'tools', icon: '???', label: 'Tools' },
        { id: 'market', icon: '??', label: 'Market' }
    ];
    nav.innerHTML = tabs.map(t => `
        <div onclick="agriEngine.switchTab('${t.id}')" style="flex:1; text-align:center; padding:10px; color:${this.state.activeTab === t.id ? '#f68b1e' : '#666'}">
            <div style="font-size:20px;">${t.icon}</div>
            <div style="font-size:10px;">${t.label}</div>
        </div>
    `).join('');
};
agriEngine.render();
