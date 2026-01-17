const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
        // NEW: Suggestions database
        suggestions: JSON.parse(localStorage.getItem('agri_suggestions') || '[]'),
        progress: parseInt(localStorage.getItem('agri_progress')) || 0,
        currentUnit: localStorage.getItem('agri_active_unit') || 'None'
    },
    init: function() {
        document.body.innerHTML = '<div id="admin-zone"></div><div id="student-zone"></div>';
        this.render();
    },
    render: function() {
        if(this.state.isAdmin) this.renderAdmin();
        const zone = document.getElementById('student-zone');
        if (!this.state.user) {
            this.renderRegistration(zone);
        } else {
            this.renderStudentDashboard(zone);
        }
    },
    // --- ADMIN MODULE: NOW WITH INBOX ---
    renderAdmin: function() {
        const zone = document.getElementById('admin-zone');
        zone.innerHTML = '<div style="background:#111; color:white; padding:20px; font-family:sans-serif; border-bottom:5px solid #2d6a4f;">' +
            '<h2>⚡ Admin Command Center</h2>' +
            '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:15px;">' +
                // Left: Student Registry
                '<div style="background:#222; padding:15px; border-radius:10px;">' +
                    '<h4>Registry</h4>' +
                    this.state.directory.map(s => '<div style="font-size:12px; border-bottom:1px solid #333; padding:5px;">' + s.name + ' (' + s.email + ')</div>').join('') +
                '</div>' +
                // Right: Suggestion Inbox
                '<div style="background:#222; padding:15px; border-radius:10px;">' +
                    '<h4>📥 Suggestion Inbox (' + this.state.suggestions.length + ')</h4>' +
                    '<div style="max-height:150px; overflow-y:auto;">' +
                        (this.state.suggestions.length === 0 ? '<p style="color:#666; font-size:12px;">No messages yet.</p>' : 
                        this.state.suggestions.map((m, i) => '<div style="font-size:12px; background:#333; margin:5px 0; padding:8px; border-radius:5px;">' +
                            '<b>' + m.from + ':</b> ' + m.text + 
                            ' <button onclick="agriEngine.deleteMsg('+i+')" style="color:red; background:none; border:none; cursor:pointer; float:right;">Delete</button>' +
                        '</div>').join('')) +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<button onclick="localStorage.removeItem(\'agri_admin_mode\');location.reload();" style="margin-top:15px; padding:5px 15px; background:#ef4444; color:white; border:none; border-radius:5px; cursor:pointer;">Logout Admin</button>' +
        '</div>';
    },
    // --- STUDENT ACTIONS ---
    openSuggestion: function() {
        const msg = prompt("What can we improve at AgriMastery?");
        if(msg && this.state.user) {
            const newSuggestion = {
                from: this.state.user.name,
                text: msg,
                date: new Date().toLocaleDateString()
            };
            this.state.suggestions.push(newSuggestion);
            localStorage.setItem('agri_suggestions', JSON.stringify(this.state.suggestions));
            alert("Suggestion sent to the Admin! Thank you.");
            location.reload(); // Refresh to show in Admin view instantly
        }
    },
    // --- ADMIN ACTIONS ---
    deleteMsg: function(index) {
        this.state.suggestions.splice(index, 1);
        localStorage.setItem('agri_suggestions', JSON.stringify(this.state.suggestions));
        this.render();
    },
    // --- CORE UI (Preserved from previous phases) ---
    renderRegistration: function(container) {
        container.innerHTML = '<div style="max-width:400px; margin:50px auto; background:white; padding:30px; border-radius:15px; box-shadow:0 10px 25px rgba(0,0,0,0.1);">' +
            '<h2 style="color:#2d6a4f; text-align:center;">Register</h2>' +
            '<input type="text" id="rName" placeholder="Full Name" style="width:100%; padding:10px; margin:5px 0;">' +
            '<input type="email" id="rEmail" placeholder="Email" style="width:100%; padding:10px; margin:5px 0;">' +
            '<button onclick="agriEngine.handleReg()" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; cursor:pointer;">JOIN NOW</button>' +
            '<p ondblclick="agriEngine.unlockAdmin()" style="text-align:center; color:#eee; font-size:9px;">ADMIN</p>' +
        '</div>';
    },
    handleReg: function() {
        const name = document.getElementById('rName').value;
        const email = document.getElementById('rEmail').value;
        if(name && email) {
            localStorage.setItem('agri_student', JSON.stringify({name, email}));
            // Add to directory
            this.state.directory.push({name, email, course: 'General', progress: 0});
            localStorage.setItem('agri_directory', JSON.stringify(this.state.directory));
            location.reload();
        }
    },
    renderStudentDashboard: function(container) {
        container.innerHTML = '<div style="background:#f0f4f8; padding:20px; min-height:100vh;">' +
            '<div style="max-width:800px; margin:auto; background:white; padding:25px; border-radius:15px;">' +
                '<h3>Student Hub</h3>' +
                '<div style="display:flex; gap:10px; margin-top:20px;">' +
                    '<button onclick="agriEngine.openSuggestion()" style="flex:1; padding:15px; background:#6c757d; color:white; border:none; border-radius:8px; cursor:pointer;">💡 SEND SUGGESTION</button>' +
                    '<button onclick="agriEngine.logout()" style="flex:1; padding:15px; background:#ff4d4d; color:white; border:none; border-radius:8px; cursor:pointer;">LOG OUT</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    },
    unlockAdmin: function() {
        if(prompt("PIN:") === "1234") { localStorage.setItem('agri_admin_mode', 'true'); location.reload(); }
    },
    logout: function() { localStorage.removeItem('agri_student'); location.reload(); }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
