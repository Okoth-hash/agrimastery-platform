agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    // CONTENT SELECTOR
    let content = '';
    if(this.state.activeTab === 'admin') {
        content = '<div style="padding:40px; text-align:center;"><h2>?? Admin Control</h2><p>PIN: 1234</p><div style="background:#ddd; height:200px; border-radius:10px; display:flex; align-items:center; justify-content:center;">System Secured</div></div>';
    } else if(this.state.activeTab === 'academy') {
        content = '<div style="padding:20px;"><div style="background:#1b4332; color:white; padding:20px; border-radius:15px;"><h2>?? Academy</h2><p>Page '+this.state.page+' of 1000</p></div><button onclick="agriEngine.state.page++; agriEngine.render();" style="width:100%; margin-top:20px; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px;">Next Lesson</button></div>';
    } else if(this.state.activeTab === 'tools') {
        content = '<div style="padding:20px;"><h2>??? Farm Tools</h2><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><div style="background:white; padding:20px; border-radius:10px;">Soil Tester</div><div style="background:white; padding:20px; border-radius:10px;">Rain Log</div></div></div>';
    } else {
        content = '<div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0;">?? Agri-Market</div><div style="padding:20px;"><p>110+ Products Ready</p><div style="height:100px; background:white; margin-bottom:10px; border-radius:8px;"></div><div style="height:100px; background:white; margin-bottom:10px; border-radius:8px;"></div></div>';
    }
    v.innerHTML = content;
    // NAVIGATION BAR (Admin, Academy, Tools, Market)
    const tabs = [
        {id:'admin', i:'??', l:'Admin'},
        {id:'academy', i:'??', l:'Academy'},
        {id:'tools', i:'???', l:'Tools'},
        {id:'market', i:'??', l:'Market'}
    ];
    n.innerHTML = tabs.map(t => `
        <div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" class="nav-item" style="color:${this.state.activeTab===t.id?'#f68b1e':'#9ca3af'}">
            <div style="font-size:24px;">${t.i}</div>
            <div style="font-size:10px; font-weight:${this.state.activeTab===t.id?'bold':'normal'}">${t.l}</div>
        </div>
    `).join('');
};
// Initial Boot
setTimeout(() => agriEngine.render(), 100);
