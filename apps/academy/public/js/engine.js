const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: localStorage.getItem('agri_tab') || 'academy',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        listings: JSON.parse(localStorage.getItem('agri_listings') || '[]'),
        suggestions: JSON.parse(localStorage.getItem('agri_suggestions') || '[]')
    },
    tools: [
        { id: 'T1', name: 'Digital pH Meter', price: 2500, img: '🧪' },
        { id: 'T2', name: 'Drip Irrigation Kit', price: 12000, img: '💧' },
        { id: 'T3', name: 'NPK Fertilizer', price: 3200, img: '📦' }
    ],
    init: function() {
        document.body.innerHTML = '<div id="admin-top-bar"></div><div id="main-viewport" style="padding-bottom:80px;"></div><div id="bottom-nav"></div>';
        this.render();
    },
    render: function() {
        this.renderAdminBar();
        this.renderNav();
        const view = document.getElementById('main-viewport');
        switch(this.state.activeTab) {
            case 'tools': this.renderTools(view); break;
            case 'market': this.renderMarket(view); break;
            case 'admin': this.renderAdminDashboard(view); break;
            default: this.renderAcademy(view);
        }
    },
    // --- 1. COORDINATED NAVIGATION ---
    renderNav: function() {
        const nav = document.getElementById('bottom-nav');
        const tabs = [
            { id: 'academy', label: 'Academy', icon: '🎓' },
            { id: 'tools', label: 'Tools', icon: '🛠️' },
            { id: 'market', label: 'Market', icon: '📉' }
        ];
        nav.innerHTML = '<div style="display:flex; justify-content:space-around; background:white; padding:15px; box-shadow:0 -2px 10px rgba(0,0,0,0.1); position:fixed; bottom:0; width:100%; z-index:1000;">' +
            tabs.map(t => '<button onclick="agriEngine.setTab(\''+t.id+'\')" style="border:none; background:none; font-family:sans-serif; color:'+(this.state.activeTab===t.id?'#2d6a4f':'#999')+'"><div>'+t.icon+'</div><div style="font-size:10px;">'+t.label+'</div></button>').join('') +
        '</div>';
    },
    setTab: function(t) { 
        this.state.activeTab = t; 
        localStorage.setItem('agri_tab', t);
        this.render(); 
    },
    // --- 2. ACADEMY DASHBOARD ---
    renderAcademy: function(view) {
        if(!this.state.user) { this.renderReg(view); return; }
        view.innerHTML = '<div style="padding:20px; font-family:sans-serif;">' +
            '<div style="background:#2d6a4f; color:white; padding:20px; border-radius:15px; margin-bottom:20px;">' +
                '<h3>Welcome, ' + this.state.user.name + '</h3>' +
                '<p>Unit: ' + (localStorage.getItem('agri_active_unit') || 'Not Set') + '</p>' +
            '</div>' +
            '<div style="display:grid; gap:15px;">' +
                '<button onclick="agriEngine.regUnit()" style="padding:15px; border:none; border-radius:10px; background:white; box-shadow:0 2px 5px rgba(0,0,0,0.05); text-align:left;">📖 Register New Unit</button>' +
                '<button onclick="agriEngine.sendSuggestion()" style="padding:15px; border:none; border-radius:10px; background:white; box-shadow:0 2px 5px rgba(0,0,0,0.05); text-align:left;">💡 Submit Suggestion</button>' +
                '<button onclick="agriEngine.logout()" style="padding:15px; border:none; border-radius:10px; background:#fff1f1; color:red; text-align:left;">🚪 Log Out</button>' +
            '</div>' +
        '</div>';
    },
    // --- 3. JUMIA-STYLE TOOL STORE ---
    renderTools: function(view) {
        view.innerHTML = '<div style="padding:20px; font-family:sans-serif;">' +
            '<h2 style="color:#2d6a4f;">AgriTools Store</h2>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">' +
                this.tools.map(t => '<div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">' +
                    '<div style="height:100px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; font-size:40px;">'+t.img+'</div>' +
                    '<div style="padding:10px;">' +
                        '<div style="font-weight:bold; font-size:14px;">'+t.name+'</div>' +
                        '<div style="color:#e67e22; font-weight:bold;">KSh '+t.price+'</div>' +
                        '<button onclick="alert(\'Item Added\')" style="width:100%; margin-top:5px; padding:8px; background:#2d6a4f; color:white; border:none; border-radius:5px; font-size:11px;">ADD TO CART</button>' +
                    '</div>' +
                '</div>').join('') +
            '</div>' +
        '</div>';
    },
    // --- 4. MARKET & TRADE HUB ---
    renderMarket: function(view) {
        view.innerHTML = '<div style="padding:20px; font-family:sans-serif;">' +
            '<h2 style="color:#2d6a4f;">Market & Trade</h2>' +
            '<div style="background:#2d6a4f; color:white; padding:20px; border-radius:15px; margin-bottom:20px;">' +
                '<h4>🚀 Sell Your Produce</h4>' +
                '<input id="mCrop" placeholder="What are you selling?" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;">' +
                '<input id="mPrice" placeholder="Price (KSh)" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;">' +
                '<button onclick="agriEngine.postListing()" style="width:100%; padding:12px; background:#1b4332; color:white; border:none; border-radius:5px; font-weight:bold; margin-top:5px;">POST FOR SALE</button>' +
            '</div>' +
            '<h3>Recent Listings</h3>' +
            this.state.listings.map(l => '<div style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; border-left:5px solid #2d6a4f;">' +
                '<b>'+l.crop+'</b> - KSh '+l.price+'<br><small>Seller: '+l.seller+'</small>' +
            '</div>').join('') +
        '</div>';
    },
    // --- ADMIN BAR & LOGIC ---
    renderAdminBar: function() {
        const bar = document.getElementById('admin-top-bar');
        if(!this.state.isAdmin) {
            bar.innerHTML = '<div ondblclick="agriEngine.unlock()" style="background:#111; height:5px; cursor:default;"></div>';
            return;
        }
        bar.innerHTML = '<div style="background:#000; color:#0f0; padding:10px; display:flex; justify-content:space-between; font-family:monospace; font-size:11px;">' +
            '<span>[SYSTEM SECURE]</span>' +
            '<span onclick="agriEngine.setTab(\'admin\')" style="cursor:pointer; text-decoration:underline;">OPEN COMMAND CENTER</span>' +
            '<span onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();" style="cursor:pointer; color:red;">LOGOUT</span>' +
        '</div>';
    },
    renderAdminDashboard: function(view) {
        view.innerHTML = '<div style="padding:20px; font-family:sans-serif;">' +
            '<h2>⚡ Command Center</h2>' +
            '<div style="background:white; padding:15px; border-radius:10px; margin-bottom:20px;">' +
                '<h4>Student Registry ('+this.state.directory.length+')</h4>' +
                this.state.directory.map(s => '<div style="font-size:12px; border-bottom:1px solid #eee; padding:5px;">'+s.name+' ('+s.email+')</div>').join('') +
            '</div>' +
            '<div style="background:white; padding:15px; border-radius:10px;">' +
                '<h4>Suggestions ('+this.state.suggestions.length+')</h4>' +
                this.state.suggestions.map(m => '<div style="font-size:11px; background:#f9f9f9; padding:5px; margin:5px 0;"><b>'+m.from+':</b> '+m.text+'</div>').join('') +
            '</div>' +
        '</div>';
    },
    // --- LOGIC HELPERS ---
    regUnit: function() { const u = prompt("Enter Unit Name:"); if(u) { localStorage.setItem('agri_active_unit', u); this.render(); }},
    sendSuggestion: function() { 
        const m = prompt("Your Suggestion:"); 
        if(m) { 
            this.state.suggestions.push({from: this.state.user.name, text: m}); 
            localStorage.setItem('agri_suggestions', JSON.stringify(this.state.suggestions));
            alert("Sent!"); this.render(); 
        } 
    },
    postListing: function() {
        const crop = document.getElementById('mCrop').value;
        const price = document.getElementById('mPrice').value;
        if(crop && price) {
            this.state.listings.unshift({crop, price, seller: this.state.user.name});
            localStorage.setItem('agri_listings', JSON.stringify(this.state.listings));
            this.render();
        }
    },
    renderReg: function(v) { 
        v.innerHTML = '<div style="padding:40px; text-align:center;"><h3>Register to Access</h3><input id="rn" placeholder="Name" style="width:100%; padding:10px; margin:10px 0;"><button onclick="agriEngine.doReg()" style="width:100%; padding:10px; background:#2d6a4f; color:white; border:none;">JOIN</button></div>';
    },
    doReg: function() {
        const n = document.getElementById('rn').value;
        if(n) { 
            const u = {name: n, email: n.split(" ")[0]+"@agri.com"};
            localStorage.setItem('agri_student', JSON.stringify(u));
            this.state.directory.push(u);
            localStorage.setItem('agri_directory', JSON.stringify(this.state.directory));
            location.reload();
        }
    },
    unlock: function() { if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }},
    logout: function() { localStorage.removeItem('agri_student'); location.reload(); }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
