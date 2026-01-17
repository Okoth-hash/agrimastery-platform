const agriEngine = {
    chapters: [
        { id: 1, title: "Soil Chemistry & Preparation", content: "Understanding soil pH and nutrient density is the foundation of high-yield maize farming. Before planting, ensure your soil is tested for Nitrogen, Phosphorus, and Potassium levels." },
        { id: 2, title: "Seed Selection & Germination", content: "Selecting the right hybrid for your ecological zone (Highland vs. Lowland) determines 40% of your final yield. Check the seed bag for the germination rate percentage." },
        { id: 3, title: "Advanced Irrigation Techniques", content: "Maximizing water efficiency using drip systems and mulching preserves moisture and reduces fertilizer leaching during the early growth stages." }
    ],
    init: function() {
        this.user = JSON.parse(localStorage.getItem('agri_student'));
        this.currentPage = parseInt(localStorage.getItem('agri_progress')) || 1;
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        if (!view) return;
        if (!this.user) {
            view.innerHTML = '<div style="background:white; padding:40px; border-radius:20px; box-shadow:0 10px 40px rgba(0,0,0,0.1); max-width:450px; margin:40px auto; text-align:center;">' +
                '<h1 style="color:#1b4332;">AgriMastery Academy</h1>' +
                '<p>Enter your details to unlock the 1,000-page manual.</p>' +
                '<input type="text" id="regName" placeholder="Full Name" style="width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #ddd; box-sizing:border-box;">' +
                '<input type="text" id="regPhone" placeholder="WhatsApp Number" style="width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #ddd; box-sizing:border-box;">' +
                '<button onclick="agriEngine.saveUser()" style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">BEGIN CERTIFICATION</button>' +
            '</div>';
        } else {
            const current = this.chapters.find(c => c.id === this.currentPage) || this.chapters[0];
            view.innerHTML = '<div style="background:#000; color:#0f0; padding:10px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between;">' +
                '<span>STUDENT: ' + this.user.name.toUpperCase() + '</span>' +
                '<span>PAGE ' + this.currentPage + ' / 1000</span>' +
            '</div>' +
            '<div style="max-width:800px; margin:auto; padding:20px;">' +
                '<div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05); min-height:400px;">' +
                    '<h2 style="color:#2d6a4f;">Chapter ' + current.id + ': ' + current.title + '</h2>' +
                    '<p style="line-height:1.8; font-size:17px;">' + current.content + '</p>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between; margin-top:20px;">' +
                    '<button onclick="agriEngine.prevPage()" style="padding:15px 30px; border-radius:10px; border:1px solid #ddd; background:white; cursor:pointer;">Previous</button>' +
                    '<button onclick="agriEngine.nextPage()" style="padding:15px 30px; border-radius:10px; border:none; background:#2d6a4f; color:white; font-weight:bold; cursor:pointer;">Next Chapter</button>' +
                '</div>' +
            '</div>';
        }
    },
    saveUser: function() {
        const n = document.getElementById('regName').value;
        const p = document.getElementById('regPhone').value;
        if(n && p) {
            localStorage.setItem('agri_student', JSON.stringify({name: n, phone: p}));
            location.reload();
        }
    },
    nextPage: function() { if(this.currentPage < 1000) { this.currentPage++; localStorage.setItem('agri_progress', this.currentPage); this.render(); window.scrollTo(0,0); } },
    prevPage: function() { if(this.currentPage > 1) { this.currentPage--; localStorage.setItem('agri_progress', this.currentPage); this.render(); window.scrollTo(0,0); } }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
