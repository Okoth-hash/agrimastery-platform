// 1. DATA CORE
agriEngine.state = {
    activeTab: 'market',
    wallet: 15000,
    page: 1,
    cart: [],
    inventory: []
};
// 2. JUMIA-STYLE MARKET DATA (110 Items)
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i,
        n: "Premium Agri-Item #" + i,
        p: 1200 + (i * 45),
        oldP: 2500 + (i * 45),
        i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300",
        discount: "45%"
    });
}
// 3. 20 TOOLS LIST
const toolList = [
    {n:"Soil pH", i:"??"}, {n:"Rainfall", i:"??"}, {n:"Profit", i:"??"}, {n:"Harvest", i:"??"},
    {n:"Seed Gap", i:"??"}, {n:"Pest Alert", i:"??"}, {n:"Weather", i:"??"}, {n:"NPK Calc", i:"??"},
    {n:"Livestock", i:"??"}, {n:"Irrigation", i:"??"}, {n:"Market Price", i:"??"}, {n:"Storage", i:"??"},
    {n:"Tractor", i:"??"}, {n:"Labor", i:"??"}, {n:"Insurance", i:"??"}, {n:"Compost", i:"??"},
    {n:"Vet Check", i:"??"}, {n:"Solar", i:"??"}, {n:"Transport", i:"??"}, {n:"Loans", i:"??"}
];
// 4. RENDERERS
agriEngine.renderAdmin = (v) => {
    v.innerHTML = `<div style="padding:20px; background:#1e293b; min-height:100vh; color:white;">
        <h2 style="margin-top:0;">ADMIN CONTROL</h2>
        <div style="background:#334155; padding:20px; border-radius:12px; margin-bottom:15px;">
            <p>User: OMONDI ROBIN</p>
            <p>Wallet: KSh ${agriEngine.state.wallet.toLocaleString()}</p>
            <button onclick="agriEngine.state.wallet += 10000; agriEngine.render();" style="width:100%; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold;">+ ADD KSH 10,000</button>
        </div>
        <button onclick="location.reload()" style="width:100%; background:#ef4444; color:white; border:none; padding:12px; border-radius:8px;">RESET SYSTEM</button>
    </div>`;
};
agriEngine.renderAcademy = (v) => {
    v.innerHTML = `<div style="padding:15px; background:#f8fafc; min-height:100vh;">
        <div style="background:#1b4332; color:white; padding:25px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="margin:0;">AGRI-ACADEMY</h2>
            <div style="margin-top:10px; background:rgba(255,255,255,0.2); height:8px; border-radius:4px;">
                <div style="width:${(agriEngine.state.page/1000)*100}%; background:#4ade80; height:100%; border-radius:4px;"></div>
            </div>
            <p style="font-size:12px; margin-top:5px;">Progress: ${agriEngine.state.page} / 1000 Pages</p>
        </div>
        <div style="margin-top:20px; background:white; padding:20px; border-radius:12px; line-height:1.7;">
            <h3 style="color:#1b4332;">Module ${Math.ceil(agriEngine.state.page/10)}: Soil Science</h3>
            <p>Soil health is determined by organic matter content and microorganism activity...</p>
        </div>
        <button onclick="agriEngine.state.page++; agriEngine.render(); window.scrollTo(0,0);" style="width:100%; margin-top:20px; background:#2d6a4f; color:white; border:none; padding:18px; border-radius:10px; font-weight:bold; font-size:16px;">READ NEXT PAGE</button>
    </div>`;
};
agriEngine.renderTools = (v) => {
    v.innerHTML = `<div style="padding:15px; background:#f1f5f9; min-height:100vh;">
        <h2 style="color:#334155; margin-bottom:15px;">20 SMART TOOLS</h2>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
            ${toolList.map(t => `<div onclick="alert('${t.n} Tool Active')" style="background:white; padding:20px 10px; text-align:center; border-radius:12px; box-shadow:0 2px 4px rgba(0,0,0,0.05); border-bottom:4px solid #2d6a4f;">
                <div style="font-size:32px; margin-bottom:8px;">${t.i}</div>
                <div style="font-size:11px; font-weight:bold; color:#1e293b;">${t.n.toUpperCase()}</div>
            </div>`).join('')}
        </div>
    </div>`;
};
agriEngine.renderMarket = (v) => {
    v.innerHTML = `<div style="background:#f1f1f2; min-height:100vh;">
        <div style="background:#f68b1e; padding:12px; color:white; position:sticky; top:0; z-index:1000;">
            <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:8px;"><span>CALL 0742178833</span><span>KSH ${agriEngine.state.wallet.toLocaleString()}</span></div>
            <input type="text" placeholder="Search Jumia-Style..." style="width:100%; padding:10px; border-radius:4px; border:none; font-size:14px;">
        </div>
        <div style="padding:8px; display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            ${agriEngine.state.inventory.map(i => `<div style="background:white; border-radius:4px; overflow:hidden; position:relative;">
                <div style="position:absolute; top:5px; left:5px; background:#feefd3; color:#f68b1e; font-size:10px; padding:2px 5px; font-weight:bold;">-${i.discount}</div>
                <img src="${i.i}" style="width:100%; height:130px; object-fit:cover;">
                <div style="padding:8px;">
                    <div style="font-size:12px; color:#333; height:32px; overflow:hidden;">${i.n}</div>
                    <div style="font-size:16px; font-weight:bold; color:#222; margin-top:4px;">KSh ${i.p.toLocaleString()}</div>
                    <div style="font-size:12px; color:#888; text-decoration:line-through;">KSh ${i.oldP.toLocaleString()}</div>
                </div>
                <button onclick="alert('Added!')" style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; font-weight:bold; font-size:12px; cursor:pointer;">ADD TO CART</button>
            </div>`).join('')}
        </div>
    </div>`;
};
// 5. MASTER RENDERER
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') this.renderAdmin(v);
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') this.renderTools(v);
    else this.renderMarket(v);
    const tabs = [
        {id:'admin', i:'G', l:'Admin'},
        {id:'academy', i:'A', l:'Academy'},
        {id:'tools', i:'T', l:'Tools'},
        {id:'market', i:'M', l:'Market'}
    ];
    n.innerHTML = tabs.map(t => `
        <div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render(); window.scrollTo(0,0);" style="flex:1; text-align:center; padding:12px 5px; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3b8'}">
            <div style="font-size:22px; font-weight:bold;">${t.i}</div>
            <div style="font-size:10px; font-weight:bold;">${t.l}</div>
        </div>
    `).join('');
};
agriEngine.render();
