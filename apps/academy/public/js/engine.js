/**
 * AGRIMASTERY MASTER MANUAL ENGINE v10.0
 * Author: Omondi Robin Okoth
 * Features: 1000-Page Structure, Registration, & Progress Vault
 */
const agriEngine = {
    // 1. DATA REPOSITORY (The beginning of your 1,000 pages)
    chapters: [
        { id: 1, title: "Soil Chemistry & Preparation", content: "Understanding soil pH and nutrient density is the foundation of high-yield maize farming..." },
        { id: 2, title: "Seed Selection & Germination", content: "Selecting the right hybrid for your ecological zone (Highland vs. Lowland)..." },
        { id: 3, title: "Advanced Irrigation Techniques", content: "Maximizing water efficiency using drip systems and mulching..." }
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
            this.renderRegistration(view);
        } else {
            this.renderManual(view);
        }
    },
    renderRegistration: function(view) {
        view.innerHTML = \
            <div style="background:white; padding:40px; border-radius:20px; box-shadow:0 10px 40px rgba(0,0,0,0.1); max-width:450px; margin:40px auto; text-align:center;">
                <h1 style="color:#1b4332; font-size:24px;">AgriMastery Academy</h1>
                <p style="color:#666;">Enter your details to unlock the 1,000-page Professional Manual.</p>
                <input type="text" id="regName" placeholder="Full Name" style="width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #ddd; box-sizing:border-box;">
                <input type="text" id="regPhone" placeholder="WhatsApp Number" style="width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #ddd; box-sizing:border-box;">
                <button onclick="agriEngine.saveUser()" style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; margin-top:10px;">BEGIN CERTIFICATION</button>
            </div>\;
    },
    renderManual: function(view) {
        const currentChapter = this.chapters.find(c => c.id === this.currentPage) || this.chapters[0];
        view.innerHTML = \
            <div style="background:#000; color:#0f0; padding:10px 20px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between;">
                <span>STUDENT: \</span>
                <span>PAGE \ / 1000</span>
            </div>
            <div style="max-width:800px; margin:auto; padding:20px;">
                <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05); min-height:400px;">
                    <h2 style="color:#2d6a4f; border-bottom:2px solid #f0f2f5; padding-bottom:10px;">Chapter \: \</h2>
                    <p style="line-height:1.8; color:#333; font-size:17px;">\</p>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:20px;">
                    <button onclick="agriEngine.prevPage()" style="padding:15px 30px; border-radius:10px; border:1px solid #ddd; background:white; cursor:pointer;">Previous</button>
                    <button onclick="agriEngine.nextPage()" style="padding:15px 30px; border-radius:10px; border:none; background:#2d6a4f; color:white; font-weight:bold; cursor:pointer;">Next Chapter</button>
                </div>
                <p style="text-align:center; margin-top:30px;"><a href="#" onclick="agriEngine.reset()" style="color:#ef4444; font-size:12px;">Logout & Exit Manual</a></p>
            </div>\;
    },
    saveUser: function() {
        const name = document.getElementById('regName').value;
        const phone = document.getElementById('regPhone').value;
        if(name && phone) {
            localStorage.setItem('agri_student', JSON.stringify({name, phone}));
            location.reload();
        }
    },
    nextPage: function() {
        if(this.currentPage < 1000) {
            this.currentPage++;
            localStorage.setItem('agri_progress', this.currentPage);
            this.render();
            window.scrollTo(0,0);
        }
    },
    prevPage: function() {
        if(this.currentPage > 1) {
            this.currentPage--;
            localStorage.setItem('agri_progress', this.currentPage);
            this.render();
            window.scrollTo(0,0);
        }
    },
    reset: function() {
        if(confirm("Exit and reset progress?")) {
            localStorage.clear();
            location.reload();
        }
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());