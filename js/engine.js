const agriEngine = {
    inventory: JSON.parse(localStorage.getItem('agri_inv')) || [{name: "Maize", price: "KES 3,200"}],

    init: async function() {
        this.generateBits();
        const session = sessionStorage.getItem('admin_session');
        // Using relative paths explicitly for GitHub Pages compatibility
        await this.loadComponent(session === "robin_active" ? 'admin' : 'public');
    },

    generateBits: function() {
        const stream = document.getElementById('bitStream');
        if(!stream) return;
        let bits = "";
        for(let i=0; i<4000; i++) { bits += Math.round(Math.random()); }
        stream.innerText = bits;
    },

    loadComponent: async function(name) {
        try {
            // Updated path logic for better reliability
            const path = './components/' + name + '.html';
            const response = await fetch(path);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            document.getElementById('app-viewport').innerHTML = html;
            if(name === 'admin') this.renderAdminInv();
        } catch (err) {
            console.error("Layer Fetch Error:", err);
            document.getElementById('app-viewport').innerHTML = '<p style="color:red; text-align:center;">System Sync Error. Check Connection.</p>';
        }
    },

    login: function() {
        const u = document.getElementById('adminUser').value.toLowerCase().trim();
        const p = document.getElementById('adminPass').value.trim();
        if(u === "robin" && p === "1234") {
            sessionStorage.setItem('admin_session', 'robin_active');
            this.loadComponent('admin');
        } else { alert("Signal Rejected"); }
    },

    search: function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const results = document.getElementById('searchResults');
        results.innerHTML = "";
        if(query.length < 1) return;
        this.inventory.filter(i => i.name.toLowerCase().includes(query)).forEach(item => {
            results.innerHTML += \<div class="result-card"><strong>\</strong>: \</div>\;
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

    logout: function() {
        sessionStorage.removeItem('admin_session');
        this.loadComponent('public');
    }
};
