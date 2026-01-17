// 1. STATE & WALLET
agriEngine.state = {
    activeTab: 'market',
    wallet: 15000,
    page: 1,
    inventory: []
};
// 2. JUMIA-STYLE MARKET GENERATOR
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i,
        name: "Agri-Master Pro SKU-" + i,
        price: 1250 + (i * 25),
        oldPrice: 3000 + (i * 10),
        img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
    });
}
// 3. TOOLS DATABASE (20 ITEMS)
const toolset = [
    "Soil pH","Rainfall","Profit","Harvest","Seed Gap","Pest Alert","Weather","NPK Calc",
    "Livestock","Irrigation","Market Price","Storage","Tractor","Labor","Insurance","Compost",
    "Vet Check","Solar Power","Transport","Agri-Loan"
];
// 4. RENDERER ENGINES
agriEngine.renderAdmin = (v) => {
    v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;">
        <h2 style="color:#38bdf8;">SYSTEM ADMIN</h2>
        <div style="background:#1e293b; padding:20px; border-radius:12px; border-left:5px solid #38bdf8;">
            <p><strong>Operator:</strong> OMONDI ROBIN</p>
            <p><strong>System Status:</strong> <span style="color:#4ade80;">Fully Active</span></p>
            <p><strong>Wallet:</strong> KSh ${agriEngine.state.wallet.toLocaleString()}</p>
            <button onclick="agriEngine.state.wallet += 20000; agriEngine.render();" style="width:100%; background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:8px; font-weight:bold; margin-top:10px;">GIFT KSH 20,000</button>
        </div>
    </div>`;
};
agriEngine.renderAcademy = (v) => {
    v.innerHTML = `<div style="padding:20px; background:white; min-height:100vh;">
        <div style="background:#065f46; color:white; padding:20px; border-radius:15px;">
            <h3>?? Agri-Academy</h3>
            <div style="background:rgba(0,0,0,0.2); height:10px; border-radius:5px; margin:10px 0;">
                <div style="width:${(agriEngine.state.page/1000)*100}%; background:#34d399; height:100%; border-radius:5px;"></div>
            </div>
            <span>Page ${agriEngine.state.page} / 1000</span>
        </div>
        <div style="margin-top:20px; color:#334155; line-height:1.6;">
            <h4>Lesson ${Math.ceil(agriEngine.state.page/5)}: Crop Management</h4>
            <p>Proper spacing and nutrient timing are the foundations of a high-yield harvest in East Africa...</p>
        </div>
        <button onclick="agriEngine.state.page++; agriEngine.render(); window.scrollTo(0,0);" style="width:100%; position:fixed; bottom:90px; left:0; background:#065f46; color:white; border:none; padding:18px; font-weight:bold;">NEXT LESSON</button>
    </div>`;
};
agriEngine.renderTools = (v) => {
    v.innerHTML = `<div style="padding:15px; background:#f8fafc; min-height:100vh;">
        <h3 style="color:#1e293b;">20 ACTIVE TOOLS</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-bottom:100px;">
            ${toolset.map(t => `<div onclick="alert('${t} Loaded')" style="background:white; padding:20px; border-radius:12px; box-shadow:0 2px 4px rgba(0,0,0,0.05); text-align:center; border-bottom:3px solid #065f46;">
                <div style="font-weight:bold; font-size:12px; color:#1e293b;">${t.toUpperCase()}</div>
            </div>`).join('')}
        </div>
    </div>`;
};
agriEngine.renderMarket = (v) => {
    v.innerHTML = `<div style="background:#f1f1f2; min-height:100vh;">
        <div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0; z-index:1000;">
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:12px; margin-bottom:10px;">
                <span>?? JUMIA STYLE</span>
                <span>Wallet: KSh ${agriEngine.state.wallet.toLocaleString()}</span>
            </div>
            <input type="text" placeholder="Search products..." style="width:100%; padding:10px; border-radius:4px; border:none;">
        </div>
        <div style="padding:8px; display:grid; grid-template-columns:1fr 1fr; gap:8px; padding-bottom:100px;">
            ${agriEngine.state.inventory.map(i => `<div style="background:white; border-radius:4px; overflow:hidden;">
                <img src="${i.img}" style="width:100%; height:120px; object-fit:cover;">
                <div style="padding:8px;">
                    <div style="font-size:12px; height:32px; overflow:hidden;">${i.name}</div>
                    <div style="font-size:16px; font-weight:bold; color:#f68b1e;">KSh ${i.price.toLocaleString()}</div>
                    <div style="font-size:11px; text-decoration:line-through; color:#999;">KSh ${i.oldPrice.toLocaleString()}</div>
                </div>
                <button onclick="alert('Added to Cart')" style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; font-weight:bold;">ADD TO CART</button>
            </div>`).join('')}
        </div>
    </div>`;
};
// 5. THE ULTIMATE NAVIGATION
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') this.renderAdmin(v);
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') this.renderTools(v);
    else this.renderMarket(v);
    const tabs = [
        {id:'admin', i:'ADMIN', l:'Admin'},
        {id:'academy', i:'ACAD', l:'Academy'},
        {id:'tools', i:'TOOL', l:'Tools'},
        {id:'market', i:'SHOP', l:'Market'}
    ];
    n.innerHTML = tabs.map(t => `
        <div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render(); window.scrollTo(0,0);" style="flex:1; text-align:center; padding:15px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}">
            <div style="font-size:12px; font-weight:900;">${t.i}</div>
            <div style="font-size:9px; font-weight:bold; margin-top:2px;">${t.l}</div>
        </div>
    `).join('');
};
agriEngine.render();
