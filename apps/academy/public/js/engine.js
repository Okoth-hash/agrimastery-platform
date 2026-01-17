/**
 * AGRIMASTERY MODULAR ENGINE
 * Each module is isolated to prevent displacement of content.
 */
const agriEngine = {
    // --- MODULE 1: PERSISTENCE LAYER ---
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        page: parseInt(localStorage.getItem('agri_progress')) || 1
    },
    // --- MODULE 2: CONTENT REPOSITORY (The Manual) ---
    chapters: [
        { id: 1, title: "Soil Chemistry", content: "Focus on Nitrogen levels for early maize growth." },
        { id: 2, title: "Seed Selection", content: "Choose certified hybrids for Kenya's Climate." },
        { id: 3, title: "Irrigation", content: "Drip irrigation reduces water waste by 60%." },
        { id: 4, title: "Pest Control", content: "Monitoring for Fall Armyworm is critical in weeks 3-5." }
    ],
    // --- MODULE 3: MARKET INTELLIGENCE ---
    market: [
        { loc: "Nairobi", price: "4,200" },
        { loc: "Eldoret", price: "3,800" }
    ],
    // --- MAIN RENDERER (Organizes all modules) ---
    init: function() {
        document.body.innerHTML = '<div id="app-viewport" style="background:#f0f2f5; min-height:100vh; font-family:sans-serif; margin:0;"></div>';
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        if (!this.state.user) {
            this.showRegistration(view);
        } else {
            this.showDashboard(view);
        }
    },
    showRegistration: function(view) {
        view.innerHTML = '<div style="max-width:400px; margin:auto; padding-top:50px;">' +
            '<div style="background:white; padding:30px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.1);">' +
                '<h2>Student Enrollment</h2>' +
                '<input type="text" id="uName" placeholder="Name" style="width:100%; padding:12px; margin:10px 0; border:1px solid #ddd; border-radius:8px;">' +
                '<button onclick="agriEngine.login()" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Access Manual</button>' +
            '</div>' +
        '</div>';
    },
    showDashboard: function(view) {
        const ch = this.chapters.find(c => c.id === this.state.page) || this.chapters[0];
        view.innerHTML = '<div style="background:#000; color:#0f0; padding:10px; font-family:monospace; font-size:11px; display:flex; justify-content:space-between;">' +
            '<span>USER: ' + this.state.user.name + '</span>' +
            '<span>ACADEMY PAGE: ' + this.state.page + ' / 1000</span>' +
        '</div>' +
        '<div style="max-width:800px; margin:auto; padding:20px;">' +
            '' +
            '<div style="background:white; padding:25px; border-radius:15px; border-left:8px solid #2d6a4f; margin-bottom:20px;">' +
                '<h3>' + ch.title + '</h3>' +
                '<p>' + ch.content + '</p>' +
                '<div style="display:flex; justify-content:space-between; margin-top:20px;">' +
                    '<button onclick="agriEngine.move(-1)" style="padding:10px 20px;">Back</button>' +
                    '<button onclick="agriEngine.move(1)" style="padding:10px 20px; background:#2d6a4f; color:white; border:none; border-radius:5px;">Next</button>' +
                '</div>' +
            '</div>' +
            '' +
            '<div style="background:#fff7ed; padding:20px; border-radius:15px; border-top:4px solid #ea580c;">' +
                '<h4>Market Prices</h4>' +
                this.market.map(m => '<div style="display:flex; justify-content:space-between;"><span>'+m.loc+'</span><b>KSh '+m.price+'</b></div>').join('') +
            '</div>' +
        '</div>';
    },
    login: function() {
        const n = document.getElementById('uName').value;
        if(n) {
            localStorage.setItem('agri_student', JSON.stringify({name: n}));
            location.reload();
        }
    },
    move: function(dir) {
        this.state.page += dir;
        if(this.state.page < 1) this.state.page = 1;
        localStorage.setItem('agri_progress', this.state.page);
        this.render();
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
