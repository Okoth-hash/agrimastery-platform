agriEngine.state = {
    activeTab: 'market',
    wallet: 15000,
    page: 1,
    inventory: []
};
// 1. JUMIA-STYLE MARKET DATA
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i,
        name: "Agri-Master Pro SKU-" + i,
        price: 1250 + (i * 25),
        oldPrice: 3000 + (i * 10),
        img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
    });
}
// 2. 20 TOOLS WITH ACTUAL IMAGE LINKS
const toolset = [
    {n:"Soil pH", i:"https://cdn-icons-png.flaticon.com/128/3411/3411516.png"},
    {n:"Rainfall", i:"https://cdn-icons-png.flaticon.com/128/1163/1163624.png"},
    {n:"Profit", i:"https://cdn-icons-png.flaticon.com/128/2454/2454282.png"},
    {n:"Harvest", i:"https://cdn-icons-png.flaticon.com/128/2382/2382533.png"},
    {n:"Seed Gap", i:"https://cdn-icons-png.flaticon.com/128/1043/1043444.png"},
    {n:"Pest Alert", i:"https://cdn-icons-png.flaticon.com/128/2625/2625055.png"},
    {n:"Weather", i:"https://cdn-icons-png.flaticon.com/128/869/869869.png"},
    {n:"NPK Calc", i:"https://cdn-icons-png.flaticon.com/128/2917/2917995.png"},
    {n:"Livestock", i:"https://cdn-icons-png.flaticon.com/128/1998/1998614.png"},
    {n:"Irrigation", i:"https://cdn-icons-png.flaticon.com/128/3105/3105807.png"},
    {n:"Market Price", i:"https://cdn-icons-png.flaticon.com/128/2910/2910317.png"},
    {n:"Storage", i:"https://cdn-icons-png.flaticon.com/128/2897/2897858.png"},
    {n:"Tractor", i:"https://cdn-icons-png.flaticon.com/128/2555/2555000.png"},
    {n:"Labor", i:"https://cdn-icons-png.flaticon.com/128/912/912318.png"},
    {n:"Insurance", i:"https://cdn-icons-png.flaticon.com/128/3501/3501308.png"},
    {n:"Compost", i:"https://cdn-icons-png.flaticon.com/128/2311/2311530.png"},
    {n:"Vet Check", i:"https://cdn-icons-png.flaticon.com/128/2864/2864197.png"},
    {n:"Solar Power", i:"https://cdn-icons-png.flaticon.com/128/2913/2913508.png"},
    {n:"Transport", i:"https://cdn-icons-png.flaticon.com/128/2554/2554979.png"},
    {n:"Agri-Loan", i:"https://cdn-icons-png.flaticon.com/128/2845/2845812.png"}
];
// 3. RENDERERS (Admin, Academy, Tools, Market)
agriEngine.renderAdmin = (v) => {
    v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;">
        <h2 style="color:#38bdf8;">ADMIN PANEL</h2>
        <div style="background:#1e293b; padding:20px; border-radius:12px; border-left:5px solid #38bdf8;">
            <p><strong>Student:</strong> OMONDI ROBIN</p>
            <p><strong>Wallet:</strong> KSh ${agriEngine.state.wallet.toLocaleString()}</p>
            <button onclick="agriEngine.state.wallet += 10000; agriEngine.render();" style="width:100%; background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:8px; font-weight:bold;">ADD KSH 10,000</button>
        </div>
    </div>`;
};
agriEngine.renderAcademy = (v) => {
    v.innerHTML = `<div style="padding:20px; background:white; min-height:100vh;">
        <div style="background:#065f46; color:white; padding:20px; border-radius:15px;">
            <h3>?? Agri-Academy</h3>
            <span>Progress: Page ${agriEngine.state.page} / 1000</span>
        </div>
        <div style="margin-top:20px; color:#334155;">
            <h4>Section ${Math.ceil(agriEngine.state.page/10)}: Modern Tech</h4>
            <p>Sustainable growth begins with understanding your soil data...</p>
        </div>
        <button onclick="agriEngine.state.page++; agriEngine.render();" style="width:100%; position:fixed; bottom:90px; left:0; background:#065f46; color:white; border:none; padding:20px; font-weight:bold;">NEXT PAGE</button>
    </div>`;
};
agriEngine.renderTools = (v) => {
    v.innerHTML = `<div style="padding:15px; background:#f8fafc; min-height:100vh;">
        <h3 style="color:#1e293b;">20 AGRICULTURE TOOLS</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-bottom:120px;">
            ${toolset.map(t => `<div style="background:white; padding:15px; border-radius:12px; box-shadow:0 2px 4px rgba(0,0,0,0.05); text-align:center;">
                <img src="${t.i}" style="width:50px; height:50px; margin-bottom:10px;">
                <div style="font-weight:bold; font-size:11px; color:#1e293b;">${t.n.toUpperCase()}</div>
            </div>`).join('')}
        </div>
    </div>`;
};
agriEngine.renderMarket = (v) => {
    v.innerHTML = `<div style="background:#f1f1f2; min-height:100vh;">
        <div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0; z-index:1000;">
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:12px;"><span>JUMIA MARKET</span><span>KSh ${agriEngine.state.wallet.toLocaleString()}</span></div>
        </div>
        <div style="padding:8px; display:grid; grid-template-columns:1fr 1fr; gap:8px; padding-bottom:100px;">
            ${agriEngine.state.inventory.map(i => `<div style="background:white; border-radius:4px; overflow:hidden;">
                <img src="${i.img}" style="width:100%; height:120px; object-fit:cover;">
                <div style="padding:8px;">
                    <div style="font-size:12px; height:32px; overflow:hidden;">${i.name}</div>
                    <div style="font-size:16px; font-weight:bold; color:#f68b1e;">KSh ${i.price.toLocaleString()}</div>
                    <div style="font-size:11px; text-decoration:line-through; color:#999;">KSh ${i.oldPrice.toLocaleString()}</div>
                </div>
                <button style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; font-weight:bold;">ADD TO CART</button>
            </div>`).join('')}
        </div>
    </div>`;
};
// 4. NAVIGATION RENDERER
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') this.renderAdmin(v);
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') this.renderTools(v);
    else this.renderMarket(v);
    const tabs = [{id:'admin', l:'Admin'},{id:'academy', l:'Academy'},{id:'tools', l:'Tools'},{id:'market', l:'Market'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render(); window.scrollTo(0,0);" style="flex:1; text-align:center; padding:20px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px;">${t.l.toUpperCase()}</div>`).join('');
};
agriEngine.render();
