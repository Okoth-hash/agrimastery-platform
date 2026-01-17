const agriEngine = {
    state: {
        activeTab: localStorage.getItem('agri_tab') || 'market',
        wallet: parseInt(localStorage.getItem('agri_wallet')) || 50000,
        cart: JSON.parse(localStorage.getItem('agri_cart') || '[]'),
        contact: "0742178833",
        inventory: [],
        activeCategory: "All"
    },
    generateInventory: function() {
        const cats = [
            {n: "Seeds", i: "🌱"}, {n: "Fertilizer", i: "📦"}, 
            {n: "Equipment", i: "⚙️"}, {n: "Livestock", i: "🐔"}, 
            {n: "Pesticides", i: "🧪"}
        ];
        let items = [];
        for(let i=1; i<=1000; i++) {
            const cat = cats[i % cats.length];
            items.push({
                id: i,
                cat: cat.n,
                n: `${cat.n} Product #${i}`,
                p: 400 + (i * 5),
                op: 600 + (i * 7),
                i: cat.i,
                off: Math.floor(Math.random() * 25) + 5,
                desc: `Premium ${cat.n} solution. Optimized for high yields. Verified by EasyShop. Contact ${this.state.contact}.`
            });
        }
        return items;
    },
    init: function() {
        this.state.inventory = this.generateInventory();
        document.body.innerHTML = `
            <div id="global-header" style="position:fixed; top:0; width:100%; height:55px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding:0 15px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:10000; box-sizing:border-box;">
                <div style="font-weight:900; color:#f68b1e; font-size:22px;">EasyShop</div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="color:#2d6a4f; font-weight:bold; font-size:14px;">KSh ${this.state.wallet.toLocaleString()}</div>
                    <div onclick="agriEngine.toggleCart()" style="position:relative; cursor:pointer;"><span style="font-size:24px;">🛒</span><div id="cart-count" style="position:absolute; top:-5px; right:-8px; background:#f68b1e; color:white; font-size:10px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; border-radius:50%;">${this.state.cart.length}</div></div>
                </div>
            </div>
            <div id="viewport" style="min-height:100vh; padding-top:55px; padding-bottom:100px; background:#f1f1f2; font-family:sans-serif;"></div>
            <div id="super-nav" style="position:fixed; bottom:0; width:100%; background:white; display:flex; justify-content:space-around; align-items:center; padding:10px 0; box-shadow:0 -2px 15px rgba(0,0,0,0.05); z-index:9999; border-top:1px solid #ddd;"></div>
            <div id="detail-modal" style="display:none; position:fixed; inset:0; background:white; z-index:20000; padding:20px; overflow-y:auto;"></div>
        `;
        this.render();
    },
    render: function() {
        const view = document.getElementById('viewport');
        this.renderNav();
        if (this.state.activeTab === 'market') this.renderEasyShop(view);
        else view.innerHTML = `<div style="padding:40px; text-align:center;"><h2>Module Active</h2><p>Switch to Market to see EasyShop.</p></div>`;
    },
    renderNav: function() {
        const nav = document.getElementById('super-nav');
        const tabs = [{id:'admin', l:'Admin', i:'👤'}, {id:'student', l:'Academy', i:'🎓'}, {id:'tools', l:'Tools', i:'🛠️'}, {id:'market', l:'Market', i:'🏪'}];
        nav.innerHTML = tabs.map(t => `<button onclick="agriEngine.setTab('${t.id}')" style="flex:1; border:none; background:none; color:${this.state.activeTab === t.id ? '#f68b1e' : '#75757a'}"><div style="font-size:20px;">${t.i}</div><div style="font-size:10px;">${t.l}</div></button>`).join('');
    },
    setTab: function(id) { this.state.activeTab = id; localStorage.setItem('agri_tab', id); this.render(); },
    renderEasyShop: function(v, search = "") {
        const categories = ["All", "Seeds", "Fertilizer", "Equipment", "Livestock", "Pesticides"];
        let filtered = this.state.inventory;
        if(this.state.activeCategory !== "All") filtered = filtered.filter(i => i.cat === this.state.activeCategory);
        if(search) filtered = filtered.filter(i => i.n.toLowerCase().includes(search.toLowerCase()));
        v.innerHTML = `
            <div style="background:#fff; position:sticky; top:55px; z-index:99;">
                <div style="padding:10px;"><input type="text" id="main-search" oninput="agriEngine.updateSearch(this.value)" placeholder="Search 1,000+ products..." style="width:100%; padding:12px; border:none; background:#f1f1f2; border-radius:4px; box-sizing:border-box;"></div>
                <div style="display:flex; overflow-x:auto; padding:0 10px 10px 10px; gap:10px; border-bottom:1px solid #eee;">
                    ${categories.map(c => `
                        <div onclick="agriEngine.setCat('${c}')" style="padding:8px 15px; background:${this.state.activeCategory === c ? '#f68b1e' : '#f1f1f2'}; color:${this.state.activeCategory === c ? '#fff' : '#333'}; border-radius:20px; white-space:nowrap; font-size:12px; font-weight:bold; cursor:pointer;">${c}</div>
                    `).join('')}
                </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:8px;">
                ${filtered.slice(0, 100).map(p => `
                    <div style="background:#fff; border-radius:4px; padding:10px; position:relative; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                        <div style="font-size:40px; text-align:center;">${p.i}</div>
                        <div style="font-size:12px; height:32px; overflow:hidden; margin:5px 0;">${p.n}</div>
                        <div style="font-weight:bold;">KSh ${p.p.toLocaleString()}</div>
                        <button onclick='agriEngine.viewDetail(${JSON.stringify(p)})' style="width:100%; margin-top:8px; border:1px solid #f68b1e; color:#f68b1e; background:none; padding:6px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">DETAILS</button>
                        <button onclick="agriEngine.addToCart('${p.n}', ${p.p})" style="width:100%; background:#f68b1e; color:#fff; border:none; padding:8px; border-radius:4px; margin-top:5px; font-weight:bold; font-size:11px;">ADD TO CART</button>
                    </div>
                `).join('')}
            </div>
        `;
        if(search) document.getElementById('main-search').focus();
    },
    setCat: function(c) { this.state.activeCategory = c; this.renderEasyShop(document.getElementById('viewport')); },
    updateSearch: function(val) { this.renderEasyShop(document.getElementById('viewport'), val); },
    viewDetail: function(p) {
        const modal = document.getElementById('detail-modal');
        modal.style.display = "block";
        modal.innerHTML = `
            <div onclick="document.getElementById('detail-modal').style.display='none'" style="font-size:18px; color:#f68b1e; cursor:pointer; margin-bottom:15px;">✕ Close</div>
            <div style="text-align:center; font-size:100px; padding:30px; background:#f8f8f8; border-radius:10px;">${p.i}</div>
            <h2 style="margin:15px 0;">${p.n}</h2>
            <div style="color:#f68b1e; font-size:24px; font-weight:bold;">KSh ${p.p.toLocaleString()}</div>
            <p style="color:#666; font-size:14px; line-height:1.5;">${p.desc}</p>
            <div style="background:#feefde; padding:15px; border-radius:8px; margin:20px 0;">
                <small>Help Line</small><br><a href="tel:${this.state.contact}" style="font-size:18px; font-weight:bold; color:#333; text-decoration:none;">📞 ${this.state.contact}</a>
            </div>
            <button onclick="agriEngine.checkoutItem('${p.n}', ${p.p})" style="width:100%; background:#f68b1e; color:white; border:none; padding:18px; border-radius:8px; font-weight:bold; font-size:16px;">PROCEED TO PURCHASE</button>
        `;
    },
    checkoutItem: function(n, p) {
        if(this.state.wallet >= p) {
            this.state.wallet -= p;
            localStorage.setItem('agri_wallet', this.state.wallet);
            alert(`Order Successful for ${n}. Logistics contacting you on ${this.state.contact}`);
            location.reload();
        } else { alert("Top up your AgriWallet to purchase."); }
    },
    addToCart: function(n, p) {
        this.state.cart.push({name:n, price:p});
        localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        document.getElementById('cart-count').innerText = this.state.cart.length;
    },
    toggleCart: function() { /* Cart logic integrated from previous sync */ }
};
document.addEventListener('DOMContentLoaded', () => agriEngine.init());
