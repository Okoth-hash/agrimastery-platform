/**
 * AGRIMASTERY MASTER ENGINE v3.0
 * (c) 2026 Omondi Robin Okoth | 2 Kenya
 */
const agriEngine = {
    // --- STATE MANAGEMENT ---
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    user: JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null'),
    lang: localStorage.getItem('agri_lang') || 'en',
    // --- BILINGUAL DICTIONARY ---
    dict: {
        en: {
            brand: "AgriMastery PRO", sync: "SYSTEM ACTIVE", load: "BOOT SPEED",
            admin: "Admin Command", academy: "1,000-Page Academy", market: "Market Intel",
            glossary: "Visual Glossary", search: "Search 5,000+ terms...", resume: "Resume Manual",
            pg: "Page", nairobi: "Nairobi", eldoret: "Eldoret", price: "Price"
        },
        sw: {
            brand: "AgriMastery PRO", sync: "MFUMO UKO HAI", load: "MUDA WA KUPAKIA",
            admin: "Kidhibiti cha Admin", academy: "Chuo cha Kilimo", market: "Bei za Soko",
            glossary: "Kamusi ya Picha", search: "Tafuta maneno 5,000...", resume: "Endelea Kusoma",
            pg: "Ukurasa", nairobi: "Nairobi", eldoret: "Eldoret", price: "Bei"
        }
    },
    // --- BOOT SEQUENCE ---
    init: function() {
        this.startTime = performance.now();
        this.renderShell();
        this.syncUI();
        this.pulse();
        // Listeners for Perpetual Activity
        window.onclick = () => this.pulse();
        window.onscroll = () => this.pulse();
        console.log("AgriMastery Engine: Fully Initialized.");
    },
    // --- FORCED UI RECONSTRUCTION ---
    renderShell: function() {
        document.body.style = "margin:0; background:#f0f2f5; font-family:'Segoe UI', Tahoma, sans-serif; transition: opacity 0.5s;";
        document.body.innerHTML = \
            <div id="top-bar" style="background:#000; color:#0f0; padding:10px 20px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between; position:sticky; top:0; z-index:9999; border-bottom:2px solid #00ff88;">
                <div id="sync-status"></div>
                <div id="lang-toggle">
                    <span onclick="agriEngine.setLang('en')" style="cursor:pointer; padding:0 5px;">EN</span> | 
                    <span onclick="agriEngine.setLang('sw')" style="cursor:pointer; padding:0 5px;">SW</span>
                </div>
            </div>
            <div id="main-scroll" style="max-width:900px; margin:auto; padding:20px;">
                <div id="mod-admin"></div>
                <div id="mod-academy"></div>
                <div id="mod-market"></div>
                <div id="mod-glossary"></div>
            </div>\;
    },
    pulse: function() {
        const d = this.dict[this.lang];
        const status = document.getElementById('sync-status');
        if(status) {
            const time = new Date().toLocaleTimeString();
            const boot = (performance.now() - this.startTime).toFixed(0);
            status.innerHTML = \🛰️ \ | \: \ms | \\;
        }
    },
    setLang: function(l) {
        this.lang = l;
        localStorage.setItem('agri_lang', l);
        this.syncUI();
    },
    syncUI: function() {
        const d = this.dict[this.lang];
        // Render Admin Section
        const adminEl = document.getElementById('mod-admin');
        if(this.isAdmin) {
            adminEl.innerHTML = \<div style="background:#0b0f19; color:#00ff88; padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid #00ff88;">
                <h4 style="margin:0;">👨‍✈️ \</h4>
                <p style="font-size:11px; color:#888;">Security Level: 10 (Master)</p>
                <button onclick="agriEngine.logout()" style="background:#ef4444; border:none; color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">Exit</button>
            </div>\;
        } else {
            adminEl.innerHTML = \<div style="text-align:right; margin-bottom:10px;"><button onclick="agriEngine.login()" style="opacity:0.2; border:none; background:none;">Admin</button></div>\;
        }
        // Render Academy Section
        const academyEl = document.getElementById('mod-academy');
        const pg = this.user ? (this.user.lastPage || 1) : 0;
        academyEl.innerHTML = \<div style="background:white; padding:25px; border-radius:15px; border-left:8px solid #2d6a4f; box-shadow:0 4px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
            <h2 style="margin:0; color:#1b4332;">\</h2>
            <p style="color:#666;">\ \ / 1000</p>
            <div style="background:#eee; height:10px; border-radius:5px; margin:15px 0;"><div style="width:\%; background:#2d6a4f; height:100%; border-radius:5px;"></div></div>
            <button onclick="alert('Entering Fullscreen...')" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">\</button>
        </div>\;
        // Render Market Section
        document.getElementById('mod-market').innerHTML = \<div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:6px solid #ea580c; margin-bottom:20px;">
            <h3 style="margin:0; color:#9a3412;">📈 \</h3>
            <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:14px;">
                <span>\</span><b>KSh 4,200</b>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14px;">
                <span>\</span><b>KSh 3,800</b>
            </div>
        </div>\;
        // Render Glossary Section
        document.getElementById('mod-glossary').innerHTML = \<div style="background:white; padding:25px; border-radius:15px; border:1px solid #e5e7eb;">
            <h3 style="margin:0; color:#1b4332;">🔍 \</h3>
            <input type="text" placeholder="\" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; margin-top:15px; box-sizing:border-box;">
        </div>\;
    },
    // --- AUTH LOGIC ---
    login: function() { if(prompt("Master Key:")==="1234") { localStorage.setItem('agri_admin_active','true'); location.reload(); } },
    logout: function() { localStorage.setItem('agri_admin_active','false'); location.reload(); }
};
window.onload = () => agriEngine.init();
