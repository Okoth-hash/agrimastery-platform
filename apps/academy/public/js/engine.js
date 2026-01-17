// 1. DATA CORE
agriEngine.state = {
    wallet: 15000,
    userName: "OMONDI ROBIN",
    currentPage: 1,
    cart: [],
    inventory: [],
    activeTab: 'market'
};
// 2. INVENTORY GENERATOR (110 ITEMS)
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i,
        n: "Agri-Product SKU-" + i,
        p: 1000 + (i * 50),
        i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300",
        cat: "General"
    });
}
// 3. FEATURE: ADMIN GIFTING & WALLET LOGIC
agriEngine.giftMoney = function(amount) {
    this.state.wallet += amount;
    alert("KSh " + amount + " has been added to the student's wallet!");
    this.render();
};
// 4. THE FOUR DASHBOARDS
agriEngine.renderAdmin = function(v) {
    if (this.adminSettings?.isLocked !== false) {
        v.innerHTML = `<div style="padding:100px 20px; text-align:center; background:#0f172a; color:white; min-height:100vh;">
            <h3>?? ADMIN ACCESS</h3>
            <input type="password" id="p" placeholder="PIN" style="padding:15px; width:80px; text-align:center; border-radius:5px; font-size:20px;"><br><br>
            <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.adminSettings={isLocked:false}; agriEngine.render();}else{alert('Wrong PIN')}" style="background:#38bdf8; padding:15px 30px; border:none; border-radius:8px; font-weight:bold;">UNLOCK SYSTEM</button>
        </div>`;
    } else {
        v.innerHTML = `<div style="padding:20px; background:#f8fafc; min-height:100vh;">
            <h2 style="color:#0f172a;">?? Master Control</h2>
            <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
                <p><strong>Student:</strong> ${this.state.userName}</p>
                <p><strong>Current Wallet:</strong> KSh ${this.state.wallet.toLocaleString()}</p>
                <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
                <p style="font-size:12px; color:#666;">QUICK ACTIONS</p>
                <button onclick="agriEngine.giftMoney(5000)" style="background:#10b981; color:white; border:none; padding:10px 15px; border-radius:5px; margin-right:5px;">+ Gift KSh 5,000</button>
                <button onclick="agriEngine.giftMoney(10000)" style="background:#059669; color:white; border:none; padding:10px 15px; border-radius:5px;">+ Gift KSh 10,000</button>
            </div>
            <button onclick="agriEngine.adminSettings.isLocked=true; agriEngine.render();" style="width:100%; background:#ef4444; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">LOCK ADMIN PANEL</button>
        </div>`;
    }
};
agriEngine.renderAcademy = function(v) {
    v.innerHTML = `<div style="padding:20px; background:#fff; min-height:100vh;">
        <div style="background:#1b4332; color:white; padding:20px; border-radius:15px;">
            <h2 style="margin:0;">?? Agri-Academy</h2>
            <p style="opacity:0.8;">Page ${this.state.currentPage} of 1000</p>
        </div>
        <div style="margin-top:20px; line-height:1.8; color:#333;">
            <h3 style="color:#1b4332;">Chapter ${Math.ceil(this.state.currentPage/10)}: Modern Farming</h3>
            <p>Sustainable agriculture requires a balance between soil health and modern technology...</p>
        </div>
        <button onclick="agriEngine.state.currentPage++; agriEngine.render();" style="width:100%; margin-top:30px; padding:18px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; font-size:16px;">READ NEXT PAGE</button>
    </div>`;
};
agriEngine.renderTools = function(v) {
    const t = [{n:"Soil pH", i:"??", c:"#ae2012"}, {n:"Rainfall", i:"???", c:"#0077b6"}, {n:"Profit", i:"??", c:"#f68b1e"}, {n:"Harvest", i:"??", c:"#2d6a4f"}];
    v.innerHTML = `<div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:15px; background:#f1f1f2; min-height:100vh;">
        ${t.map(x => `<div onclick="alert('${x.n} Tool Starting...')" style="background:white; padding:25px 10px; text-align:center; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05); border-bottom:5px solid ${x.c};">
            <div style="font-size:35px; margin-bottom:10px;">${x.i}</div>
            <div style="color:${x.c}; font-weight:bold; font-size:12px;">${x.n.toUpperCase()}</div>
        </div>`).join('')}
    </div>`;
};
agriEngine.renderEasyShop = function(v) {
    const filtered = this.state.inventory.filter(i => i.n.toLowerCase().includes((this.mSearch || "").toLowerCase()));
    v.innerHTML = `<div style="background:#f1f1f2; min-height:100vh;">
        <div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0; z-index:1000; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px; font-weight:bold;">
                <span>?? 0742178833</span>
                <span>Wallet: KSh ${this.state.wallet.toLocaleString()}</span>
            </div>
            <input type="text" placeholder="Search 110 products..." oninput="agriEngine.mSearch=this.value; agriEngine.render()" style="width:100%; padding:12px; border-radius:8px; border:none; color:#333; font-size:16px;">
        </div>
        <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            ${filtered.map(i => `<div style="background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <img src="${i.i}" style="width:100%; height:110px; object-fit:cover;">
                <div style="padding:10px;"><div style="font-size:11px; font-weight:bold; height:28px; overflow:hidden;">${i.n}</div>
                <div style="color:#f68b1e; font-weight:bold; font-size:15px; margin-top:5px;">KSh ${i.p.toLocaleString()}</div></div>
                <button onclick="alert('Added to cart!')" style="width:100%; background:#f68b1e; color:white; border:none; padding:12px; font-weight:bold; cursor:pointer;">ADD TO CART</button>
            </div>`).join('')}
        </div>
    </div>`;
};
// 5. THE ULTIMATE NAVIGATION ENGINE
agriEngine.switchTab = function(t) { this.state.activeTab = t; this.render(); window.scrollTo(0,0); };
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    if (this.state.activeTab === 'admin') this.renderAdmin(v);
    else if (this.state.activeTab === 'academy') this.renderAcademy(v);
    else if (this.state.activeTab === 'tools') this.renderTools(v);
    else this.renderEasyShop(v);
    let nav = document.getElementById('bottom-nav');
    if(!nav) {
        nav = document.createElement('div');
        nav.id = 'bottom-nav';
        document.body.appendChild(nav);
    }
    nav.style.cssText = "position:fixed; bottom:0; left:0; right:0; height:75px; background:white; display:flex; border-top:1px solid #eee; z-index:9999; box-shadow:0 -2px 10px rgba(0,0,0,0.05);";
    const tabs = [
        { id: 'admin', icon: '??', label: 'Admin' },
        { id: 'academy', icon: '??', label: 'Academy' },
        { id: 'tools', icon: '???', label: 'Tools' },
        { id: 'market', icon: '??', label: 'Market' }
    ];
    nav.innerHTML = tabs.map(t => `
        <div onclick="agriEngine.switchTab('${t.id}')" style="flex:1; text-align:center; padding:12px 5px; cursor:pointer; color:${this.state.activeTab === t.id ? '#f68b1e' : '#94a3b8'}; transition:0.3s;">
            <div style="font-size:24px; margin-bottom:4px;">${t.icon}</div>
            <div style="font-size:10px; font-weight:${this.state.activeTab === t.id ? 'bold' : 'normal'}; text-transform:uppercase; letter-spacing:0.5px;">${t.label}</div>
        </div>
    `).join('');
};
agriEngine.render();
