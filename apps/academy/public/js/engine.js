agriEngine.state = { activeTab: 'market', wallet: 15000, page: 1 };
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    // TAB CONTENT
    if(this.state.activeTab === 'admin') {
        v.innerHTML = '<div style="padding:20px;"><h2>?? Admin</h2><p>PIN: 1234</p></div>';
    } else if(this.state.activeTab === 'academy') {
        v.innerHTML = '<div style="padding:20px;"><h2>?? Academy</h2><p>Page '+this.state.page+'</p></div>';
    } else if(this.state.activeTab === 'tools') {
        v.innerHTML = '<div style="padding:20px;"><h2>??? Tools</h2><p>Calculators active.</p></div>';
    } else {
        v.innerHTML = '<div style="background:#f68b1e; padding:15px; color:white;">?? Agri-Market</div><div style="padding:20px;">100+ Items Loaded</div>';
    }
    // BOTTOM NAV GENERATION
    const tabs = [
        {id:'admin', i:'??', l:'Admin'},
        {id:'academy', i:'??', l:'Academy'},
        {id:'tools', i:'???', l:'Tools'},
        {id:'market', i:'??', l:'Market'}
    ];
    n.innerHTML = tabs.map(t => `
        <div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:12px; color:${this.state.activeTab===t.id?'#f68b1e':'#999'}">
            <div style="font-size:24px;">${t.i}</div>
            <div style="font-size:10px;">${t.l}</div>
        </div>
    `).join('');
};
// Start
setTimeout(() => agriEngine.render(), 100);
