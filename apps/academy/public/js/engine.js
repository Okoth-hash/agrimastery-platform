const agriEngine = {
    inventory: JSON.parse(localStorage.getItem('agri_inv')) || [
        {name: "Maize", price: "KES 3,200"},
        {name: "Wheat", price: "KES 4,500"},
        {name: "Beans", price: "KES 8,500"}
    ],
    modules: {
        public: \
            <div class="card">
                <h3> Marketplace Search</h3>
                <input type="text" id="searchInput" placeholder="Search Crop..." onkeyup="agriEngine.search()">
                <div id="searchResults"></div>
            </div>
            <button class="btn" style="background:none; color:var(--accent); font-size:12px;" onclick="agriEngine.load('login')">Admin Portal</button>\,
        login: \
            <div class="card">
                <h3>Admin Authorization</h3>
                <input type="text" id="adminUser" placeholder="Username">
                <input type="password" id="adminPass" placeholder="Password">
                <button class="btn" onclick="agriEngine.login()">Authorize</button>
                <button class="btn" style="background:#444;" onclick="agriEngine.load('public')">Back</button>
            </div>\,
        admin: \
            <div class="card">
                <h3 style="color: var(--accent);">Full 7-Layer Stack: ONLINE</h3>
                <div style="font-size: 11px; background: #081c15; padding: 10px; border-radius: 8px; border: 1px solid var(--primary);">
                    <strong>L7:</strong> App | <strong>L6:</strong> JSON | <strong>L5:</strong> Session | <strong>L1:</strong> Bits
                </div>
                <h3 style="margin-top:15px;"> Market Manager</h3>
                <input type="text" id="itemName" placeholder="Crop Name">
                <input type="text" id="itemPrice" placeholder="Price">
                <button class="btn" onclick="agriEngine.addProduct()">Add to Market</button>
            </div>
            <div class="card">
                <h3>Current Inventory</h3>
                <div id="adminInventory"></div>
                <button class="btn" style="background:#8b0000;" onclick="agriEngine.logout()">Shutdown</button>
            </div>\
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
        const viewport = document.getElementById('app-viewport');
        if(viewport) { viewport.innerHTML = this.modules[name]; if(name === 'admin') this.renderAdminInv(); }
    },
    login: function() {
        const u = document.getElementById('adminUser').value.toLowerCase().trim();
        const p = document.getElementById('adminPass').value.trim();
        if(u === "robin" && p === "1234") {
            sessionStorage.setItem('admin_session', 'robin_active');
            this.load('admin');
        } else { alert("Rejected"); }
    },
    search: function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const results = document.getElementById('searchResults');
        results.innerHTML = "";
        if(query.length < 1) return;
        this.inventory.filter(i => i.name.toLowerCase().includes(query)).forEach(item => {
            const waLink = "https://wa.me/254742178833?text=Hi, I want to buy " + item.name;
            results.innerHTML += \
                <div class="result-card">
                    <strong>\</strong>: \
                    <br><a href="\" target="_blank" class="btn" style="padding:5px; margin-top:5px; font-size:11px; background:#25d366; text-decoration:none; display:inline-block; width:auto;">WhatsApp Order</a>
                </div>\;
        });
    },
    addProduct: function() {
        const name = document.getElementById('itemName').value;
        const price = document.getElementById('itemPrice').value;
        if(!name || !price) return;
        this.inventory.push({name, price});
        localStorage.setItem('agri_inv', JSON.stringify(this.inventory));
        this.renderAdminInv();
    },
    renderAdminInv: function() {
        const list = document.getElementById('adminInventory');
        if(!list) return;
        list.innerHTML = "";
        this.inventory.forEach(item => {
            list.innerHTML += \<div style="padding:8px; border-bottom:1px solid #2d6a4f;">\ - \</div>\;
        });
    },
    logout: function() { sessionStorage.removeItem('admin_session'); this.load('public'); }
};
