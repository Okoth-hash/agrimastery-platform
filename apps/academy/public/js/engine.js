/**
 * AGRIMASTERY UNIFIED ENGINE v4.0 (REACTIVATED)
 * Integrated: Admin, Academy, Market, Glossary, PDF Export
 */
const agriEngine = {
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    user: JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null'),
    lang: localStorage.getItem('agri_lang') || 'en',
    dict: {
        en: { 
            status: "SYSTEM ACTIVE", academy: "Academy (1,000 Pages)", 
            market: "Market Intel", glossary: "Visual Glossary", 
            pdf: "Export E-Book", admin: "Admin Console"
        },
        sw: { 
            status: "MFUMO UKO HAI", academy: "Chuo cha Kilimo", 
            market: "Bei za Soko", glossary: "Kamusi ya Picha", 
            pdf: "Pakua Kitabu", admin: "Kidhibiti cha Admin"
        }
    },
    init: function() {
        // Load PDF Library Dependencies
        const pdfScript = document.createElement('script');
        pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(pdfScript);
        this.renderUI();
        this.pulse();
        // Perpetual Persistence Listeners
        window.onclick = () => this.pulse();
        window.onscroll = () => this.pulse();
    },
    pulse: function() {
        const d = this.dict[this.lang];
        const bar = document.getElementById('status-bar');
        if(bar) {
            bar.innerHTML = \<span>🛰️ \</span> <span>\</span>\;
        }
    },
    renderUI: function() {
        const d = this.dict[this.lang];
        document.body.style = "margin:0; background:#f0f2f5; font-family:sans-serif;";
        document.body.innerHTML = \
            <div id="status-bar" style="background:#000; color:#0f0; padding:10px 20px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between; position:sticky; top:0; z-index:9999;"></div>
            <div style="max-width:900px; margin:auto; padding:20px;">
                <div id="sec-admin" style="margin-bottom:15px;">\
                </div>
                <div style="background:white; padding:25px; border-radius:15px; border-left:8px solid #2d6a4f; box-shadow:0 4px 6px rgba(0,0,0,0.05); margin-bottom:20px;">
                    <h2>🎓 \</h2>
                    <p>Current Progress: \ / 1000</p>
                    <button onclick="agriEngine.exportPDF()" style="background:#1b4332; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">📥 \</button>
                </div>
                <div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:5px solid #ea580c; margin-bottom:20px;">
                    <h3>📈 \</h3>
                    <div style="display:flex; justify-content:space-between;"><span>Nairobi</span><b>KSh 4,200</b></div>
                </div>
                <div style="background:white; padding:20px; border-radius:15px; border:1px solid #ddd;">
                    <h3>🔍 \</h3>
                    <input type="text" placeholder="Search..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc;">
                </div>
            </div>
            <div id="pdf-template" style="display:none; padding:50px;">
                <h1>AgriMastery Farming Manual</h1>
                <p>Student: \</p>
                <p>Progress achieved in 2026.</p>
            </div>\;
    },
    exportPDF: function() {
        const element = document.getElementById('pdf-template');
        element.style.display = "block";
        html2pdf().from(element).save().then(() => { element.style.display = "none"; });
    },
    login: function() { if(prompt("Key:")==="1234") { localStorage.setItem('agri_admin_active','true'); location.reload(); } }
};
window.onload = () => agriEngine.init();
