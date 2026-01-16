const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    currentUser: JSON.parse(localStorage.getItem('agri_logged_in_user')),
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['academy'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('academy', this.getAcademyHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getAcademyHtml: function() {
        if(!this.currentUser) return '<div class="card"><h3>🎓 Portal Login</h3><p>Please enter your ID.</p></div>';
        return '<div class="card" id="course-container" style="background:white; transition: 0.3s;">' +
               '<h3>📖 Course: Advanced Maize Production</h3>' +
               '<p>Status: Active Student</p>' +
               '<div id="immersive-content" style="display:none; padding:40px; background:#fff; overflow-y:auto; height:90vh;">' +
               '<button onclick="agriEngine.toggleFullScreen()" style="position:fixed; top:20px; right:20px; background:red; color:white; border:none; padding:10px; cursor:pointer; z-index:1000;">✕ Close Full Screen</button>' +
               '<h1 style="color:#2d6a4f;">Volume 1: Soil Management (Comprehensive)</h1>' +
               '<p style="font-size:18px; line-height:1.6;">Welcome to the deep-dive training. This section contains over 1,000 pages of research and practical guides...</p>' +
               '<img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80" style="width:100%; border-radius:15px; margin:20px 0;">' +
               '<p>Chapter 1: Nitrogen Cycles and Soil PH levels for Kenya Highlands...</p>' +
               '</div>' +
               '<button class="btn" style="width:100%; background:#1a73e8;" onclick="agriEngine.toggleFullScreen()">🚀 Launch Full-Screen Course</button>' +
               '</div>';
    },
    toggleFullScreen: function() {
        const doc = window.document;
        const docEl = document.getElementById('course-container');
        const content = document.getElementById('immersive-content');
        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl).then(() => {
                content.style.display = 'block';
                docEl.style.padding = '0';
            });
        } else {
            cancelFullScreen.call(doc).then(() => {
                content.style.display = 'none';
            });
        }
    }
};
agriEngine.init();
