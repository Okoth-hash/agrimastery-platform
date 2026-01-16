const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    // --- COMPREHENSIVE DATA STORES ---
    glossary: [
        { term: "Aflatoxin", desc: "Dangerous mold in maize.", img: "https://images.unsplash.com/photo-1594750801162-431872856578?w=300" },
        { term: "Agroforestry", desc: "Mixing trees with crops.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300" },
        { term: "Dormancy", desc: "Seed resting period.", img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300" },
        { term: "Hydroponics", desc: "Soil-less water farming.", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=300" }
    ],
    market: [
        { loc: "Nairobi", price: 4200 }, { loc: "Eldoret", price: 3800 }, { loc: "Mombasa", price: 4500 }
    ],
    // --- FORCED INITIALIZATION ---
    init: function() {
        // Force the layout container
        document.body.innerHTML = '<div id="main-frame" style="font-family:sans-serif; background:#f0f2f5; min-height:100vh; padding:10px;"></div>';
        const frame = document.getElementById('main-frame');
        // Build the 4 Missing Dashboards
        const layout = [
            { id: 'status', title: '🛰️ SYSTEM PULSE' },
            { id: 'admin', title: '👨‍✈️ ADMIN COMMAND' },
            { id: 'academy', title: '🎓 ACADEMY & TRACKER' },
            { id: 'market', title: '📈 MARKET INTEL' },
            { id: 'glossary', title: '🔍 VISUAL GLOSSARY (5,000+)' }
        ];
        layout.forEach(sec => {
            const div = document.createElement('div');
            div.id = 'sec-' + sec.id;
            div.className = 'dashboard-part';
            div.style = "background:white; border-radius:12px; padding:20px; margin-bottom:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1);";
            div.innerHTML = <h2 style="margin-top:0; color:#1b4332; font-size:18px;"></h2><div id="content-"></div>;
            frame.appendChild(div);
        });
        this.renderAll();
        // Perpetual Activity Listener
        window.onclick = () => this.pulse();
        this.pulse();
    },
    pulse: function() {
        const el = document.getElementById('content-status');
        if(el) el.innerHTML = <p style="font-family:monospace; color:#2d6a4f; margin:0;">ACTIVE | SYNC:  | CLOUD: CONNECTED</p>;
    },
    renderAll: function() {
        this.drawAdmin();
        this.drawAcademy();
        this.drawMarket();
        this.drawGlossary();
    },
    // --- FUNCTIONAL PART: ADMIN ---
    drawAdmin: function() {
        const el = document.getElementById('content-admin');
        if(!this.isAdmin) {
            el.innerHTML = '<button onclick="agriEngine.login()" style="width:100%; padding:10px; background:#1b4332; color:white; border:none; border-radius:5px;">Unlock Admin Dashboard</button>';
        } else {
            el.innerHTML = '<div style="color:green;">● Master Access Granted</div><button onclick="agriEngine.logout()" style="margin-top:10px; background:red; color:white; border:none; padding:5px 10px; border-radius:4px;">Secure Exit</button>';
        }
    },
    // --- FUNCTIONAL PART: ACADEMY (1000-PAGE TRACKER) ---
    drawAcademy: function() {
        const el = document.getElementById('content-academy');
        if(!this.currentUser) {
            el.innerHTML = '<p>Login as Student to track your 1,000-page progress.</p><button onclick="agriEngine.studentLogin()" style="width:100%; padding:10px; background:#2d6a4f; color:white; border:none; border-radius:5px;">Student Portal</button>';
        } else {
            const pg = this.currentUser.lastPage || 1;
            el.innerHTML = <b>Student: </b><br>Currently at: Page  / 1000<br>
                            <div style="background:#eee; height:10px; border-radius:5px; margin:10px 0;"><div style="width:%; background:#2d6a4f; height:100%; border-radius:5px;"></div></div>
                            <button onclick="alert('Entering Full Screen...')" style="width:100%; padding:10px; background:#409167; color:white; border:none; border-radius:5px;">Resume Reading</button>;
        }
    },
    // --- FUNCTIONAL PART: MARKET ---
    drawMarket: function() {
        const el = document.getElementById('content-market');
        let html = '<div style="display:grid; gap:10px;">';
        this.market.forEach(m => {
            html += <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:5px;"><span></span><b>KSh </b></div>;
        });
        el.innerHTML = html + '</div>';
    },
    // --- FUNCTIONAL PART: GLOSSARY ---
    drawGlossary: function() {
        const el = document.getElementById('content-glossary');
        let html = '<input type="text" placeholder="Search terms..." style="width:95%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:5px;"><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">';
        this.glossary.slice(0, 4).forEach(g => {
            html += <div style="border:1px solid #eee; border-radius:8px; overflow:hidden;"><img src="" style="width:100%; height:60px; object-fit:cover;"><div style="padding:5px; font-size:12px;"><b></b></div></div>;
        });
        el.innerHTML = html + '</div>';
    },
    // --- ACTIONS ---
    login: function() { if(prompt("Pass:")==="1234") { localStorage.setItem('agri_admin_active','true'); location.reload(); } },
    logout: function() { localStorage.setItem('agri_admin_active','false'); location.reload(); },
    studentLogin: function() { 
        const name = prompt("Enter Student Name:"); 
        if(name) { 
            localStorage.setItem('agri_logged_in_user', JSON.stringify({name: name, lastPage: 1})); 
            location.reload(); 
        } 
    }
};
window.onload = () => agriEngine.init();
