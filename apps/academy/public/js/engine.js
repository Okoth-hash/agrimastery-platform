const agriEngine = {
    state: { wallet: 15000, cart: [], activeTab: 'market', inventory: [], currentPage: 1, userName: 'OMONDI ROBIN' },
    adminSettings: { pin: "1234", isLocked: true },
    marketSettings: { search: "", category: "All" },
    init: function() {
        this.loadCart();
        this.generateInventory();
        this.render();
    },
    loadCart: function() {
        try {
            const saved = localStorage.getItem('agri_cart');
            if (saved) this.state.cart = JSON.parse(saved);
        } catch (e) { this.state.cart = []; }
    },
    saveCart: function() {
        try {
            localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        } catch (e) {}
    },
    generateInventory: function() {
        const base = [
            { n: "Hybrid Maize Seeds", p: 2850, i: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=300", c: "Seeds" },
            { n: "NPK Fertilizer 50kg", p: 5900, i: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300", c: "Fertilizer" },
            { n: "Solar Water Pump", p: 18500, i: "https://images.unsplash.com/photo-1581094288338-2314dddb7903?w=300", c: "Equipment" },
            { n: "Backpack Sprayer 20L", p: 4200, i: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=300", c: "Tools" },
            { n: "Organic Pesticide 5L", p: 3500, i: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300", c: "Chemicals" },
            { n: "Drip Irrigation Kit", p: 12000, i: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300", c: "Equipment" },
            { n: "Garden Hoe Premium", p: 1800, i: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=300", c: "Tools" },
            { n: "Greenhouse Film 200m", p: 8500, i: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", c: "Supplies" },
            { n: "Tomato Seeds F1", p: 1200, i: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", c: "Seeds" },
            { n: "Wheelbarrow Heavy", p: 6500, i: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=300", c: "Equipment" }
        ];
        for (let i = 0; i < 105; i++) {
            const t = base[i % base.length];
            this.state.inventory.push({ id: i, n: t.n + " SKU-" + (1000 + i), p: t.p + (i * 50), i: t.i, cat: t.c, stock: Math.floor(Math.random() * 100) + 10 });
        }
    },
    addToCart: function(id) {
        const prod = this.state.inventory.find(p => p.id === id);
        if (!prod) return;
        const existing = this.state.cart.find(i => i.id === id);
        if (existing) {
            existing.qty++;
        } else {
            this.state.cart.push({ id: prod.id, n: prod.n, p: prod.p, qty: 1 });
        }
        this.saveCart();
        this.showNotif("Added " + prod.n);
        this.updateCartBadge();
    },
    removeFromCart: function(id) {
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.saveCart();
        this.render();
    },
    getCartTotal: function() {
        return this.state.cart.reduce((s, i) => s + (i.p * i.qty), 0);
    },
    checkout: function() {
        const total = this.getCartTotal();
        if (total > this.state.wallet) {
            alert('Insufficient funds!');
            return;
        }
        if (this.state.cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        this.state.wallet -= total;
        const count = this.state.cart.length;
        this.state.cart = [];
        this.saveCart();
        alert('Order placed! ' + count + ' items purchased. Balance: KSh ' + this.state.wallet.toLocaleString());
        this.render();
    },
    updateCartBadge: function() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.state.cart.reduce((s, i) => s + i.qty, 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    },
    switchTab: function(tab) {
        this.state.activeTab = tab;
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-view');
        if (!view) return;
        switch (this.state.activeTab) {
            case 'market': this.renderMarket(view); break;
            case 'academy': this.renderAcademy(view); break;
            case 'tools': this.renderTools(view); break;
            case 'admin': this.renderAdmin(view); break;
            case 'cart': this.renderCart(view); break;
            default: this.renderMarket(view);
        }
        this.updateNav();
        this.updateCartBadge();
    },
    renderMarket: function(v) {
        const items = this.state.inventory.filter(i => {
            const m1 = i.n.toLowerCase().includes(this.marketSettings.search.toLowerCase());
            const m2 = this.marketSettings.category === "All" || i.cat === this.marketSettings.category;
            return m1 && m2;
        });
        const cats = ["All"].concat([...new Set(this.state.inventory.map(i => i.cat))]);
        v.innerHTML = '<div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">' +
            '<div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:1000;">' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:10px;">' +
            '<span style="font-size:12px; font-weight:bold;">📞 0742178833</span>' +
            '<span style="font-size:14px; font-weight:bold;">Wallet: KSh ' + this.state.wallet.toLocaleString() + '</span></div>' +
            '<input type="text" placeholder="Search products..." value="' + this.marketSettings.search + '" oninput="agriEngine.marketSettings.search=this.value; agriEngine.render()" style="width:100%; padding:12px; border-radius:8px; border:none; margin-bottom:10px;">' +
            '<div style="display:flex; gap:8px; overflow-x:auto;">' +
            cats.map(c => '<button onclick="agriEngine.marketSettings.category=\'' + c + '\'; agriEngine.render()" style="padding:8px 15px; border-radius:20px; border:none; background:' + (this.marketSettings.category === c ? 'white' : 'rgba(255,255,255,0.3)') + '; color:' + (this.marketSettings.category === c ? '#f68b1e' : 'white') + '; font-weight:bold; cursor:pointer; white-space:nowrap;">' + c + '</button>').join('') +
            '</div></div>' +
            '<div style="padding:10px; display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">' +
            items.map(i => '<div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">' +
                '<img src="' + i.i + '" style="width:100%; height:140px; object-fit:cover;">' +
                '<div style="padding:12px;">' +
                '<div style="font-size:11px; color:#666;">' + i.cat + '</div>' +
                '<div style="font-size:12px; font-weight:bold; height:32px; overflow:hidden; margin-bottom:8px;">' + i.n + '</div>' +
                '<div style="color:#f68b1e; font-weight:bold; font-size:16px; margin-bottom:8px;">KSh ' + i.p.toLocaleString() + '</div>' +
                '<div style="font-size:10px; color:#666; margin-bottom:10px;">Stock: ' + i.stock + '</div>' +
                '<button onclick="agriEngine.addToCart(' + i.id + ')" style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">ADD TO CART</button>' +
                '</div></div>').join('') +
            '</div></div>';
    },
    renderCart: function(v) {
        const total = this.getCartTotal();
        if (this.state.cart.length === 0) {
            v.innerHTML = '<div style="background:#f8f9fa; min-height:100vh; padding-bottom:100px;">' +
                '<div style="background:#f68b1e; color:white; padding:20px;"><h2 style="margin:0;">Shopping Cart</h2></div>' +
                '<div style="text-align:center; padding:80px 20px;"><div style="font-size:64px;">🛒</div>' +
                '<h3 style="color:#666; margin-bottom:10px;">Cart is empty</h3>' +
                '<button onclick="agriEngine.switchTab(\'market\')" style="background:#f68b1e; color:white; border:none; padding:15px 40px; border-radius:8px; font-weight:bold; cursor:pointer;">BROWSE PRODUCTS</button></div></div>';
        } else {
            v.innerHTML = '<div style="background:#f8f9fa; min-height:100vh; padding-bottom:100px;">' +
                '<div style="background:#f68b1e; color:white; padding:20px;"><h2 style="margin:0;">Shopping Cart</h2><div style="font-size:14px; margin-top:5px;">' + this.state.cart.length + ' items</div></div>' +
                '<div style="padding:15px;">' +
                this.state.cart.map(i => '<div style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">' +
                    '<div style="display:flex; justify-content:space-between;"><div style="flex:1;">' +
                    '<div style="font-weight:bold; font-size:14px; margin-bottom:5px;">' + i.n + '</div>' +
                    '<div style="color:#f68b1e; font-weight:bold; font-size:16px;">KSh ' + i.p.toLocaleString() + '</div>' +
                    '<div style="color:#666; font-size:12px; margin-top:5px;">Qty: ' + i.qty + '</div></div>' +
                    '<button onclick="agriEngine.removeFromCart(' + i.id + ')" style="background:#ef4444; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">Remove</button></div>' +
                    '<div style="text-align:right; margin-top:10px; padding-top:10px; border-top:1px solid #e5e7eb;">' +
                    '<span style="color:#666; font-size:12px;">Subtotal: </span><span style="font-weight:bold; color:#f68b1e;">KSh ' + (i.p * i.qty).toLocaleString() + '</span></div></div>').join('') +
                '<div style="background:white; padding:20px; border-radius:10px; margin-top:20px;">' +
                '<div style="display:flex; justify-content:space-between; font-size:18px; margin-bottom:15px;"><span style="font-weight:bold;">Total:</span>' +
                '<span style="color:#f68b1e; font-weight:bold;">KSh ' + total.toLocaleString() + '</span></div>' +
                '<div style="font-size:12px; color:#666; margin-bottom:15px;">Wallet: KSh ' + this.state.wallet.toLocaleString() + 
                (total > this.state.wallet ? '<br><span style="color:#ef4444;">Insufficient funds</span>' : '') + '</div>' +
                '<button onclick="agriEngine.checkout()" style="width:100%; background:#2d6a4f; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer;">PLACE ORDER</button></div></div></div>';
        }
    },
    renderAcademy: function(v) {
        v.innerHTML = '<div style="background:#fff; min-height:100vh; padding-bottom:100px;">' +
            '<div style="background:#1b4332; color:white; padding:20px;">' +
            '<h2 style="margin:0 0 10px 0;">🎓 Agri-Academy</h2><div style="font-size:14px;">' + this.state.userName + '</div>' +
            '<div style="background:rgba(255,255,255,0.2); padding:10px; border-radius:6px; margin-top:15px;">' +
            '<div style="font-size:12px; margin-bottom:5px;">Progress</div>' +
            '<div style="background:rgba(0,0,0,0.2); height:8px; border-radius:4px; overflow:hidden;">' +
            '<div style="background:#52b788; height:100%; width:' + ((this.state.currentPage / 1000) * 100) + '%;"></div></div>' +
            '<div style="font-size:11px; margin-top:5px; text-align:right;">Page ' + this.state.currentPage + ' / 1000</div></div></div>' +
            '<div style="padding:20px; line-height:1.8;"><h3 style="color:#1b4332;">Chapter 1: Soil Chemistry</h3>' +
            '<p>Understanding soil chemistry is fundamental to agriculture. The soil determines nutrient availability and crop health.</p>' +
            '<div style="background:#e8f5e9; padding:15px; border-left:4px solid #2d6a4f; margin:20px 0; border-radius:4px;">' +
            '<div style="font-weight:bold; color:#1b4332; margin-bottom:8px;">🔑 Key Concept</div>' +
            '<p style="margin:0;">The NPK ratio (Nitrogen-Phosphorus-Potassium) is the foundation of fertilizer selection.</p></div>' +
            '<h4 style="color:#2d6a4f;">Soil pH and Nutrient Availability</h4>' +
            '<p>Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0).</p>' +
            '<ul style="line-height:2;"><li><strong>Acidic soils (pH &lt; 6.0):</strong> May need lime</li>' +
            '<li><strong>Neutral soils (pH 6.0-7.0):</strong> Optimal</li>' +
            '<li><strong>Alkaline soils (pH &gt; 7.0):</strong> May need sulfur</li></ul></div>' +
            '<div style="padding:0 20px 20px;"><button onclick="agriEngine.state.currentPage++; agriEngine.render(); window.scrollTo(0,0);" ' +
            'style="width:100%; background:#2d6a4f; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer;">NEXT PAGE →</button></div></div>';
    },
    renderTools: function(v) {
        const tools = [
            { n: "Harvest Calculator", i: "🌾", c: "#2d6a4f" }, { n: "Soil pH Tester", i: "📉", c: "#ae2012" },
            { n: "Rainfall Logger", i: "🌧️", c: "#0077b6" }, { n: "Profit/Loss", i: "📈", c: "#f68b1e" },
            { n: "Seed Spacing", i: "📏", c: "#52b788" }, { n: "Pest Alert", i: "🐛", c: "#6d597a" },
            { n: "Weather Forecast", i: "☀️", c: "#fbbf24" }, { n: "Fertilizer Calc", i: "⚗️", c: "#8b5cf6" }
        ];
        v.innerHTML = '<div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">' +
            '<div style="background:#2d6a4f; color:white; padding:20px;"><h2 style="margin:0;">🛠️ Farm Tools</h2>' +
            '<div style="font-size:14px; margin-top:5px;">' + tools.length + ' tools</div></div>' +
            '<div style="padding:15px; display:grid; grid-template-columns:repeat(2, 1fr); gap:15px;">' +
            tools.map(t => '<div onclick="alert(\'' + t.n + ' coming soon!\')" style="background:white; padding:20px 15px; border-radius:12px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.1); cursor:pointer; border-bottom:4px solid ' + t.c + ';">' +
                '<div style="font-size:40px; margin-bottom:12px;">' + t.i + '</div>' +
                '<div style="color:' + t.c + '; font-weight:bold; font-size:13px;">' + t.n.toUpperCase() + '</div></div>').join('') +
            '</div></div>';
    },
    renderAdmin: function(v) {
        if (this.adminSettings.isLocked) {
            v.innerHTML = '<div style="background:#0f172a; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px;">' +
                '<div style="text-align:center; max-width:400px; width:100%;"><div style="background:#1e293b; padding:40px 30px; border-radius:16px;">' +
                '<div style="font-size:64px; margin-bottom:20px;">🔐</div><h2 style="color:white; margin:0 0 10px 0;">Admin Access</h2>' +
                '<p style="color:#94a3b8; margin:0 0 30px 0; font-size:14px;">Enter PIN</p>' +
                '<input type="password" id="admin-pin" placeholder="••••" maxlength="4" style="width:140px; padding:18px; text-align:center; font-size:28px; border-radius:10px; border:2px solid #334155; background:#1e293b; color:white; margin-bottom:25px; letter-spacing:10px;" onkeyup="if(event.key===\'Enter\' && this.value===\'1234\'){agriEngine.adminSettings.isLocked=false; agriEngine.render();}else if(event.key===\'Enter\'){alert(\'Wrong PIN\'); this.value=\'\';}">' +
                '<br><button onclick="const p=document.getElementById(\'admin-pin\').value; if(p===\'1234\'){agriEngine.adminSettings.isLocked=false; agriEngine.render();}else{alert(\'Wrong PIN\'); document.getElementById(\'admin-pin\').value=\'\';}" style="background:#38bdf8; color:#0f172a; border:none; padding:15px 50px; border-radius:10px; font-weight:bold; cursor:pointer; font-size:16px;">UNLOCK</button>' +
                '<div style="margin-top:30px; padding-top:20px; border-top:1px solid #334155;"><div style="color:#64748b; font-size:11px;">Default PIN</div>' +
                '<div style="color:#94a3b8; font-size:12px; font-family:monospace;">1234</div></div></div></div></div>';
        } else {
            const stats = { totalProducts: this.state.inventory.length, cartItems: this.state.cart.length, totalRevenue: this.getCartTotal(), academyProgress: this.state.currentPage + '/1000' };
            v.innerHTML = '<div style="background:#0f172a; min-height:100vh; padding-bottom:100px;">' +
                '<div style="background:#1e293b; padding:20px; border-bottom:2px solid #334155;"><h2 style="color:white; margin:0 0 5px 0;">⚙️ Master Control</h2>' +
                '<div style="color:#94a3b8; font-size:14px;">System Admin</div></div>' +
                '<div style="padding:20px;"><div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:15px; margin-bottom:25px;">' +
                '<div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #38bdf8;"><div style="color:#94a3b8; font-size:12px;">PRODUCTS</div>' +
                '<div style="color:white; font-size:28px; font-weight:bold;">' + stats.totalProducts + '</div></div>' +
                '<div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #f68b1e;"><div style="color:#94a3b8; font-size:12px;">CART</div>' +
                '<div style="color:white; font-size:28px; font-weight:bold;">' + stats.cartItems + '</div></div>' +
                '<div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #2d6a4f;"><div style="color:#94a3b8; font-size:12px;">WALLET</div>' +
                '<div style="color:white; font-size:20px; font-weight:bold;">KSh ' + this.state.wallet.toLocaleString() + '</div></div>' +
                '<div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #8b5cf6;"><div style="color:#94a3b8; font-size:12px;">ACADEMY</div>' +
                '<div style="color:white; font-size:16px; font-weight:bold;">' + stats.academyProgress + '</div></div></div>' +
                '<div style="background:#1e293b; padding:20px; border-radius:10px; margin-bottom:20px;"><div style="color:#94a3b8; font-size:12px; margin-bottom:15px;">USER INFO</div>' +
                '<div style="color:white; margin-bottom:8px;"><strong>Name:</strong> ' + this.state.userName + '</div>' +
                '<div style="color:white; margin-bottom:8px;"><strong>Wallet:</strong> KSh ' + this.state.wallet.toLocaleString() + '</div>' +
                '<div style="color:white;"><strong>Progress:</strong> ' + stats.academyProgress + ' pages</div></div>' +
                '<div style="background:#1e293b; padding:20px; border-radius:10px; margin-bottom:20px;"><div style="color:#94a3b8; font-size:12px; margin-bottom:15px;">QUICK ACTIONS</div>' +
                '<button onclick="agriEngine.state.wallet += 10000; agriEngine.render(); alert(\'Added KSh 10,000\')" style="width:100%; background:#2d6a4f; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:10px;">💰 Add KSh 10,000</button>' +
                '<button onclick="if(confirm(\'Clear cart?\')){agriEngine.state.cart=[]; agriEngine.saveCart(); agriEngine.render();}" style="width:100%; background:#f59e0b; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:10px;">🛒 Clear Cart</button>' +
                '<button onclick="agriEngine.state.currentPage=1; agriEngine.render();" style="width:100%; background:#8b5cf6; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">📚 Reset Progress</button></div>' +
                '<button onclick="if(confirm(\'Lock?\')){agriEngine.adminSettings.isLocked=true; agriEngine.render();}" style="width:100%; background:#ef4444; color:white; border:none; padding:18px; border-radius:8px; font-weight:bold; cursor:pointer;">🔒 LOCK SYSTEM</button></div></div>';
        }
    },
    updateNav: function() {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;
        const tabs = [
            { id: 'market', icon: '🛒', label: 'Market' },
            { id: 'academy', icon: '📚', label: 'Academy' },
            { id: 'tools', icon: '🛠️', label: 'Tools' },
            { id: 'cart', icon: '🛍️', label: 'Cart' },
            { id: 'admin', icon: '⚙️', label: 'Admin' }
        ];
        nav.innerHTML = tabs.map(t => {
            const active = this.state.activeTab === t.id;
            return '<div onclick="agriEngine.switchTab(\'' + t.id + '\')" style="flex:1; text-align:center; padding:10px 5px; cursor:pointer; position:relative;">' +
                (t.id === 'cart' ? '<span id="cart-badge" style="position:absolute; top:5px; right:calc(50% - 25px); background:#ef4444; color:white; border-radius:10px; padding:2px 6px; font-size:10px; font-weight:bold; display:none;"></span>' : '') +
                '<div style="font-size:24px; margin-bottom:2px;">' + t.icon + '</div>' +
                '<div style="font-size:10px;# =========================================================================================
# AgriMastery - Complete Platform Deployment Script
# INSTRUCTIONS: Copy this ENTIRE file and paste into PowerShell as Administrator
# =========================================================================================
Write-Host "🌾 Starting AgriMastery Deployment..." -ForegroundColor Green
$projectPath = "C:\Users\PC\Desktop\AgriMastery\agrimastery-platform"
# Create directory if needed
if (-not (Test-Path $projectPath)) {
    New-Item -Path $projectPath -ItemType Directory -Force | Out-Null
}
Set-Location $projectPath
# Create folder structure
$folders = @("apps\academy\public\js", "apps\academy\public\css")
foreach ($folder in $folders) {
    $path = Join-Path $projectPath $folder
    if (-not (Test-Path $path)) {
        New-Item -Path $path -ItemType Directory -Force | Out-Null
    }
}
Write-Host "✓ Folders created" -ForegroundColor Green
# =========================================================================================
# CREATE INDEX.HTML
# =========================================================================================
$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>AgriMastery - Complete Farm Solution</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌾</text></svg>">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow-x: hidden; background: #f1f1f2; }
        #bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; display: flex; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 1000; }
    </style>
</head>
<body>
    <div id="app-view"></div>
    <div id="bottom-nav"></div>
    <script src="js/engine.js"></script>
</body>
</html>
"@
Set-Content -Path "apps\academy\public\index.html" -Value $htmlContent -Encoding UTF8
Write-Host "✓ index.html created" -ForegroundColor Green
# =========================================================================================
# CREATE ENGINE.JS - ALL CODE IN ONE STRING
# =========================================================================================
$jsContent = @'
const agriEngine = {
    state: { wallet: 15000, cart: [], activeTab: 'market', inventory: [], currentPage: 1, userName: 'OMONDI ROBIN' },
    adminSettings: { pin: "1234", isLocked: true },
    marketSettings: { search: "", category: "All" },
    init: function() {
        this.loadCart();
        this.generateInventory();
        this.render();
    },
    loadCart: function() {
        try {
            const saved = localStorage.getItem('agri_cart');
            if (saved) this.state.cart = JSON.parse(saved);
        } catch (e) { this.state.cart = []; }
    },
    saveCart: function() {
        try {
            localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        } catch (e) {}
    },
    generateInventory: function() {
        const base = [
            { n: "Hybrid Maize Seeds", p: 2850, i: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=300", c: "Seeds" },
            { n: "NPK Fertilizer 50kg", p: 5900, i: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300", c: "Fertilizer" },
            { n: "Solar Water Pump", p: 18500, i: "https://images.unsplash.com/photo-1581094288338-2314dddb7903?w=300", c: "Equipment" },
            { n: "Backpack Sprayer 20L", p: 4200, i: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=300", c: "Tools" },
            { n: "Organic Pesticide 5L", p: 3500, i: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300", c: "Chemicals" },
            { n: "Drip Irrigation Kit", p: 12000, i: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300", c: "Equipment" },
            { n: "Garden Hoe Premium", p: 1800, i: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=300", c: "Tools" },
            { n: "Greenhouse Film 200m", p: 8500, i: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", c: "Supplies" },
            { n: "Tomato Seeds F1", p: 1200, i: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", c: "Seeds" },
            { n: "Wheelbarrow Heavy", p: 6500, i: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=300", c: "Equipment" }
        ];
        for (let i = 0; i < 105; i++) {
            const t = base[i % base.length];
            this.state.inventory.push({ id: i, n: t.n + " SKU-" + (1000 + i), p: t.p + (i * 50), i: t.i, cat: t.c, stock: Math.floor(Math.random() * 100) + 10 });
        }
    },
    addToCart: function(id) {
        const prod = this.state.inventory.find(p => p.id === id);
        if (!prod) return;
        const existing = this.state.cart.find(i => i.id === id);
        if (existing) {
            existing.qty++;
        } else {
            this.state.cart.push({ id: prod.id, n: prod.n, p: prod.p, qty: 1 });
        }
        this.saveCart();
        this.showNotif("Added " + prod.n);
        this.updateCartBadge();
    },
    removeFromCart: function(id) {
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.saveCart();
        this.render();
    },
    getCartTotal: function() {
        return this.state.cart.reduce((s, i) => s + (i.p * i.qty), 0);
    },
    checkout: function() {
        const total = this.getCartTotal();
        if (total > this.state.wallet) {
            alert('Insufficient funds!');
            return;
        }
        if (this.state.cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        this.state.wallet -= total;
        const count = this.state.cart.length;
        this.state.cart = [];
        this.saveCart();
        alert('Order placed! ' + count + ' items purchased. Balance: KSh ' + this.state.wallet.toLocaleString());
        this.render();
    },
    updateCartBadge: function() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.state.cart.reduce((s, i) => s + i.qty, 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    },
    switchTab: function(tab) {
        this.state.activeTab = tab;
        this.render();
    },
    render: function() {
        const view = document.getElementById('app-view');
        if (!view) return;
        switch (this.state.activeTab) {
            case 'market': this.renderMarket(view); break;
            case 'academy': this.renderAcademy(view); break;
            case 'tools': this.renderTools(view); break;
            case 'admin': this.renderAdmin(view); break;
            case 'cart': this.renderCart(view); break;
            default: this.renderMarket(view);
        }
        this.updateNav();
        this.updateCartBadge();
    },
    renderMarket: function(v) {
        const items = this.state.inventory.filter(i => {
            const m1 = i.n.toLowerCase().includes(this.marketSettings.search.toLowerCase());
            const m2 = this.marketSettings.category === "All" || i.cat === this.marketSettings.category;
            return m1 && m2;
        });
        const cats = ["All"].concat([...new Set(this.state.inventory.map(i => i.cat))]);
        v.innerHTML = '<div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">' +
            '<div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:1000;">' +
            '<div style="display:flex; justify-content:space-between; margin-bottom:10px;">' +
            '<span style="font-size:12px; font-weight:bold;">📞 0742178833</span>' +
            '<span style="font-size:14px; font-weight:bold;">Wallet: KSh ' + this.state.wallet.toLocaleString() + '</span></div>' +
            '<input type="text" placeholder="Search products..." value="' + this.marketSettings.search + '" oninput="agriEngine.marketSettings.search=this.value; agriEngine.render()" style="width:100%; padding:12px; border-radius:8px; border:none; margin-bottom:10px;">' +
            '<div style="display:flex; gap:8px; overflow-x:auto;">' +
            cats.map(c => '<button onclick="agriEngine.marketSettings.category=\'' + c + '\'; agriEngine.render()" style="padding:8px 15px; border-radius:20px; border:none; background:' + (this.marketSettings.category === c ? 'white' : 'rgba(255,255,255,0.3)') + '; color:' + (this.marketSettings.category === c ? '#f68b1e' : 'white') + '; font-weight:bold; cursor:pointer; white-space:nowrap;">' + c + '</button>').join('') +
            '</div></div>' +
            '<div style="padding:10px; display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">' +
            items.map(i => '<div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">' +
                '<img src="' + i.i + '" style="width:100%; height:140px; object-fit:cover;">' +
                '<div style="padding:12px;">' +
                '<div style="font-size:11px; color:#666;">' + i.cat + '</div>' +
                '<div style="font-size:12px; font-weight:bold; height:32px; overflow:hidden; margin-bottom:8px;">' + i.n + '</div>' +
                '<div style="color:#f68b1e; font-weight:bold; font-size:16px; margin-bottom:8px;">KSh ' + i.p.toLocaleString() + '</div>' +
                '<div style="font-size:10px; color:' + (active ? '#f68b1e' : '#666') + '; font-weight:' + (active ? 'bold' : 'normal') + ';">' + t.label + '</div>' +
                (active ? '<div style="position:absolute; bottom:0; left:20%; right:20%; height:3px; background:#f68b1e; border-radius:3px 3px 0 0;"></div>' : '') +
                '</div>';
        }).join('');
    },
    showNotif: function(msg) {
        const n = document.createElement('div');
        n.textContent = msg;
        n.style.cssText = 'position:fixed; top:80px; left:50%; transform:translateX(-50%); background:#2d6a4f; color:white; padding:12px 24px; border-radius:8px; font-weight:bold; z-index:9999; box-shadow:0 4px 6px rgba(0,0,0,0.3);';
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 2000);
    }
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => agriEngine.init());
} else {
    agriEngine.init();
}
