const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'academy'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.renderAcademy();
    },
    renderAcademy: function() {
        const el = document.getElementById('section-academy');
        if(!el) return;
        if(!this.currentUser) {
            el.innerHTML = '<div class="card"><h3>🎓 Academy</h3><button class="btn" onclick="agriEngine.loginPrompt()">Login</button></div>';
            return;
        }
        const lastPage = this.currentUser.lastPage || 1;
        const progress = Math.round((lastPage / 1000) * 100);
        el.innerHTML = '<div class="card" style="border-left:5px solid #2d6a4f;">' +
                       '<h3>👋 Welcome Back, ' + this.currentUser.name + '</h3>' +
                       '<div style="background:#f1f3f4; padding:15px; border-radius:10px; margin-bottom:15px;">' +
                       '📍 <b>Last Location:</b> Page ' + lastPage + ' of 1000<br>' +
                       '<div style="background:#ddd; height:8px; border-radius:4px; margin-top:5px;">' +
                       '<div style="width:'+progress+'%; background:#409167; height:100%; border-radius:4px;"></div></div>' +
                       '</div>' +
                       '<button class="btn" style="width:100%;" onclick="agriEngine.resumeCourse('+lastPage+')">📖 Resume Exactly Here</button>' +
                       '</div>';
    },
    resumeCourse: function(page) {
        alert("Navigating to 1,000-page manual: Currently loading Page " + page + "...");
        // This would trigger the full-screen immersive view from previous steps
    },
    // Save bookmark whenever they navigate
    updateBookmark: function(pageNum) {
        this.currentUser.lastPage = pageNum;
        localStorage.setItem('agri_logged_in_user', JSON.stringify(this.currentUser));
        // Update the Master Roster
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const idx = roster.findIndex(u => u.id === this.currentUser.id);
        if(idx !== -1) {
            roster[idx].lastPage = pageNum;
            localStorage.setItem('agri_master_roster', JSON.stringify(roster));
        }
    },
    loginPrompt: function() {
        const id = prompt("Enter Student ID:");
        const roster = JSON.parse(localStorage.getItem('agri_master_roster') || "[]");
        const user = roster.find(u => u.id === id);
        if(user) {
            this.currentUser = user;
            localStorage.setItem('agri_logged_in_user', JSON.stringify(user));
            this.sync();
        } else { alert("ID not found."); }
    }
};
agriEngine.init();
