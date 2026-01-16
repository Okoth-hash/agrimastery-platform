const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    // Protection Data
    month3: [
        { title: "Fall Armyworm", content: "Look for 'window pane' holes. Spray late evening." },
        { title: "Maize Lethal Necrosis", content: "Yellowing leaves. Uproot and burn infected plants." }
    ],
    // Spray Timing Logic
    sprayCalendar: [
        { week: "Week 2", task: "Early Weeding & Post-emergence Herbicide." },
        { week: "Week 4", task: "First FAW Spray (Top-dressing time)." },
        { week: "Week 8", task: "Second FAW Spray (Before tasseling)." }
    ],
    init: function() {
        for (let i = 1; i < 100; i++) window.clearInterval(i);
        setInterval(() => {
            const el = document.getElementById('sys-clock');
            if(el) el.innerText = new Date().toLocaleTimeString() + " | SCHEDULE LIVE";
        }, 1000);
        this.sync();
    },
    sync: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const student = JSON.parse(localStorage.getItem('agri_student'));
        this.render(view, student);
    },
    render: function(view, student) {
        let html = '';
        // 1. UPDATED ACTION PANEL
        html += '<div class="card" style="border-bottom: 3px solid #ffcc00;">' +
                '<h3>🛠️ Farmer Tools</h3>' +
                '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">' +
                '<button class="btn" onclick="agriEngine.calcYield()">📊 Yield Calc</button>' +
                '<button class="btn" onclick="agriEngine.showSchedule()" style="background:#4361ee;">📅 Spray Sked</button>' +
                '<button class="btn" onclick="agriEngine.contactDev()" style="background:#25d366; color:white;">💬 Support</button>' +
                '<button class="btn" onclick="agriEngine.reset()" style="background:#500;">⚠️ Reset</button>' +
                '</div></div>';
        // 2. SPRAY SCHEDULE DISPLAY
        html += '<div class="card" id="sked-view" style="display:none; background:#1a1a1a; border:1px solid #4361ee;">' +
                '<h3 style="color:#4361ee;">📅 Protection Calendar</h3>';
        this.sprayCalendar.forEach(s => {
            html += '<div style="margin-bottom:8px; border-bottom:1px solid #333; padding-bottom:4px;">' +
                    '<b style="color:#ffcc00;">' + s.week + ':</b> ' + s.task + '</div>';
        });
        html += '<button class="btn" style="width:100%; font-size:10px;" onclick="document.getElementById(\'sked-view\').style.display=\'none\'">Close Calendar</button></div>';
        // 3. ACADEMY
        if(!student) {
            html += '<div class="card"><h3>🎓 Enrollment</h3>' +
                    '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:10px; background:#111; color:white; border:1px solid #333;">' +
                    '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.enroll()">Register</button></div>';
        } else {
            const m3Step = student.m3Step || 0;
            html += '<div class="card" style="border-left: 5px solid #e63946;">' +
                    '<h3>🐛 Current Phase: Protection</h3>' +
                    '<h4>' + (this.month3[m3Step]?.title || "Month 3 Complete") + '</h4>' +
                    '<p>' + (this.month3[m3Step]?.content || "You are now a certified Master Farmer.") + '</p>' +
                    (m3Step < this.month3.length ? '<button class="btn" style="width:100%; background:#e63946;" onclick="agriEngine.nextM3()">Next Lesson</button>' : '') +
                    '</div>';
        }
        // 4. BRANDING
        html += '<div class="card" style="background:#0a0a0a; border:1px solid #444;">' +
                '<div id="sys-clock" style="color:lime; font-family:monospace; font-size:12px;"></div>' +
                '<p style="font-size:0.8em; margin:5px 0;">Developer: ' + this.author.name + '</p>' +
                '</div>';
        view.innerHTML = html;
    },
    showSchedule: function() {
        document.getElementById('sked-view').style.display = 'block';
    },
    enroll: function() {
        const n = document.getElementById('sName').value;
        if(n) { localStorage.setItem('agri_student', JSON.stringify({name: n, m3Step: 0})); this.sync(); }
    },
    nextM3: function() {
        let s = JSON.parse(localStorage.getItem('agri_student'));
        s.m3Step++; localStorage.setItem('agri_student', JSON.stringify(s)); this.sync();
    },
    calcYield: function() {
        const acres = prompt("Enter acreage:");
        if(acres) alert("Potential: " + (acres * 28) + " bags. Follow the spray schedule to reach this!");
    },
    contactDev: function() { window.location.href = "https://wa.me/" + this.author.phone; },
    reset: function() { if(confirm("Clear system?")) { localStorage.clear(); location.reload(); } }
};
agriEngine.init();
