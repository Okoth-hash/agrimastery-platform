// 1. SYSTEM INITIALIZATION
agriEngine.state = {
    wallet: 15000,
    userName: "OMONDI ROBIN",
    currentPage: 1,
    cart: JSON.parse(localStorage.getItem('agri_cart')) || [],
    inventory: []
};
agriEngine.adminSettings = { pin: "1234", isLocked: true };
agriEngine.marketSettings = { search: "", cat: "All" };
// 2. GENERATE 105 PRODUCTS
const pTemplates = [
    { n: "Hybrid Maize Seeds", p: 2850, i: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=300", c: "Seeds" },
    { n: "NPK Fertilizer 50kg", p: 5900, i: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300", c: "Fertilizer" },
    { n: "Solar Water Pump", p: 18500, i: "https://images.unsplash.com/photo-1581094288338-2314dddb7903?w=300", c: "Equipment" }
];
for(let i=0; i<105; i++) {
    const t = pTemplates[i % pTemplates.length];
    agriEngine.state.inventory.push({ id: i, n: t.n + ' SKU-' + (i+1), p: t.p + (i*10), i: t.i, cat: t.c });
}
// 3. CORE RENDERING ENGINE
agriEngine.renderEasyShop = function(v) {
    const items = this.state.inventory.filter(i => i.n.toLowerCase().includes(this.marketSettings.search.toLowerCase()));
    v.innerHTML = '<div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">' +
        '<div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:2000;">' +
        '<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px;"><span>?? 0742178833</span><span>KSh ' + this.state.wallet.toLocaleString() + '</span></div>' +
        '<input type="text" placeholder="Search products..." oninput="agriEngine.marketSettings.search=this.value; agriEngine.render()" style="width:100%; padding:12px; border-radius:8px; border:none; color:#333; font-size:16px;">' +
        '</div><div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">' +
        items.map(i => '<div style="background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1); display:flex; flex-direction:column;">' +
        '<img src="' + i.i + '" style="width:100%; height:120px; object-fit:cover;">' +
        '<div style="padding:10px; flex:1;"><div style="font-size:11px; font-weight:bold; height:28px; overflow:hidden;">' + i.n + '</div>' +
        '<div style="color:#f68b1e; font-weight:bold; margin-top:5px;">KSh ' + i.p.toLocaleString() + '</div></div>' +
        '<button onclick="agriEngine.addToCart(' + i.id + ')" style="width:100%; background:#f68b1e; color:white; border:none; padding:12px; font-weight:bold; cursor:pointer;">ADD TO CART</button></div>').join('') +
        '</div></div>';
};
agriEngine.renderStudent = function(v) {
    v.innerHTML = '<div style="padding:20px; background:#fff; min-height:100vh; padding-bottom:100px;">' +
        '<div style="background:#1b4332; color:white; padding:15px; border-radius:10px; margin-bottom:20px;">' +
        '<h2 style="margin:0;">?? Agri-Academy</h2><p style="margin:5px 0 0 0;">Progress: ' + this.state.currentPage + ' / 1000 Pages</p></div>' +
        '<div style="line-height:1.6; color:#333;"><h3>Chapter 1: Soil Health</h3><p>Soil pH is the most critical factor for nutrient uptake...</p></div>' +
        '<button onclick="agriEngine.state.currentPage++; agriEngine.render();" style="width:100%; background:#2d6a4f; color:white; padding:15px; border:none; border-radius:8px; font-weight:bold; margin-top:20px;">NEXT PAGE</button></div>';
};
agriEngine.renderTools = function(v) {
    const tList = [{n:"Harvest", i:"??", c:"#2d6a4f"}, {n:"Soil pH", i:"??", c:"#ae2012"}, {n:"Profit", i:"??", c:"#f68b1e"}, {n:"Weather", i:"??", c:"#0077b6"}];
    v.innerHTML = '<div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:15px; background:#f1f1f2; min-height:100vh;">' +
        tList.map(t => '<div onclick="alert(\'Tool Active\')" style="background:white; padding:25px 10px; border-radius:15px; text-align:center; border-bottom:5px solid '+t.c+';">' +
        '<div style="font-size:35px; margin-bottom:10px;">'+t.i+'</div><div style="color:'+t.c+'; font-weight:bold; font-size:12px;">'+t.n.toUpperCase()+'</div></div>').join('') +
        '</div>';
};
agriEngine.renderAdmin = function(v) {
    if (this.adminSettings.isLocked) {
        v.innerHTML = '<div style="padding:50px 20px; text-align:center; background:#0f172a; color:white; min-height:100vh;">??<h3>ADMIN ACCESS</h3>' +
            '<input type="password" id="p" placeholder="PIN" style="width:100px; padding:15px; text-align:center; border-radius:8px; border:none; margin-bottom:20px;"><br>' +
            '<button onclick="if(document.getElementById(\'p\').value===\'1234\'){agriEngine.adminSettings.isLocked=false; agriEngine.render();}else{alert(\'Wrong PIN\')}" style="background:#38bdf8; color:#0f172a; border:none; padding:15px 40px; border-radius:8px; font-weight:bold;">UNLOCK</button></div>';
    } else {
        v.innerHTML = '<div style="padding:20px;"><h2>?? Master Control</h2><p>Student: ' + this.state.userName + '</p><p>Wallet: KSh ' + this.state.wallet + '</p>' +
            '<button onclick="agriEngine.adminSettings.isLocked=true; agriEngine.render()" style="width:100%; background:#ef4444; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold;">LOCK SYSTEM</button></div>';
    }
};
agriEngine.render();
