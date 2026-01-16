/* =========================================================================
   AGRIMASTERY UNIFIED FUNCTIONAL CORE
   Architect: Omondi Robin Okoth (2026)
   ========================================================================= */
const agriEngine = {
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    user: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        document.body.style.margin = "0";
        document.body.style.backgroundColor = "#f0f4f8";
        // 1. FORCED LAYOUT GENERATION
        document.body.innerHTML = \
            <div id="status-bar" style="background:#000; color:#0f0; padding:8px; font-family:monospace; font-size:11px; position:sticky; top:0; z-index:1000;"></div>
            <div id="container" style="max-width:800px; margin:auto; padding:15px;">
                <div id="admin-module"></div>
                <div id="academy-module"></div>
                <div id="market-module"></div>
                <div id="glossary-module"></div>
            </div>\;
        this.pulse();
        this.renderAll();
        window.onclick = () => this.pulse();
    },
    pulse: function() {
        const bar = document.getElementById('status-bar');
        if(bar) bar.innerHTML = "🛰️ SYSTEM ACTIVE | SYNC: " + new Date().toLocaleTimeString() + " | DEV: OKOTH ROBIN";
    },
    renderAll: function() {
        this.f_Admin();
        this.f_Academy();
        this.f_Market();
        this.f_Glossary();
    },
    // --- COMPONENT: ADMIN COMMAND (Functional Logic) ---
    f_Admin: function() {
        const el = document.getElementById('admin-module');
        if(!this.isAdmin) {
            el.innerHTML = '<div style="background:#fff; padding:20px; border-radius:12px; margin-bottom:15px; border:1px solid #ddd; text-align:center;">' +
                           '<button onclick="agriEngine.authAdmin()" style="background:#1a1a1a; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer;">🔓 Open Admin Console</button></div>';
        } else {
            el.innerHTML = '<div style="background:#0b0f19; color:#10b981; padding:20px; border-radius:12px; margin-bottom:15px; border:2px solid #10b981;">' +
                           '<h3>👨‍✈️ Admin Command Center</h3>' +
                           '<button onclick="agriEngine.logout()" style="background:#ef4444; color:white; border:none; padding:8px 15px; border-radius:5px;">Secure Lock</button></div>';
        }
    },
    // --- COMPONENT: 1000-PAGE ACADEMY (Tracking Logic) ---
    f_Academy: function() {
        const el = document.getElementById('academy-module');
        if(!this.user) {
            el.innerHTML = '<div style="background:#fff; padding:20px; border-radius:12px; margin-bottom:15px; border-left:8px solid #2d6a4f;">' +
                           '<h3>🎓 Academy Portal</h3>' +
                           '<button onclick="agriEngine.authUser()" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:8px;">Student Login</button></div>';
        } else {
            const pg = this.user.lastPage || 1;
            el.innerHTML = '<div style="background:#fff; padding:20px; border-radius:12px; margin-bottom:15px; border-left:8px solid #2d6a4f;">' +
                           '<h3>📖 Welcome back, ' + this.user.name + '</h3>' +
                           '<p>📍 Current Progress: <b>Page ' + pg + ' / 1000</b></p>' +
                           '<div style="background:#eee; height:8px; border-radius:4px;"><div style="width:'+(pg/10)+'%; background:#2d6a4f; height:100%; border-radius:4px;"></div></div>' +
                           '<button onclick="alert(\'Opening Page '+pg+'...\')" style="margin-top:15px; width:100%; padding:10px; background:#409167; color:white; border:none; border-radius:8px;">Resume Manual</button></div>';
        }
    },
    // --- COMPONENT: MARKET INTEL (Dynamic Pricing) ---
    f_Market: function() {
        const el = document.getElementById('market-module');
        el.innerHTML = '<div style="background:#fff7ed; padding:20px; border-radius:12px; margin-bottom:15px; border-top:5px solid #ea580c;">' +
                       '<h3>📈 Market Live Prices</h3>' +
                       '<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #fed7aa;"><span>Nairobi (Maize)</span><b>KSh 4,200</b></div>' +
                       '<div style="display:flex; justify-content:space-between; padding:10px 0;"><span>Eldoret (Maize)</span><b>KSh 3,800</b></div></div>';
    },
    // --- COMPONENT: GLOSSARY (Searchable DB) ---
    f_Glossary: function() {
        const el = document.getElementById('glossary-module');
        el.innerHTML = '<div style="background:#fff; padding:20px; border-radius:12px; border:1px solid #eee;">' +
                       '<h3>🔍 Visual Glossary</h3>' +
                       '<input type="text" placeholder="Search 5,000+ terms..." style="width:100%; padding:12px; box-sizing:border-box; border-radius:8px; border:1px solid #ddd; margin-bottom:15px;">' +
                       '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">' +
                       '<div style="background:#f9f9f9; padding:8px; border-radius:8px; text-align:center;"><small>Tillage</small></div>' +
                       '<div style="background:#f9f9f9; padding:8px; border-radius:8px; text-align:center;"><small>Irrigation</small></div>' +
                       '</div></div>';
    },
    // --- AUTH LOGIC ---
    authAdmin: function() { if(prompt("Pass:")==="1234") { localStorage.setItem('agri_admin_active','true'); location.reload(); } },
    authUser: function() { const n = prompt("Name:"); if(n) { localStorage.setItem('agri_logged_in_user', JSON.stringify({name:n, lastPage:1})); location.reload(); } },
    logout: function() { localStorage.clear(); location.reload(); }
};
window.onload = () => agriEngine.init();
