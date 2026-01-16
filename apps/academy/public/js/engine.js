const agriEngine = {
    course: { id: 'MZ-01', title: 'Professional Maize Mastery', duration: '90 Days' },
    init: function() {
        console.log('AgriMastery Engine: Final Stability Version');
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        const user = JSON.parse(localStorage.getItem('agri_student'));
        if(!user) {
            view.innerHTML = '<div class="card">' +
                '<h2 style="color:#ffcc00;">📝 Student Registration</h2>' +
                '<p>Enroll in the 3-Month Professional Certification</p>' +
                '<input type="text" id="sName" placeholder="Full Name" style="width:90%; padding:12px; margin:10px 0; border-radius:5px; background:#111; color:white; border:1px solid #2d6a4f;">' +
                '<input type="text" id="sPhone" placeholder="WhatsApp Number" style="width:90%; padding:12px; margin:10px 0; border-radius:5px; background:#111; color:white; border:1px solid #2d6a4f;">' +
                '<button class="btn" style="width:100%; margin-top:10px;" onclick="agriEngine.register()">Register & Begin Month 1</button>' +
            '</div>';
        } else {
            view.innerHTML = '<div class="card">' +
                '<h2 style="color:#ffcc00;">Welcome, ' + user.name + '</h2>' +
                '<div class="result-card" style="border-left:4px solid #ffcc00; background:rgba(255,255,255,0.05);">' +
                    '<h3>🌽 ' + this.course.title + '</h3>' +
                    '<p><strong>Progress:</strong> Month 1 (Soil Chemistry)</p>' +
                    '<button class="btn" style="width:100%;" onclick="alert(\'Opening Month 1 Modules...\')">Continue Learning</button>' +
                '</div>' +
                '<button class="btn" style="background:none; color:#ff4444; font-size:11px; margin-top:20px; border:1px solid #333;" onclick="localStorage.clear(); location.reload();">Logout / Reset Profile</button>' +
            '</div>';
        }
    },
    register: function() {
        const name = document.getElementById('sName').value;
        const phone = document.getElementById('sPhone').value;
        if(name && phone) {
            localStorage.setItem('agri_student', JSON.stringify({name: name, phone: phone}));
            this.render();
        } else {
            alert('Please provide name and phone.');
        }
    }
};
agriEngine.init();
