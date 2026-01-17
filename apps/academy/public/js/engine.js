const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    lang: localStorage.getItem('agri_lang') || 'en',
    // --- TRANSLATION DICTIONARY ---
    dict: {
        en: {
            welcome: "Welcome", academy: "Academy", market: "Market Intel", glossary: "Glossary",
            admin: "Admin Console", page: "Page", search: "Search 5,000+ terms...",
            resume: "Resume Reading", sync: "SYNC ACTIVE", load: "LOAD TIME"
        },
        sw: {
            welcome: "Karibu", academy: "Chuo cha Kilimo", market: "Bei za Soko", glossary: "Kamusi ya Picha",
            admin: "Kidhibiti cha Admin", page: "Ukurasa", search: "Tafuta maneno 5,000...",
            resume: "Endelea Kusoma", sync: "MFUMO UKO HAI", load: "MUDA WA KUPAKIA"
        }
    },
    init: function() {
        this.isAdmin = localStorage.getItem('agri_admin_active') === 'true';
        this.user = JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null');
        this.renderAll();
    },
    setLanguage: function(l) {
        this.lang = l;
        localStorage.setItem('agri_lang', l);
        this.renderAll();
    },
    renderAll: function() {
        const d = this.dict[this.lang];
        document.body.style = "margin:0; background:#f4f7f6; font-family:sans-serif;";
        document.body.innerHTML = \
            <div id="p6-status" style="background:#000; color:#0f0; padding:10px; font-family:monospace; font-size:10px; display:flex; justify-content:space-between;">
                <span>🚀 \</span>
                <div>
                    <button onclick="agriEngine.setLanguage('en')" style="background:none; border:none; color:white; cursor:pointer; font-weight:\">EN</button> |
                    <button onclick="agriEngine.setLanguage('sw')" style="background:none; border:none; color:white; cursor:pointer; font-weight:\">SW</button>
                </div>
            </div>
            <div style="max-width:800px; margin:auto; padding:20px;">
                <h2 style="color:#1b4332;">\, \</h2>
                <div id="academy-p6" style="background:white; padding:20px; border-radius:12px; border-left:6px solid #2d6a4f; margin-bottom:15px;">
                    <h3>🎓 \</h3>
                    <p>\ \ / 1000</p>
                    <button style="width:100%; padding:10px; background:#2d6a4f; color:white; border:none; border-radius:8px;">\</button>
                </div>
                <div id="market-p6" style="background:#fff7ed; padding:15px; border-radius:12px; border-top:4px solid #ea580c; margin-bottom:15px;">
                    <b>📈 \</b>
                </div>
                <div id="glossary-p6" style="background:white; padding:20px; border-radius:12px; border:1px solid #eee;">
                    <h3>🔍 \</h3>
                    <input type="text" placeholder="\" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;">
                </div>
            </div>\;
    }
};
window.onload = () => agriEngine.init();
