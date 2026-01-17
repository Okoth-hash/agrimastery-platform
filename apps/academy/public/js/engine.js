const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        directory: JSON.parse(localStorage.getItem('agri_directory') || '[]'),
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
    // --- 1. REGISTRATION WITH CREDENTIALS ---
    renderRegistration: function(container) {
        container.innerHTML = '<div style="max-width:400px; margin:50px auto; background:white; padding:30px; border-radius:15px; box-shadow:0 10px 25px rgba(0,0,0,0.1);">' +
            '<h2 style="color:#2d6a4f; text-align:center;">Student Registration</h2>' +
            '<input type="text" id="rName" placeholder="Full Name" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">' +
            '<input type="email" id="rEmail" placeholder="Email" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">' +
            '<input type="tel" id="rPhone" placeholder="Phone (254...)" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">' +
            '<select id="rGender" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px;">' +
                '<option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option>' +
            '</select>' +
            '<input type="password" id="rPin" maxlength="4" placeholder="Create 4-Digit PIN" style="width:100%; padding:10px; margin:5px 0; border:1px solid #ddd; border-radius:5px; text-align:center;">' +
            '<button onclick="agriEngine.handleReg()" style="width:100%; padding:12px; background:#2d6a4f; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer; margin-top:10px;">REGISTER NOW</button>' +
        '</div>';
    },
    handleReg: function() {
        const data = {
            name: document.getElementById('rName').value,
            email: document.getElementById('rEmail').value,
            phone: document.getElementById('rPhone').value,
            gender: document.getElementById('rGender').value,
            pin: document.getElementById('rPin').value
        };
        if(Object.values(data).every(v => v)) {
            localStorage.setItem('agri_student', JSON.stringify(data));
            location.reload();
        } else { alert("Complete all credentials!"); }
    },
    // --- 2. STUDENT DASHBOARD & ACTION BUTTONS ---
    renderStudentDashboard: function(container) {
        const u = this.state.user;
        container.innerHTML = '<div style="background:#f0f4f8; min-height:100vh; font-family:sans-serif; padding:20px;">' +
            '<div style="max-width:800px; margin:auto; background:white; padding:25px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #eee; padding-bottom:15px;">' +
                    '<div><h3 style="margin:0;">' + u.name + '</h3><small>' + u.email + '</small></div>' +
                    '<button onclick="agriEngine.logout()" style="background:#ff4d4d; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-size:12px;">LOG OUT</button>' +
                '</div>' +
                '<div style="margin:20px 0; display:grid; grid-template-columns:1fr 1fr; gap:15px;">' +
                    '<button onclick="agriEngine.registerUnit()" style="padding:15px; background:#2d6a4f; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">📖 REGISTER UNIT</button>' +
                    '<button onclick="agriEngine.continue()" style="padding:15px; background:#1b4332; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">▶️ CONTINUE COURSE</button>' +
                '</div>' +
                '<div style="background:#f9f9f9; padding:15px; border-radius:10px; margin:20px 0; border:1px solid #eee;">' +
                    '<b>Active Unit:</b> ' + this.state.currentUnit + '<br>' +
                    '<b>Progress:</b> ' + this.state.progress + '% complete' +
                '</div>' +
                '<div style="display:flex; gap:10px;">' +
                    '<button onclick="agriEngine.openSuggestion()" style="flex:1; padding:12px; background:#6c757d; color:white; border:none; border-radius:5px; cursor:pointer;">💡 SUGGESTIONS</button>' +
                    '<button id="certBtn" onclick="agriEngine.downloadCert()" style="flex:1; padding:12px; background:#ffc107; color:#333; border:none; border-radius:5px; font-weight:bold; cursor:' + (this.state.progress >= 100 ? 'pointer' : 'not-allowed') + '; opacity:' + (this.state.progress >= 100 ? '1' : '0.4') + ';">🎓 DOWNLOAD CERTIFICATE</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    },
    // --- BUTTON ACTIONS ---
    registerUnit: function() {
        const unit = prompt("Enter Unit Name (e.g., Maize Mastery, Soil Health):");
        if(unit) {
            localStorage.setItem('agri_active_unit', unit);
            location.reload();
        }
    },
    continue: function() {
        alert("Redirecting to Chapter " + (Math.floor(this.state.progress / 10) + 1) + "...");
        // Logic to open manual goes here
    },
    openSuggestion: function() {
        const msg = prompt("What can we improve at AgriMastery?");
        if(msg) alert("Thank you! Your feedback has been sent to the Admin.");
    },
    downloadCert: function() {
        if(this.state.progress < 100) {
            alert("Finish 100% of the course to unlock your Certificate!");
        } else {
            alert("Generating your Professional AgriMastery Certificate...");
        }
    },
    logout: function() {
        if(confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('agri_student');
            location.reload();
        }
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
