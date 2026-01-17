const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    lang: localStorage.getItem('agri_lang') || 'en',
    user: JSON.parse(localStorage.getItem('agri_logged_in_user') || 'null'),
    dict: {
        en: { 
            export: "Download Progress as PDF", 
            loading: "Generating E-Book...",
            title: "AgriMastery Personal Farming Manual"
        },
        sw: { 
            export: "Pakua Maendeleo kama PDF", 
            loading: "Inatengeneza Kitabu...",
            title: "Mwongozo wa Kilimo wa AgriMastery"
        }
    },
    init: function() {
        // Load the PDF Library via CDN dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
        this.renderAll();
    },
    renderAll: function() {
        const d = this.dict[this.lang];
        document.body.style = "margin:0; background:#f0f2f5; font-family:sans-serif;";
        document.body.innerHTML = \
            <div id="pdf-content" style="padding:40px; background:white; display:none;">
                <h1 style="color:#2d6a4f;">\</h1>
                <hr>
                <h3>Student Name: \</h3>
                <p>Current Progress: Page \ of 1,000</p>
                <p style="font-size:12px; color:#666;">Generated on: \</p>
                <div style="margin-top:20px; border:1px solid #ddd; padding:20px;">
                    [Chapter Content Placeholder for 1,000-Page Repository]
                </div>
            </div>
            <div style="max-width:800px; margin:auto; padding:20px;">
                <div style="background:white; padding:30px; border-radius:15px; border-left:10px solid #2d6a4f; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="margin:0;">📄 \</h2>
                    <p style="color:#666; margin-bottom:20px;">Convert your training into an offline e-book.</p>
                    <button onclick="agriEngine.generatePDF()" id="pdf-btn" style="width:100%; padding:15px; background:#1b4332; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">
                        📥 START EXPORT
                    </button>
                </div>
            </div>\;
    },
    generatePDF: function() {
        const d = this.dict[this.lang];
        const btn = document.getElementById('pdf-btn');
        const element = document.getElementById('pdf-content');
        btn.innerText = d.loading;
        btn.style.opacity = "0.5";
        element.style.display = "block";
        const opt = {
            margin: 1,
            filename: 'AgriMastery_Manual.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = "none";
            btn.innerText = "✅ EXPORT COMPLETE";
            btn.style.opacity = "1";
        });
    }
};
window.onload = () => agriEngine.init();
