/**
 * AGRIMASTERY STUDENT ENGINE v9.0
 * Features: LocalStorage Persistence, Registration & Dashboard Rendering
 */
const agriEngine = {
    course: { 
        id: 'MZ-01', 
        title: 'Professional Maize Mastery', 
        duration: '90 Days' 
    },
    init: function() {
        console.log("AgriMastery Engine L7: Initialized");
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-viewport');
        if (!view) return;
        // Retrieve student data from the "Vault" (LocalStorage)
        const user = JSON.parse(localStorage.getItem('agri_student'));
        if (!user) {
            // STEP 1: RENDER REGISTRATION FORM
            view.innerHTML = \
                <div class="card" style="background:white; padding:30px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); max-width:500px; margin:auto;">
                    <h2 style="color:#2d6a4f; margin-top:0;">👨‍🌾 Student Registration</h2>
                    <p style="color:#666;">Enroll in the 3-Month Professional Certification</p>
                    <input type="text" id="sName" placeholder="Full Name" 
                        style="width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #ddd; box-sizing:border-box; font-size:16px;">
                    <input type="text" id="sPhone" placeholder="WhatsApp Number" 
                        style="width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #ddd; box-sizing:border-box; font-size:16px;">
                    <button onclick="agriEngine.register()" 
                        style="width:100%; padding:15px; background:#2d6a4f; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; font-size:16px; margin-top:10px;">
                        Register & Begin Month 1
                    </button>
                </div>\;
        } else {
            // STEP 2: RENDER ACTIVE DASHBOARD
            view.innerHTML = \
                <div class="card" style="background:white; padding:30px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); max-width:500px; margin:auto;">
                    <h2 style="color:#2d6a4f; margin-top:0;">Welcome, \</h2>
                    <div style="background:#f9f9f9; padding:20px; border-radius:12px; border-left:5px solid #ffcc00; margin:15px 0;">
                        <h3 style="margin:0; color:#1b4332;">📖 \</h3>
                        <p style="margin:10px 0;">Progress: <strong>Month 1 (Soil Chemistry)</strong></p>
                        <button onclick="alert('Accessing Soil Chemistry Modules...')" 
                            style="width:100%; padding:12px; background:#1b4332; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                            Continue Learning
                        </button>
                    </div>
                    <button onclick="agriEngine.logout()" 
                        style="background:none; border:none; color:#ef4444; font-size:12px; cursor:pointer; text-decoration:underline; width:100%; text-align:center;">
                        Logout / Reset Profile
                    </button>
                </div>\;
        }
    },
    register: function() {
        const name = document.getElementById('sName').value;
        const phone = document.getElementById('sPhone').value;
        if (name && phone) {
            localStorage.setItem('agri_student', JSON.stringify({ name, phone }));
            this.render();
        } else {
            alert("Please provide both Name and WhatsApp Number.");
        }
    },
    logout: function() {
        if(confirm("Are you sure you want to reset your progress?")) {
            localStorage.removeItem('agri_student');
            location.reload();
        }
    }
};
// Start the engine
document.addEventListener('DOMContentLoaded', () => agriEngine.init());