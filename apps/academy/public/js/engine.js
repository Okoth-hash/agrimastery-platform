const agriEngine = {
    inventory: JSON.parse(localStorage.getItem('agri_inv')) || [{name: "Maize", price: "KES 3,200"}],
    modules: {
        public: \<div class='card'><h3> Marketplace</h3><input type='text' id='searchInput' placeholder='Search...' onkeyup='agriEngine.search()'><div id='searchResults'></div></div><button class='btn' style='background:none;color:var(--accent);' onclick='agriEngine.load(\"login\")'>Admin Portal</button>\,
        login: \<div class='card'><h3>Login</h3><input type='text' id='adminUser' placeholder='Username'><input type='password' id='adminPass' placeholder='Password'><button class='btn' onclick='agriEngine.login()'>Enter</button></div>\,
        admin: \<div class='card'><h3>7-Layer Stack: ONLINE</h3><input type='text' id='itemName' placeholder='Crop'><input type='text' id='itemPrice' placeholder='Price'><button class='btn' onclick='agriEngine.addProduct()'>Add</button></div><button class='btn' onclick='agriEngine.logout()'>Shutdown</button>\
    },
    init: function() { this.generateBits(); this.load(sessionStorage.getItem('admin_session') === 'robin_active' ? 'admin' : 'public'); },
    generateBits: function() { const s = document.getElementById('bitStream'); if(s) { let b=''; for(let i=0; i<2000; i++) b+=Math.round(Math.random()); s.innerText=b; } },
    load: function(n) { const v = document.getElementById('app-viewport'); if(v) { v.innerHTML = this.modules[n]; if(n==='admin') this.renderAdminInv(); } },
    login: function() { if(document.getElementById('adminUser').value==='robin' && document.getElementById('adminPass').value==='1234') { sessionStorage.setItem('admin_session','robin_active'); this.load('admin'); } else alert('Rejected'); },
    search: function() { 
        const q = document.getElementById('searchInput').value.toLowerCase();
        const r = document.getElementById('searchResults'); r.innerHTML='';
        this.inventory.filter(i=>i.name.toLowerCase().includes(q)).forEach(item=>{
            r.innerHTML += \<div class='result-card'><strong>\</strong>: \</div>\;
        });
    },
    addProduct: function() { 
        const n=document.getElementById('itemName').value; const p=document.getElementById('itemPrice').value;
        if(n&&p){this.inventory.push({name:n,price:p});localStorage.setItem('agri_inv',JSON.stringify(this.inventory));this.renderAdminInv();} 
    },
    renderAdminInv: function() { 
        const l = document.getElementById('adminInventory'); if(l) { l.innerHTML = ''; this.inventory.forEach(i => l.innerHTML += \<div>\ - \</div>\); }
    },
    logout: function() { sessionStorage.removeItem('admin_session'); this.load('public'); }
};
agriEngine.init();
