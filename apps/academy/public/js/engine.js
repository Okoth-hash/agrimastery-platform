// 1. FORCE THE VIEWPORT TO RESET
document.body.innerHTML = '<div id="viewport"></div><div id="bottom-nav"></div>';
// 2. SYSTEM DATA
agriEngine.state = {
    wallet: 15000,
    userName: "OMONDI ROBIN",
    currentPage: 1,
    activeTab: 'market',
    inventory: []
};
// 3. GENERATE MARKET DATA
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({id: i, n: "Agri-Item "+i, p: 1500+(i*10), i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=200"});
}
// 4. THE 4 DASHBOARD ENGINES
agriEngine.renderAdmin = (v) => { v.innerHTML = '<div style="padding:40px; text-align:center;"><h2>?? Admin Panel</h2><p>PIN: 1234</p><input id="p" type="password" style="padding:10px;"><button onclick="if(document.getElementById(\'p\').value===\'1234\'){alert(\'Unlocked\')}">GO</button></div>'; };
agriEngine.renderAcademy = (v) => { v.innerHTML = '<div style="padding:20px;"><h2>?? Academy</h2><p>Page '+agriEngine.state.currentPage+' / 1000</p><button onclick="agriEngine.state.currentPage++; agriEngine.render();">Next</button></div>'; };
agriEngine.renderTools = (v) => { v.innerHTML = '<div style="padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">' + ['Soil','Rain','Profit','Crop'].map(t => '<div style="background:white; padding:20px; border-radius:10px; border-bottom:3px solid green;">'+t+'</div>').join('') + '</div>'; };
agriEngine.renderEasyShop = (v) => { v.innerHTML = '<div style="background:#f68b1e; padding:15px; color:white;">?? Market (110 Items)</div><div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">' + agriEngine.state.inventory.slice(0,20).map(i => '<div style="background:white; padding:5px; font-size:10px;">'+i.n+'<br>KSh '+i.p+'</div>').join('') + '</div>'; };
// 5. THE ULTIMATE RENDERER
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    // Switch Dashboards
    if(this.state.activeTab === 'admin') this.renderAdmin(v);
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') this.renderTools(v);
    else this.renderEasyShop(v);
    // Build Nav
    n.style.cssText = "position:fixed; bottom:0; left:0; right:0; height:65px; background:white; display:flex; border-top:2px solid #eee; z-index:9999;";
    const tabs = [['admin','??'],['academy','??'],['tools','???'],['market','??']];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t[0]}'; agriEngine.render();" style="flex:1; text-align:center; padding:10px; font-size:20px; color:${this.state.activeTab===t[0]?'#f68b1e':'#ccc'}">${t[1]}</div>`).join('');
};
agriEngine.render();
