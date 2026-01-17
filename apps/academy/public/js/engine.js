const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'student',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        listings: JSON.parse(localStorage.getItem('agri_listings') || '[]'),
        suggestions: JSON.parse(localStorage.getItem('agri_suggestions') || '[]')
    },
    init: function() {
        document.body.innerHTML = `
            <div id="ghost-trigger" style="height:8px; background:#111; cursor:pointer;" ondblclick="agriEngine.unlockAdmin()"></div>
            <div id="viewport" style="min-height:100vh; padding-bottom:80px; background:#f4f7f6; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; padding:15px; box-shadow:0 -2px 15px rgba(0,0,0,0.1); z-index:9999;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'admin' && this.state.isAdmin) this.renderAdminDashboard(view);
        else if (this.state.activeTab === 'tools') this.renderToolDashboard(view);
        else if (this.state.activeTab === 'market') this.renderMarketDashboard(view);
        else this.renderStudentDashboard(view);
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [
            { id: 'student', label: 'Academy', icon: '🎓' },
            { id: 'tools', label: 'Tools', icon: '🛠️' },
            { id: 'market', label: 'Market', icon: '📉' }
        ];
        if(this.state.isAdmin) tabs.push({ id: 'admin', label: 'Admin', icon: '⚡' });
        nav.innerHTML = tabs.map(t => `
            <button onclick="agriEngine.setTab('${t.id}')" style="border:none; background:none; text-align:center; color:${this.state.activeTab === t.id ? '#2d6a4f' : '#999'}">
                <div style="font-size:20px;">${t.icon}</div>
                <div style="font-size:10px; font-weight:bold;">${t.label}</div>
            </button>
        `).join('');
    },
    setTab: function(id) {
        this.state.activeTab = id;
        localStorage.setItem('agri_tab', id);
        this.render();
    },
    renderAdminDashboard: function(view) {
        view.innerHTML = `
            <div style="padding:20px; background:#1a1a1a; color:white;">
                <h2>⚡ Admin Command Center</h2>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:20px;">
                    <div style="background:#333; padding:15px; border-radius:10px;">
                        <h4>Students (${this.state.directory.length})</h4>
                        ${this.state.directory.map(s => `<div style="font-size:11px; border-bottom:1px solid #444; padding:5px;">${s.name}</div>`).join('')}
                    </div>
                    <div style="background:#333; padding:15px; border-radius:10px;">
                        <h4>Inbox (${this.state.suggestions.length})</h4>
                        ${this.state.suggestions.map(m => `<div style="font-size:10px; color:#aaa;">${m.text}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    renderStudentDashboard: function(view) {
        if(!this.state.user) { view.innerHTML = this.getRegHTML(); return; }
        view.innerHTML = `
            <div style="padding:20px;">
                <div style="background:linear-gradient(to right, #2d6a4f, #1b4332); color:white; padding:30px; border-radius:20px;">
                    <h1>Hello, ${this.state.user.name}</h1>
                </div>
                <button onclick="agriEngine.logout()" style="margin-top:20px; padding:10px; width:100%;">Logout</button>
            </div>
        `;
    },
    renderToolDashboard: function(view) {
        const items = [{n:"Soil Tester", p:"2,500", i:"🧪"}, {n:"Drip Kit", p:"4,200", i:"💧"}];
        view.innerHTML = `<div style="padding:20px;"><h2>Tools Store</h2><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            ${items.map(t => `<div style="background:white; padding:10px; border-radius:10px;">${t.i}<br><b>${t.n}</b><br>KSh ${t.p}</div>`).join('')}
        </div></div>`;
    },
    renderMarketDashboard: function(view) {
        view.innerHTML = `<div style="padding:20px;"><h2>Market</h2><p>Live Maize: KSh 3,800</p></div>`;
    },
    unlockAdmin: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }},
    logout: function() { localStorage.removeItem('agri_student'); location.reload(); },
    getRegHTML: function() { return '<div style="padding:50px;"><input id="rn" placeholder="Name" style="width:100%; padding:10px;"><button onclick="agriEngine.doReg()" style="width:100%; padding:10px; background:#2d6a4f; color:white; border:none; margin-top:10px;">JOIN</button></div>'; },
    doReg: function() { const n = document.getElementById('rn').value; if(n){ localStorage.setItem('agri_student', JSON.stringify({name:n})); this.state.directory.push({name:n}); localStorage.setItem('agri_directory', JSON.stringify(this.state.directory)); location.reload(); }}
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
