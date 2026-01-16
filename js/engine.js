const agriEngine = {
    inventory: JSON.parse(localStorage.getItem('agri_inv')) || [
        {name: "Maize", price: "KES 3,200"},
        {name: "Wheat", price: "KES 4,500"}
    ],

    modules: {
        public: `
            <div class="card">
                <h3>🔍 Search Marketplace</h3>
                <input type="text" id="searchInput" placeholder="Search Crop..." onkeyup="agriEngine.search()">
                <div id="searchResults"></div>
            </div>
            <button class="btn" style="background:none; color:var(--accent); font-size:12px; cursor:pointer;" onclick="agriEngine.load('login')">Admin Login</button>`,
        
        login: `
            <div class="card">
                <h3>Admin Authorization</h3>
                <input type="text" id="adminUser" placeholder="Username">
                <input type="password" id="adminPass" placeholder="Password">
                <button class="btn" onclick="agriEngine.login()">Login</button>
                <button class="btn" style="background:#444;" onclick="agriEngine.load('public')">Back</button>
            </div>`,

        admin: `
            <div class="card">
                <h3 style="color: var(--accent);">Full 7-Layer Stack: <span style="color:#25d366">ONLINE</span></h3>
                <div style="font-size: 11px; background: #081c15; padding: 10px; border-radius: 8px; border: 1px solid var(--primary);">
                    <strong>Diagnostics:</strong> L7: App UI | L6: JSON | L5: Session | L4: TCP | L3: Route | L2: MAC | L1: Bits
                </div>
                <h3 style="margin-top:15px;">📦 Market Manager</h3>
                <input type="text" id="itemName" placeholder="Crop Name">
                <input type="text" id="itemPrice" placeholder="Price">
                <button class="btn" onclick="agriEngine.addProduct()">Add to Market</button>
            </div>
            <div class="card">
                <h3>Live Inventory</h3>
                <div id="adminInventory"></div>
                <button class="btn" style="background:#8b0000;" onclick="agriEngine.logout()">Shutdown</button>
            </div>`
    },

    init: function() {
        this.generateBits();
        const session = sessionStorage.getItem('admin_session');
        this.load(session === "robin_active" ? 'admin' : 'public');
    },

    generateBits: function() {
        const stream = document.getElementById('bitStream');
        if(!stream) return;
        let bits = "";
        for(let i=0; i<3000; i++) { bits += Math.round(Math.random()); }
        stream.innerText = bits;
    },

    load: function(name) {
        const view = document.getElementById('app-viewport');
        if(view) {
            view.innerHTML = this.modules[name];
            if(name === 'admin') this.renderAdminInv();
        }
    },

    login: function() {
        const u = document.getElementById('adminUser').value.toLowerCase().trim();
        const p = document.getElementById('adminPass').value.trim();
        if(u === "robin" && p === "1234") {
            sessionStorage.setItem('admin_session', 'robin_active');
            this.load('admin');
        } else { alert("Access Denied"); }
    },

    search: function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const results = document.getElementById('searchResults');
        results.innerHTML = "";
        if(query.length < 1) return;
        this.inventory.filter(i => i.name.toLowerCase().includes(query)).forEach(item => {
            results.innerHTML += `
                <div class="result-card" style="padding:10px; border-bottom:1px solid #2d6a4f;">
                    <strong>${item.name}</strong>: ${item.price}
                    <br><small><a href="https://wa.me/254742178833" target="_blank" style="color:var(--accent)">Contact Seller</a></small>
                </div>`;
        });
    },

    addProduct: function() {
        const name = document.getElementById('itemName').value;
        const price = document.getElementById('itemPrice').value;
        if(!name || !price) return;
        this.inventory.push({name, price});
        localStorage.setItem('agri_inv', JSON.stringify(this.inventory));
        this.renderAdminInv();
        document.getElementById('itemName').value = "";
        document.getElementById('itemPrice').value = "";
    },

    renderAdminInv: function() {
        const list = document.getElementById('adminInventory');
        if(!list) return;
        list.innerHTML = "";
        this.inventory.forEach(item => {
            list.innerHTML += `<div style="padding:8px; border-bottom:1px solid #2d6a4f;">${item.name} - ${item.price}</div>`;
        });
    },

    logout: function() {
        sessionStorage.removeItem('admin_session');
        this.load('public');
    }
};

// CRITICAL: Initialize the engine
agriEngine.init();