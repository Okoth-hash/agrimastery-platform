// 1. SYSTEM INITIALIZATION & DATA SHIELD
agriEngine.state.wallet = 15000;
agriEngine.adminState = { isLocked: true, pin: "1234" };
agriEngine.marketState = { searchQuery: "", activeCategory: "All" };
// 2. FULL 100+ ITEM INVENTORY
agriEngine.state.inventory = [];
const itemsTemplates = [
    { n: "Hybrid Maize Seeds", p: 2800, i: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=300", cat: "Seeds" },
    { n: "DAP Fertilizer 50kg", p: 6200, i: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300", cat: "Fertilizer" },
    { n: "Knapsack Sprayer 20L", p: 3500, i: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=300", cat: "Equipment" },
    { n: "Tomato F1 Seeds", p: 1200, i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300", cat: "Seeds" }
];
for(let i=0; i<100; i++) {
    const t = itemsTemplates[i % itemsTemplates.length];
    agriEngine.state.inventory.push({ id: i, n: `${t.n} v${i+1}`, p: t.p, i: t.i, cat: t.cat });
}
// 3. JUMIA-STYLE MARKET RENDERER (Default Landing)
agriEngine.renderEasyShop = function(v) {
    if (!v) v = document.getElementById('viewport');
    const filtered = this.state.inventory.filter(i => 
        i.n.toLowerCase().includes(this.marketState.searchQuery) &&
        (this.marketState.activeCategory === "All" || i.cat === this.marketState.activeCategory)
    );
    v.innerHTML = `
        <div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">
            <div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:1000;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px;">
                    <span>?? 0742178833</span>
                    <span>KSh ${this.state.wallet.toLocaleString()}</span>
                </div>
                <input type="text" placeholder="Search products..." oninput="agriEngine.handleSearch(this.value)" style="width:100%; padding:10px; border-radius:5px; border:none; color:#333;">
            </div>
            <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${filtered.map(i => `
                    <div style="background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                        <img src="${i.i}" style="width:100%; height:120px; object-fit:cover;">
                        <div style="padding:10px;">
                            <div style="font-size:11px; font-weight:bold; height:28px; overflow:hidden;">${i.n}</div>
                            <div style="color:#f68b1e; font-weight:bold; margin-top:5px;">KSh ${i.p.toLocaleString()}</div>
                        </div>
                        <button onclick="agriEngine.addToCart(${i.id})" style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; font-weight:bold;">ADD TO CART</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};
// 4. MULTI-COLORED TOOLS & ADMIN PIN LOGIC
agriEngine.renderTools = function(v) {
    if (!v) v = document.getElementById('viewport');
    const tools = [
        { n: "Harvest", i: "??", c: "#2d6a4f" }, { n: "Soil pH", i: "??", c: "#ae2012" },
        { n: "Rainfall", i: "???", c: "#0077b6" }, { n: "Profit", i: "??", c: "#f68b1e" }
    ];
    v.innerHTML = `
        <div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
            ${tools.map(t => `
                <div onclick="alert('${t.n} Tool Active')" style="background:white; padding:20px; border-radius:15px; text-align:center; border-bottom:5px solid ${t.c};">
                    <div style="font-size:30px;">${t.i}</div>
                    <div style="color:${t.c}; font-weight:bold;">${t.n}</div>
                </div>
            `).join('')}
        </div>
    `;
};
agriEngine.renderAdmin = function(v) {
    if (!v) v = document.getElementById('viewport');
    if (this.adminState.isLocked) {
        v.innerHTML = `<div style="padding:50px; text-align:center;">
            <h3>Admin Locked</h3>
            <input type="password" id="p" placeholder="PIN" style="padding:10px; width:100px; text-align:center;"><br><br>
            <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.adminState.isLocked=false; agriEngine.render();}" style="background:#1e3a8a; color:white; padding:10px 20px; border:none;">UNLOCK</button>
        </div>`;
    } else {
        v.innerHTML = `<div style="padding:20px;"><h2>Master Controller</h2><p>Support: 0742178833</p><button onclick="agriEngine.adminState.isLocked=true; agriEngine.render();">LOCK</button></div>`;
    }
};
// 5. GLOBAL UI CONTROL
agriEngine.handleSearch = function(q) { this.marketState.searchQuery = q.toLowerCase(); this.render(); };
agriEngine.state.activeTab = 'market';
agriEngine.render();
