const agriEngine = {
    state: {
        user: JSON.parse(localStorage.getItem('agri_student')),
        activeTab: localStorage.getItem('agri_tab') || 'market',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        cart: JSON.parse(localStorage.getItem('agri_cart') || '[]'),
        contact: "0742178833",
        inventory: [] // Loaded on init
    },
    generateInventory: function() {
        const types = ["Maize", "Beans", "Fertilizer", "Pump", "Seeds", "Tractor Part", "Feed", "Pesticide"];
        const icons = ["🌽", "🫘", "📦", "⚙️", "🌱", "🔧", "🐔", "🧪"];
        let items = [];
        for(let i=1; i<=1000; i++) {
            const typeIdx = i % types.length;
            items.push({
                id: i,
                n: `${types[typeIdx]} Grade ${i}`,
                p: 500 + (i * 10),
                op: 700 + (i * 12),
                i: icons[typeIdx],
                off: Math.floor(Math.random() * 20) + 5,
                desc: `High-quality ${types[typeIdx]} batch #${i}. Verified seller. Call ${this.state.contact} for bulk.`
            });
        }
        return items;
    },
    init: function() {
        this.state.inventory = this.generateInventory();
        document.body.innerHTML = `
            <div id="global-header" style="position:fixed; top:0; width:100%; height:55px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding:0 15px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:10000; box-sizing:border-box;">
                <div style="font-weight:900; color:#f68b1e; font-size:22px; letter-spacing:-1px;">EasyShop</div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="color:#2d6a4f; font-weight:bold; font-size:14px;">KSh ${this.state.wallet.toLocaleString()}</div>
                    <div onclick="agriEngine.toggleCart()" style="position:relative; cursor:pointer;"><span style="font-size:24px;">🛒</span><div id="cart-count" style="position:absolute; top:-5px; right:-8px; background:#f68b1e; color:white; font-size:10px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; border-radius:50%;">${this.state.cart.length}</div></div>
                </div>
            </div>
            <div id="viewport" style="min-height:100vh; padding-top:55px; padding-bottom:100px; background:#f1f1f2; font-family:Roboto, Arial, sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:10px 0; box-shadow:0 -2px 15px rgba(0,0,0,0.05); z-index:9999; border-top:1px solid #ddd;"></div>
            <div id="detail-modal" style="display:none; position:fixed; inset:0; background:white; z-index:20000; padding:20px; overflow-y:auto;"></div>
            <div id="cart-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:10001;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'market') this.renderEasyShop(view);
        else view.innerHTML = `<div style="padding:20px; text-align:center; color:#666;"><h3>Dashboard Coming Soon</h3><p>Switch to Market to see EasyShop.</p></div>`;
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [{id:'admin', label:'Admin', icon:'👤'}, {id:'student', label:'Academy', icon:'🎓'}, {id:'tools', label:'Tools', icon:'🛠️'}, {id:'market', label:'Market', icon:'🏪'}];
        nav.innerHTML = tabs.map(t => `<button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; cursor:pointer; color:${this.state.activeTab === t.id ? '#f68b1e' : '#75757a'}"><div style="font-size:20px;">${t.icon}</div><div style="font-size:11px;">${t.label}</div></button>`).join('');
    },
    setTab: function(id) { this.state.activeTab = id; localStorage.setItem('agri_tab', id); this.render(); },
    renderEasyShop: function(v, filter = "") {
        const filteredItems = filter === "" ? this.state.inventory : this.state.inventory.filter(item => item.n.toLowerCase().includes(filter.toLowerCase()));
        v.innerHTML = `
            <div style="background:#fff; padding:10px; border-bottom:1px solid #eee; position:sticky; top:55px; z-index:99;">
                <input type="text" id="shop-search" oninput="agriEngine.handleSearch(this.value)" placeholder="Search 1,000+ items..." value="${filter}" style="width:100%; padding:12px; border:none; background:#f1f1f2; border-radius:4px; box-sizing:border-box; outline:none;">
            </div>
            <div style="padding:10px; font-size:12px; color:#75757a;">Showing ${filteredItems.length} results</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0 8px;">
                ${filteredItems.map(p => `
                    <div style="background:#fff; border-radius:4px; padding:10px; display:flex; flex-direction:column; position:relative; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <div style="position:absolute; top:5px; right:5px; color:#f68b1e; font-size:10px; font-weight:bold;">-${p.off}%</div>
                        <div style="font-size:40px; text-align:center; padding:10px;">${p.i}</div>
                        <div style="font-size:12px; height:32px; overflow:hidden; margin:5px 0; color:#313133;">${p.n}</div>
                        <div style="font-weight:bold; color:#313133;">KSh ${p.p.toLocaleString()}</div>
                        <button onclick='agriEngine.viewDetail(${JSON.stringify(p)})' style="margin-top:8px; border:1px solid #f68b1e; color:#f68b1e; background:none; padding:8px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">VIEW DETAIL</button>
                        <button onclick="agriEngine.addToCart('${p.n}', ${p.p})" style="width:100%; background:#f68b1e; color:#fff; border:none; padding:10px; border-radius:4px; margin-top:5px; font-weight:bold; font-size:11px; cursor:pointer;">ADD TO CART</button>
                    </div>
                `).join('')}
            </div>
        `;
        // Maintain focus on search bar if user is typing
        if(filter) document.getElementById('shop-search').focus();
    },
    handleSearch: function(val) {
        this.renderEasyShop(document.getElementById('viewport'), val);
    },
    viewDetail: function(p) {
        const modal = document.getElementById('detail-modal');
        modal.style.display = "block";
        modal.innerHTML = `
            <div onclick="document.getElementById('detail-modal').style.display='none'" style="font-size:20px; cursor:pointer; margin-bottom:20px; color:#f68b1e;">✕ Back to Results</div>
            <div style="text-align:center; font-size:100px; padding:40px; background:#f8f8f8; border-radius:15px;">${p.i}</div>
            <h2 style="color:#313133; margin:20px 0 10px 0;">${p.n}</h2>
            <div style="color:#f68b1e; font-size:28px; font-weight:bold;">KSh ${p.p.toLocaleString()}</div>
            <div style="color:#75757a; text-decoration:line-through; font-size:14px;">KSh ${p.op.toLocaleString()}</div>
            <div style="margin:20px 0; padding:15px; background:#f1f1f2; border-radius:8px; font-size:14px; line-height:1.6; color:#313133;">
                <b>Product Description:</b><br>${p.desc}
            </div>
            <div style="background:#feefde; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #f68b1e;">
                <small style="color:#f68b1e; font-weight:bold;">QUICK SUPPORT</small><br>
                <a href="tel:${this.state.contact}" style="font-size:18px; color:#313133; text-decoration:none; font-weight:bold;">📞 Call ${this.state.contact}</a>
            </div>
            <button onclick="agriEngine.directBuy('${p.n}', ${p.p})" style="width:100%; background:#f68b1e; color:white; border:none; padding:18px; border-radius:8px; font-weight:bold; font-size:18px; cursor:pointer; box-shadow:0 4px 10px rgba(246,139,30,0.3);">PROCEED TO PURCHASE</button>
        `;
    },
    directBuy: function(n, p) {
        if(this.state.wallet >= p) {
            this.state.wallet -= p;
            localStorage.setItem('agri_wallet', this.state.wallet);
            alert(`Purchase Confirmed: ${n}\nOur logistics team (${this.state.contact}) will reach out.`);
            location.reload();
        } else { alert("Insufficient Balance!"); }
    },
    addToCart: function(n, p) {
        this.state.cart.push({name:n, price:p});
        localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        document.getElementById('cart-count').innerText = this.state.cart.length;
    }
    // (Additional helper functions like toggleCart/checkout remain active from previous state)
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
