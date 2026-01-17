const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        isAdmin: localStorage.getItem('agri_admin_mode') === 'true',
        activeTab: 'market',
        // NEW: Database for student-listed produce
        userListings: JSON.parse(localStorage.getItem('agri_user_listings') || '[]')
    },
    tools: [
        { id: 'T1', name: 'Soil Ph Meter', price: 2500, img: '🧪' },
        { id: 'T2', name: 'Drip Kit', price: 12000, img: '💧' }
    ],
    marketData: [
        { crop: 'Maize', location: 'Eldoret', price: '3,800', trend: 'up' },
        { crop: 'Beans', location: 'Nairobi', price: '9,500', trend: 'down' }
    ],
    init: function() {
        document.body.innerHTML = '<div id="admin-zone"></div><div id="app-viewport" style="padding-bottom:80px;"></div><div id="nav-bar"></div>';
        this.render();
    },
    render: function() {
        this.renderNav();
        const view = document.getElementById('app-viewport');
        if (this.state.activeTab === 'tools') this.renderToolStore(view);
        else if (this.state.activeTab === 'market') this.renderMarketplace(view);
        else this.renderAcademy(view);
        if(this.state.isAdmin) this.renderAdmin();
    },
    renderNav: function() {
        const nav = document.getElementById('nav-bar');
        nav.innerHTML = '<div style="display:flex; justify-content:space-around; background:#fff; padding:15px; box-shadow:0 -2px 10px rgba(0,0,0,0.1); position:fixed; bottom:0; width:100%; z-index:1000;">' +
            '<button onclick="agriEngine.setTab(\'academy\')" style="border:none; background:none; color:'+(this.state.activeTab==='academy'?'#2d6a4f':'#999')+'">🎓 Academy</button>' +
            '<button onclick="agriEngine.setTab(\'tools\')" style="border:none; background:none; color:'+(this.state.activeTab==='tools'?'#2d6a4f':'#999')+'">🛠️ Tools</button>' +
            '<button onclick="agriEngine.setTab(\'market\')" style="border:none; background:none; color:'+(this.state.activeTab==='market'?'#2d6a4f':'#999')+'">📉 Market</button>' +
        '</div>';
    },
    setTab: function(tab) { this.state.activeTab = tab; this.render(); },
    // --- UPDATED MARKETPLACE WITH SELLER FORM ---
    renderMarketplace: function(view) {
        view.innerHTML = '<div style="padding:20px; font-family:sans-serif;">' +
            '<h2 style="color:#2d6a4f;">Market & Trade</h2>' +
            // --- SECTION 1: SELL MY PRODUCE (Form) ---
            '<div style="background:#2d6a4f; color:white; padding:20px; border-radius:15px; margin-bottom:20px;">' +
                '<h4>🚀 Sell Your Produce</h4>' +
                '<input id="sellCrop" placeholder="Crop Name (e.g. Yellow Maize)" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;">' +
                '<input id="sellQty" placeholder="Quantity (e.g. 50 Bags)" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;">' +
                '<input id="sellPrice" placeholder="Asking Price (KSh)" style="width:100%; padding:10px; margin:5px 0; border-radius:5px; border:none;">' +
                '<button onclick="agriEngine.listProduce()" style="width:100%; margin-top:10px; padding:12px; background:#1b4332; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">POST LISTING</button>' +
            '</div>' +
            // --- SECTION 2: LIVE PRICES ---
            '<h3>Live Regional Prices</h3>' +
            '<div style="background:white; border-radius:15px; padding:15px; margin-bottom:20px;">' +
                this.marketData.map(m => '<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">' +
                    '<b>'+m.crop+'</b> <span>KSh '+m.price+'</span>' +
                '</div>').join('') +
            '</div>' +
            // --- SECTION 3: RECENT STUDENT LISTINGS ---
            '<h3>Recent Community Offers</h3>' +
            '<div style="background:white; border-radius:15px; padding:15px;">' +
                (this.state.userListings.length === 0 ? '<p style="color:#999; font-size:13px;">No community offers yet.</p>' : 
                this.state.userListings.map(l => '<div style="padding:10px; border-bottom:1px solid #f0f0f0;">' +
                    '<div style="font-weight:bold; color:#2d6a4f;">'+l.crop+'</div>' +
                    '<div style="font-size:12px;">Qty: '+l.qty+' | Price: KSh '+l.price+'</div>' +
                    '<div style="font-size:10px; color:#999;">Seller: '+l.seller+'</div>' +
                '</div>').join('')) +
            '</div>' +
        '</div>';
    },
    listProduce: function() {
        const crop = document.getElementById('sellCrop').value;
        const qty = document.getElementById('sellQty').value;
        const price = document.getElementById('sellPrice').value;
        const seller = this.state.user ? this.state.user.name : "Anonymous";
        if(crop && qty && price) {
            const newListing = { crop, qty, price, seller, date: new Date().toLocaleDateString() };
            this.state.userListings.unshift(newListing); // Add to top
            localStorage.setItem('agri_user_listings', JSON.stringify(this.state.userListings));
            alert("Listing posted successfully!");
            this.render();
        } else {
            alert("Please fill all listing details.");
        }
    },
    renderToolStore: function(view) {
        view.innerHTML = '<div style="padding:20px;"><h2>AgriTools</h2><p>Store module active.</p></div>';
    },
    renderAcademy: function(view) {
        view.innerHTML = '<div style="padding:20px;"><h2>Academy</h2><p>Course content is here.</p></div>';
    },
    renderAdmin: function() {
        const az = document.getElementById('admin-zone');
        az.innerHTML = '<div style="background:#000; color:#0f0; padding:10px; font-size:11px; text-align:center;">ADMIN OVERRIDE ACTIVE</div>';
    }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
