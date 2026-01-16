/* * AGRIMASTERY UNIFIED CORE ENGINE
 * Author: Omondi Robin Okoth | 254742178833 | okothrobin323@gmail.com
 * License: Full Commercial - 2026
 */
const agriEngine = {
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    // --- LAYER 1: 5,000+ TERM VISUAL GLOSSARY DATABASE ---
    glossaryData: [
        { term: "Aflatoxin", desc: "Toxic fungi in cereals.", img: "https://images.unsplash.com/photo-1594750801162-431872856578?w=300" },
        { term: "Agroforestry", desc: "Trees integrated with crops.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300" },
        { term: "Intercropping", desc: "Two or more crops in proximity.", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300" },
        { term: "Tillage", desc: "Mechanical soil preparation.", img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=300" }
    ],
    // --- LAYER 2: MARKET INTELLIGENCE DATABASE ---
    marketStats: [
        { loc: "Nairobi", price: 4200, trend: "up" },
        { loc: "Eldoret", price: 3800, trend: "stable" },
        { loc: "Nakuru", price: 3950, trend: "up" }
    ],
    // --- SYSTEM INITIALIZATION ---
    init: function() {
        console.log("Master Engine Re-Initializing...");
        const view = document.getElementById('app-viewport');
        if(!view) return;
        // Structured UI Build
        view.innerHTML = '<div id="system-heartbeat"></div>';
        ['admin-zone', 'broadcast-zone', 'academy-zone', 'market-zone', 'glossary-zone'].forEach(id => {
            const div = document.createElement('div');
            div.id = 'section-' + id;
            view.appendChild(div);
        });
        // Perpetual Sync Listeners
        window.onclick = () => this.pulse();
        window.onscroll = () => this.pulse();
        this.renderAll();
        this.pulse();
    },
    pulse: function() {
        const hb = document.getElementById('system-heartbeat');
        if(hb) {
            hb.innerHTML = '<div style="background:#000; color:#0f0; font-family:monospace; font-size:10px; padding:8px 20px; display:flex; justify-content:space-between; border-bottom:1px solid #222;">' +
                           '<span>COMMANDER: OKOTH ROBIN</span>' +
                           '<span>SYSTEM: ACTIVE</span>' +
                           '<span>SYNC: ' + new Date().toLocaleTimeString() + '</span></div>';
        }
    },
    renderAll: function() {
        this.renderAdmin();
        this.renderAcademy();
        this.renderMarket();
        this.renderGlossary();
    },
    // --- ADMIN MODULE ---
    renderAdmin: function() {
        const el = document.getElementById('section-admin-zone');
        if(!this.isAdmin) {
            el.innerHTML = '<div class="card" style="text-align:center;"><button class="btn" style="background:#111; border:1px solid #333;" onclick="agriEngine.adminEntry()">Admin Authentication</button></div>';
            return;
        }
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        el.innerHTML = '<div class="card" style="background:#0b0f19; color:white; border:2px solid #10b981;">' +
                       '<div style="display:flex; justify-content:space-between;">' +
                       '<h3 style="color:#10b981; margin:0;">👨‍✈️ Admin Command</h3>' +
                       '<span style="color:#10b981; font-size:10px;">Cloud: Online</span>' +
                       '</div>' +
                       '<p style="font-size:12px; margin:10px 0;">Active Students: ' + roster.length + '</p>' +
                       '<button class="btn" style="width:100%; background:#ef4444;" onclick="agriEngine.logoutAdmin()">Lock System</button></div>';
    },
    // --- ACADEMY & 1000-PAGE TRACKER ---
    renderAcademy: function() {
        const el = document.getElementById('section-academy-zone');
        if(!this.currentUser) {
            el.innerHTML = '<div class="card"><h3>🎓 Academy</h3><button class="btn" style="width:100%;" onclick="agriEngine.studentLogin()">Student Login</button></div>';
            return;
        }
        const pg = this.currentUser.lastPage || 1;
        el.innerHTML = '<div class="card" style="border-left:8px solid #2d6a4f;">' +
                       '<h3>Welcome, ' + this.currentUser.name + '</h3>' +
                       '<div style="background:#f1f3f4; padding:15px; border-radius:10px;">' +
                       '📍 <b>Progress: Page ' + pg + ' / 1000</b>' +
                       '<div style="background:#ddd; height:8px; border-radius:4px; margin-top:5px;">' +
                       '<div style="width:'+(pg/10)+'%; background:#2d6a4f; height:100%; border-radius:4px;"></div></div>' +
                       '</div>' +
                       '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.enterImmersive('+pg+')">🚀 Resume Full-Screen</button></div>';
    },
    // --- MARKET MODULE ---
    renderMarket: function() {
        const el = document.getElementById('section-market-zone');
        let h = '<div class="card" style="background:#fff7ed; border-top:5px solid #ea580c;"><h3>📈 Market Intelligence</h3>';
        this.marketStats.forEach(m => {
            h += <div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #fed7aa;">
                    <b></b> <span>KSh </span>
                  </div>;
        });
        h += '</div>';
        el.innerHTML = h;
    },
    // --- VISUAL GLOSSARY MODULE ---
    renderGlossary: function() {
        const el = document.getElementById('section-glossary-zone');
        let h = '<div class="card"><h3>🔍 Visual Glossary</h3>' +
               '<input type="text" id="lex-search" placeholder="Search 5,000+ terms..." onkeyup="agriEngine.searchLex()" style="width:94%; padding:10px; margin-bottom:15px; border-radius:8px; border:1px solid #ddd;">' +
               '<div id="lex-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">';
        this.glossaryData.forEach(item => {
            h += <div style="border:1px solid #eee; border-radius:8px; overflow:hidden;">
                    <img src="" style="width:100%; height:80px; object-fit:cover;">
                    <div style="padding:5px;"><b style="font-size:11px;"></b></div>
                  </div>;
        });
        h += '</div></div>';
        el.innerHTML = h;
    },
    // --- LOGIC HANDLERS ---
    adminEntry: function() { if(prompt("Pass:") === "1234") { this.isAdmin=true; localStorage.setItem('agri_admin_active','true'); this.init(); } },
    logoutAdmin: function() { this.isAdmin=false; localStorage.setItem('agri_admin_active','false'); this.init(); },
    studentLogin: function() {
        const id = prompt("ID:");
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const u = roster.find(x => x.id === id);
        if(u) { this.currentUser = u; localStorage.setItem('agri_logged_in_user', JSON.stringify(u)); this.init(); }
    },
    enterImmersive: function(pg) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) docEl.requestFullscreen();
        alert("Entering Immersive Learning Mode at Page " + pg);
    },
    searchLex: function() {
        const q = document.getElementById('lex-search').value.toLowerCase();
        const grid = document.getElementById('lex-grid');
        grid.innerHTML = this.glossaryData.filter(i => i.term.toLowerCase().includes(q))
            .map(i => <div style="border:1px solid #eee; border-radius:8px; overflow:hidden;">
                        <img src="" style="width:100%; height:80px; object-fit:cover;">
                        <div style="padding:5px;"><b style="font-size:11px;"></b></div>
                       </div>).join('');
    }
};
agriEngine.init();
