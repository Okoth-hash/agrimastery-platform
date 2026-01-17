// =========================================================================================
// AgriMastery Platform Engine - Complete System
// =========================================================================================
const agriEngine = {
    // ============================================================
    // STATE MANAGEMENT
    // ============================================================
    state: {
        wallet: 15000,
        cart: [],
        activeTab: 'market',
        inventory: [],
        currentPage: 1,
        userName: 'OMONDI ROBIN'
    },
    adminSettings: {
        pin: "1234",
        isLocked: true
    },
    marketSettings: {
        search: "",
        category: "All"
    },
    // ============================================================
    // INITIALIZATION
    // ============================================================
    init: function() {
        this.loadCart();
        this.generateInventory();
        this.setupEventListeners();
        this.render();
    },
    loadCart: function() {
        try {
            const saved = localStorage.getItem('agri_cart');
            if (saved) {
                this.state.cart = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load cart:', e);
            this.state.cart = [];
        }
    },
    saveCart: function() {
        try {
            localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        } catch (e) {
            console.warn('Could not save cart:', e);
        }
    },
    // ============================================================
    // INVENTORY GENERATION (100+ Products)
    // ============================================================
    generateInventory: function() {
        const baseProducts = [
            { n: "Hybrid Maize Seeds", p: 2850, i: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=300", c: "Seeds" },
            { n: "NPK Fertilizer 50kg", p: 5900, i: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300", c: "Fertilizer" },
            { n: "Solar Water Pump", p: 18500, i: "https://images.unsplash.com/photo-1581094288338-2314dddb7903?w=300", c: "Equipment" },
            { n: "Backpack Sprayer 20L", p: 4200, i: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=300", c: "Tools" },
            { n: "Organic Pesticide 5L", p: 3500, i: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300", c: "Chemicals" },
            { n: "Drip Irrigation Kit", p: 12000, i: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300", c: "Equipment" },
            { n: "Garden Hoe Premium", p: 1800, i: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=300", c: "Tools" },
            { n: "Greenhouse Film 200m", p: 8500, i: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", c: "Supplies" },
            { n: "Tomato Seeds F1", p: 1200, i: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", c: "Seeds" },
            { n: "Wheelbarrow Heavy Duty", p: 6500, i: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=300", c: "Equipment" }
        ];
        for (let i = 0; i < 105; i++) {
            const template = baseProducts[i % baseProducts.length];
            this.state.inventory.push({
                id: i,
                n: `${template.n} SKU-${1000 + i}`,
                p: template.p + (i * 50),
                i: template.i,
                cat: template.c,
                stock: Math.floor(Math.random() * 100) + 10
            });
        }
    },
    // ============================================================
    // CART MANAGEMENT
    // ============================================================
    addToCart: function(productId) {
        const product = this.state.inventory.find(p => p.id === productId);
        if (!product) return;
        const existingItem = this.state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty++;
        } else {
            this.state.cart.push({
                id: product.id,
                n: product.n,
                p: product.p,
                qty: 1
            });
        }
        this.saveCart();
        this.showNotification(`Added ${product.n} to cart!`);
        this.updateCartBadge();
    },
    removeFromCart: function(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.render();
    },
    getCartTotal: function() {
        return this.state.cart.reduce((sum, item) => sum + (item.p * item.qty), 0);
    },
    checkout: function() {
        const total = this.getCartTotal();
        if (total > this.state.wallet) {
            alert('❌ Insufficient funds! Please add money to your wallet.');
            return;
        }
        if (this.state.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        this.state.wallet -= total;
        const itemCount = this.state.cart.length;
        this.state.cart = [];
        this.saveCart();
        alert(`✅ Order placed successfully!\n${itemCount} items purchased\nRemaining balance: KSh ${this.state.wallet.toLocaleString()}`);
        this.render();
    },
    updateCartBadge: function() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.state.cart.reduce((sum, item) => sum + item.qty, 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    },
    // ============================================================
    // NAVIGATION
    // ============================================================
    switchTab: function(tab) {
        this.state.activeTab = tab;
        this.render();
    },
    setupEventListeners: function() {
        window.addEventListener('popstate', () => {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') || 'market';
            this.state.activeTab = tab;
            this.render();
        });
    },
    // ============================================================
    // RENDERING FUNCTIONS
    // ============================================================
    render: function() {
        const view = document.getElementById('app-view');
        if (!view) return;
        // Render based on active tab
        switch (this.state.activeTab) {
            case 'market':
                this.renderMarket(view);
                break;
            case 'academy':
                this.renderAcademy(view);
                break;
            case 'tools':
                this.renderTools(view);
                break;
            case 'admin':
                this.renderAdmin(view);
                break;
            case 'cart':
                this.renderCart(view);
                break;
            default:
                this.renderMarket(view);
        }
        this.updateNavigation();
        this.updateCartBadge();
    },
    renderMarket: function(view) {
        const items = this.state.inventory.filter(item => {
            const matchesSearch = item.n.toLowerCase().includes(this.marketSettings.search.toLowerCase());
            const matchesCategory = this.marketSettings.category === "All" || item.cat === this.marketSettings.category;
            return matchesSearch && matchesCategory;
        });
        const categories = ["All", ...new Set(this.state.inventory.map(i => i.cat))];
        view.innerHTML = `
            <div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">
                <!-- Header -->
                <div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:1000; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; font-weight:bold;">📞 0742178833</span>
                        <span style="font-size:14px; font-weight:bold;">Wallet: KSh ${this.state.wallet.toLocaleString()}</span>
                    </div>
                    <input type="text" 
                           placeholder="Search ${this.state.inventory.length}+ products..." 
                           value="${this.marketSettings.search}"
                           oninput="agriEngine.marketSettings.search=this.value; agriEngine.render()"
                           style="width:100%; padding:12px; border-radius:8px; border:none; font-size:16px; margin-bottom:10px;">
                    <!-- Category Filter -->
                    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:5px;">
                        ${categories.map(cat => `
                            <button onclick="agriEngine.marketSettings.category='${cat}'; agriEngine.render()"
                                    style="padding:8px 15px; border-radius:20px; border:none; background:${this.marketSettings.category === cat ? 'white' : 'rgba(255,255,255,0.3)'}; color:${this.marketSettings.category === cat ? '#f68b1e' : 'white'}; font-weight:bold; cursor:pointer; white-space:nowrap; font-size:12px;">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <!-- Products Grid -->
                <div style="padding:10px; display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
                    ${items.map(item => `
                        <div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); transition:transform 0.2s;">
                            <img src="${item.i}" 
                                 alt="${item.n}"
                                 style="width:100%; height:140px; object-fit:cover;">
                            <div style="padding:12px;">
                                <div style="font-size:11px; color:#666; margin-bottom:4px;">${item.cat}</div>
                                <div style="font-size:12px; font-weight:bold; height:32px; overflow:hidden; margin-bottom:8px; line-height:1.3;">
                                    ${item.n}
                                </div>
                                <div style="color:#f68b1e; font-weight:bold; font-size:16px; margin-bottom:8px;">
                                    KSh ${item.p.toLocaleString()}
                                </div>
                                <div style="font-size:10px; color:#666; margin-bottom:10px;">
                                    Stock: ${item.stock} units
                                </div>
                                <button onclick="agriEngine.addToCart(${item.id})"
                                        style="width:100%; background:#f68b1e; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px;">
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${items.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px; color:#666;">
                        <div style="font-size:48px; margin-bottom:10px;">🔍</div>
                        <div style="font-size:18px; font-weight:bold; margin-bottom:5px;">No products found</div>
                        <div style="font-size:14px;">Try adjusting your search or filters</div>
                    </div>
                ` : ''}
            </div>
        `;
    },
    renderCart: function(view) {
        const total = this.getCartTotal();
        view.innerHTML = `
            <div style="background:#f8f9fa; min-height:100vh; padding-bottom:100px;">
                <div style="background:#f68b1e; color:white; padding:20px; position:sticky; top:0; z-index:1000;">
                    <h2 style="margin:0; font-size:24px;">Shopping Cart</h2>
                    <div style="font-size:14px; margin-top:5px;">${this.state.cart.length} items</div>
                </div>
                ${this.state.cart.length === 0 ? `
                    <div style="text-align:center; padding:80px 20px;">
                        <div style="font-size:64px; margin-bottom:20px;">🛒</div>
                        <h3 style="color:#666; margin-bottom:10px;">Your cart is empty</h3>
                        <p style="color:#999; margin-bottom:30px;">Add some products to get started!</p>
                        <button onclick="agriEngine.switchTab('market')"
                                style="background:#f68b1e; color:white; border:none; padding:15px 40px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">
                            BROWSE PRODUCTS
                        </button>
                    </div>
                ` : `
                    <div style="padding:15px;">
                        ${this.state.cart.map(item => `
                            <div style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                                <div style="display:flex; justify-content:space-between; align-items:start;">
                                    <div style="flex:1;">
                                        <div style="font-weight:bold; font-size:14px; margin-bottom:5px;">${item.n}</div>
                                        <div style="color:#f68b1e; font-weight:bold; font-size:16px;">KSh ${item.p.toLocaleString()}</div>
                                        <div style="color:#666; font-size:12px; margin-top:5px;">Quantity: ${item.qty}</div>
                                    </div>
                                    <button onclick="agriEngine.removeFromCart(${item.id})"
                                            style="background:#ef4444; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:12px;">
                                        Remove
                                    </button>
                                </div>
                                <div style="text-align:right; margin-top:10px; padding-top:10px; border-top:1px solid #e5e7eb;">
                                    <span style="color:#666; font-size:12px;">Subtotal: </span>
                                    <span style="font-weight:bold; color:#f68b1e; font-size:14px;">KSh ${(item.p * item.qty).toLocaleString()}</span>
                                </div>
                            </div>
                        `).join('')}
                        <!-- Total & Checkout -->
                        <div style="background:white; padding:20px; border-radius:10px; margin-top:20px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:18px;">
                                <span style="font-weight:bold;">Total:</span>
                                <span style="color:#f68b1e; font-weight:bold;">KSh ${total.toLocaleString()}</span>
                            </div>
                            <div style="font-size:12px; color:#666; margin-bottom:15px;">
                                Wallet Balance: KSh ${this.state.wallet.toLocaleString()}
                                ${total > this.state.wallet ? '<br><span style="color:#ef4444;">⚠️ Insufficient funds</span>' : ''}
                            </div>
                            <button onclick="agriEngine.checkout()"
                                    style="width:100%; background:#2d6a4f; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
    },
    renderAcademy: function(view) {
        view.innerHTML = `
            <div style="background:#fff; min-height:100vh; padding-bottom:100px;">
                <div style="background:#1b4332; color:white; padding:20px;">
                    <h2 style="margin:0 0 10px 0; font-size:24px;">🎓 Agri-Academy</h2>
                    <div style="font-size:14px; opacity:0.9;">${this.state.userName}</div>
                    <div style="background:rgba(255,255,255,0.2); padding:10px; border-radius:6px; margin-top:15px;">
                        <div style="font-size:12px; margin-bottom:5px;">Progress</div>
                        <div style="background:rgba(0,0,0,0.2); height:8px; border-radius:4px; overflow:hidden;">
                            <div style="background:#52b788; height:100%; width:${(this.state.currentPage/1000)*100}%;"></div>
                        </div>
                        <div style="font-size:11px; margin-top:5px; text-align:right;">Page ${this.state.currentPage} / 1000</div>
                    </div>
                </div>
                <div style="padding:20px; line-height:1.8; color:#333;">
                    <h3 style="color:#1b4332; margin-top:0;">Chapter 1: Introduction to Soil Chemistry</h3>
                    <p>Understanding soil chemistry is fundamental to successful agriculture. The soil is not just a medium for plant growth—it's a complex ecosystem that determines nutrient availability, water retention, and overall crop health.</p>
                    <div style="background:#e8f5e9; padding:15px; border-left:4px solid #2d6a4f; margin:20px 0; border-radius:4px;">
                        <div style="font-weight:bold; color:#1b4332; margin-bottom:8px;">🔑 Key Concept</div>
                        <p style="margin:0;">The NPK ratio (Nitrogen-Phosphorus-Potassium) is the foundation of fertilizer selection. Each element plays a specific role in plant development.</p>
                    </div>
                    <h4 style="color:#2d6a4f;">Soil pH and Nutrient Availability</h4>
                    <p>Soil pH affects how easily plants can absorb nutrients. Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0). When pH is too high or too low, certain nutrients become locked in the soil and unavailable to plants.</p>
                    <ul style="line-height:2;">
                        <li><strong>Acidic soils (pH &lt; 6.0):</strong> Common in high-rainfall areas, may need lime application</li>
                        <li><strong>Neutral soils (pH 6.0-7.0):</strong> Optimal for most crops</li>
                        <li><strong>Alkaline soils (pH &gt; 7.0):</strong> May require sulfur or organic matter</li>
                    </ul>
                    <div style="background:#fff3cd; padding:15px; border-left:4px solid #f68b1e; margin:20px 0; border-radius:4px;">
                        <div style="font-weight:bold; color:#856404; margin-bottom:8px;">💡 Practical Tip</div>
                        <p style="margin:0;">Test your soil pH before planting. Simple test kits are available for under KSh 500 and can save you thousands in wasted fertilizer.</p>
                    </div>
                    <h4 style="color:#2d6a4f;">Essential Macro-Nutrients</h4>
                    <p><strong>Nitrogen (N):</strong> Promotes leafy green growth and is essential for photosynthesis. Deficiency shows as yellowing leaves.</p>
                    <p><strong>Phosphorus (P):</strong> Critical for root development and flowering. Helps with energy transfer in plants.</p>
                    <p><strong>Potassium (K):</strong> Improves disease resistance and helps regulate water use. Strengthens stems and improves fruit quality.</p>
                </div>
                <div style="padding:0 20px 20px;">
                    <button onclick="agriEngine.state.currentPage++; agriEngine.render(); window.scrollTo(0,0);"
                            style="width:100%; background:#2d6a4f; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">
                        NEXT PAGE →
                    </button>
                </div>
            </div>
        `;
    },
    renderTools: function(view) {
        const tools = [
            { n: "Harvest Calculator", i: "🌾", c: "#2d6a4f", desc: "Calculate expected yields" },
            { n: "Soil pH Tester", i: "📉", c: "#ae2012", desc: "Track soil acidity levels" },
            { n: "Rainfall Logger", i: "🌧️", c: "#0077b6", desc: "Monitor precipitation" },
            { n: "Profit/Loss Tracker", i: "📈", c: "#f68b1e", desc: "Financial analysis" },
            { n: "Seed Spacing Guide", i: "📏", c: "#52b788", desc: "Optimize plant density" },
            { n: "Pest Alert System", i: "🐛", c: "#6d597a", desc: "Early warning system" },
            { n: "Weather Forecast", i: "☀️", c: "#fbbf24", desc: "7-day predictions" },
            { n: "Fertilizer Calculator", i: "⚗️", c: "#8b5cf6", desc: "NPK requirements" }
        ];
        view.innerHTML = `
            <div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">
                <div style="background:#2d6a4f; color:white; padding:20px;">
                    <h2 style="margin:0; font-size:24px;">🛠️ Farm Tools</h2>
                    <div style="font-size:14px; margin-top:5px; opacity:0.9;">${tools.length} tools available</div>
                </div>
                <div style="padding:15px; display:grid; grid-template-columns:repeat(2, 1fr); gap:15px;">
                    ${tools.map(tool => `
                        <div onclick="alert('${tool.n}\\n\\n${tool.desc}\\n\\nComing soon in next update!')"
                             style="background:white; padding:20px 15px; border-radius:12px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.1); cursor:pointer; transition:transform 0.2s; border-bottom:4px solid ${tool.c};"
                             onmouseover="this.style.transform='translateY(-5px)'"
                             onmouseout="this.style.transform='translateY(0)'">
                            <div style="font-size:40px; margin-bottom:12px;">${tool.i}</div>
                            <div style="color:${tool.c}; font-weight:bold; font-size:13px; margin-bottom:6px;">${tool.n.toUpperCase()}</div>
                            <div style="color:#666; font-size:10px; line-height:1.3;">${tool.desc}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    renderAdmin: function(view) {
        if (this.adminSettings.isLocked) {
            view.innerHTML = `
                <div style="background:#0f172a; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px;">
                    <div style="text-align:center; max-width:400px; width:100%;">
                        <div style="background:#1e293b; padding:40px 30px; border-radius:16px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
                            <div style="font-size:64px; margin-bottom:20px;">🔐</div>
                            <h2 style="color:white; margin:0 0 10px 0;">Admin Access</h2>
                            <p style="color:#94a3b8; margin:0 0 30px 0; font-size:14px;">Enter PIN to continue</p>
                            <input type="password" 
                                   id="admin-pin" 
                                   placeholder="••••" 
                                   maxlength="4"
                                   style="width:140px; padding:18px; text-align:center; font-size:28px; border-radius:10px; border:2px solid #334155; background:#1e293b; color:white; margin-bottom:25px; letter-spacing:10px;"
                                   onkeyup="if(event.key==='Enter' && this.value==='1234'){agriEngine.adminSettings.isLocked=false; agriEngine.render();}else if(event.key==='Enter'){alert('❌ Wrong PIN'); this.value='';}">
                            <br>
                            <button onclick="const pin=document.getElementById('admin-pin').value; if(pin==='1234'){agriEngine.adminSettings.isLocked=false; agriEngine.render();}else{alert('❌ Wrong PIN'); document.getElementById('admin-pin').value='';}"
                                    style="background:#38bdf8; color:#0f172a; border:none; padding:15px 50px; border-radius:10px; font-weight:bold; cursor:pointer; font-size:16px; transition:background 0.2s;"
                                    onmouseover="this.style.background='#0ea5e9'"
                                    onmouseout="this.style.background='#38bdf8'">
                                UNLOCK
                            </button>
                            <div style="margin-top:30px; padding-top:20px; border-top:1px solid #334155;">
                                <div style="color:#64748b; font-size:11px; margin-bottom:5px;">Default PIN</div>
                                <div style="color:#94a3b8; font-size:12px; font-family:monospace;">1234</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const stats = {
                totalProducts: this.state.inventory.length,
                cartItems: this.state.cart.length,
                totalRevenue: this.getCartTotal(),
                academyProgress: `${this.state.currentPage}/1000 pages`
            };
            view.innerHTML = `
                <div style="background:#0f172a; min-height:100vh; padding-bottom:100px;">
                    <div style="background:#1e293b; padding:20px; border-bottom:2px solid #334155;">
                        <h2 style="color:white; margin:0 0 5px 0; font-size:24px;">⚙️ Master Control</h2>
                        <div style="color:#94a3b8; font-size:14px;">System Administration</div>
                    </div>
                    <div style="padding:20px;">
                        <!-- Stats Grid -->
                        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:15px; margin-bottom:25px;">
                            <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #38bdf8;">
                                <div style="color:#94a3b8; font-size:12px; margin-bottom:5px;">PRODUCTS</div>
                                <div style="color:white; font-size:28px; font-weight:bold;">${stats.totalProducts}</div>
                            </div>
                            <div style="# =========================================================================================
# PROJECT: AgriMastery - Complete Platform Deployment
# DESCRIPTION: Full-featured agricultural e-commerce and learning platform
# FEATURES: 100+ Products, Academy, Tools, Admin Panel (PIN: 1234)
# =========================================================================================
Write-Host "🌾 AgriMastery Platform - Complete Deployment Script" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
# Set working directory
$projectPath = "C:\Users\PC\Desktop\AgriMastery\agrimastery-platform"
# Check if directory exists
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Error: Project directory not found at $projectPath" -ForegroundColor Red
    Write-Host "Creating directory structure..." -ForegroundColor Yellow
    New-Item -Path $projectPath -ItemType Directory -Force | Out-Null
}
Set-Location $projectPath
# Create necessary directory structure
Write-Host "📁 Creating directory structure..." -ForegroundColor Cyan
$directories = @(
    "apps\academy\public\js",
    "apps\academy\public\css",
    "apps\academy\public\images"
)
foreach ($dir in $directories) {
    $fullPath = Join-Path $projectPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Gray
    }
}
# =========================================================================================
# MAIN ENGINE.JS - Complete Platform Logic
# =========================================================================================
$engineJS = @'
// =========================================================================================
// AgriMastery Platform Engine - Complete System
// =========================================================================================
const agriEngine = {
    // ============================================================
    // STATE MANAGEMENT
    // ============================================================
    state: {
        wallet: 15000,
        cart: [],
        activeTab: 'market',
        inventory: [],
        currentPage: 1,
        userName: 'OMONDI ROBIN'
    },
    adminSettings: {
        pin: "1234",
        isLocked: true
    },
    marketSettings: {
        search: "",
        category: "All"
    },
    // ============================================================
    // INITIALIZATION
    // ============================================================
    init: function() {
        this.loadCart();
        this.generateInventory();
        this.setupEventListeners();
        this.render();
    },
    loadCart: function() {
        try {
            const saved = localStorage.getItem('agri_cart');
            if (saved) {
                this.state.cart = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load cart:', e);
            this.state.cart = [];
        }
    },
    saveCart: function() {
        try {
            localStorage.setItem('agri_cart', JSON.stringify(this.state.cart));
        } catch (e) {
            console.warn('Could not save cart:', e);
        }
    },
    // ============================================================
    // INVENTORY GENERATION (100+ Products)
    // ============================================================
    generateInventory: function() {
        const baseProducts = [
            { n: "Hybrid Maize Seeds", p: 2850, i: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=300", c: "Seeds" },
            { n: "NPK Fertilizer 50kg", p: 5900, i: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300", c: "Fertilizer" },
            { n: "Solar Water Pump", p: 18500, i: "https://images.unsplash.com/photo-1581094288338-2314dddb7903?w=300", c: "Equipment" },
            { n: "Backpack Sprayer 20L", p: 4200, i: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=300", c: "Tools" },
            { n: "Organic Pesticide 5L", p: 3500, i: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300", c: "Chemicals" },
            { n: "Drip Irrigation Kit", p: 12000, i: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300", c: "Equipment" },
            { n: "Garden Hoe Premium", p: 1800, i: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=300", c: "Tools" },
            { n: "Greenhouse Film 200m", p: 8500, i: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", c: "Supplies" },
            { n: "Tomato Seeds F1", p: 1200, i: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", c: "Seeds" },
            { n: "Wheelbarrow Heavy Duty", p: 6500, i: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=300", c: "Equipment" }
        ];
        for (let i = 0; i < 105; i++) {
            const template = baseProducts[i % baseProducts.length];
            this.state.inventory.push({
                id: i,
                n: `${template.n} SKU-${1000 + i}`,
                p: template.p + (i * 50),
                i: template.i,
                cat: template.c,
                stock: Math.floor(Math.random() * 100) + 10
            });
        }
    },
    // ============================================================
    // CART MANAGEMENT
    // ============================================================
    addToCart: function(productId) {
        const product = this.state.inventory.find(p => p.id === productId);
        if (!product) return;
        const existingItem = this.state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty++;
        } else {
            this.state.cart.push({
                id: product.id,
                n: product.n,
                p: product.p,
                qty: 1
            });
        }
        this.saveCart();
        this.showNotification(`Added ${product.n} to cart!`);
        this.updateCartBadge();
    },
    removeFromCart: function(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.render();
    },
    getCartTotal: function() {
        return this.state.cart.reduce((sum, item) => sum + (item.p * item.qty), 0);
    },
    checkout: function() {
        const total = this.getCartTotal();
        if (total > this.state.wallet) {
            alert('❌ Insufficient funds! Please add money to your wallet.');
            return;
        }
        if (this.state.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        this.state.wallet -= total;
        const itemCount = this.state.cart.length;
        this.state.cart = [];
        this.saveCart();
        alert(`✅ Order placed successfully!\n${itemCount} items purchased\nRemaining balance: KSh ${this.state.wallet.toLocaleString()}`);
        this.render();
    },
    updateCartBadge: function() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.state.cart.reduce((sum, item) => sum + item.qty, 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    },
    // ============================================================
    // NAVIGATION
    // ============================================================
    switchTab: function(tab) {
        this.state.activeTab = tab;
        this.render();
    },
    setupEventListeners: function() {
        window.addEventListener('popstate', () => {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') || 'market';
            this.state.activeTab = tab;
            this.render();
        });
    },
    // ============================================================
    // RENDERING FUNCTIONS
    // ============================================================
    render: function() {
        const view = document.getElementById('app-view');
        if (!view) return;
        // Render based on active tab
        switch (this.state.activeTab) {
            case 'market':
                this.renderMarket(view);
                break;
            case 'academy':
                this.renderAcademy(view);
                break;
            case 'tools':
                this.renderTools(view);
                break;
            case 'admin':
                this.renderAdmin(view);
                break;
            case 'cart':
                this.renderCart(view);
                break;
            default:
                this.renderMarket(view);
        }
        this.updateNavigation();
        this.updateCartBadge();
    },
    renderMarket: function(view) {
        const items = this.state.inventory.filter(item => {
            const matchesSearch = item.n.toLowerCase().includes(this.marketSettings.search.toLowerCase());
            const matchesCategory = this.marketSettings.category === "All" || item.cat === this.marketSettings.category;
            return matchesSearch && matchesCategory;
        });
        const categories = ["All", ...new Set(this.state.inventory.map(i => i.cat))];
        view.innerHTML = `
            <div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">
                <!-- Header -->
                <div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:1000; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; font-weight:bold;">📞 0742178833</span>
                        <span style="font-size:14px; font-weight:bold;">Wallet: KSh ${this.state.wallet.toLocaleString()}</span>
                    </div>
                    <input type="text" 
                           placeholder="Search ${this.state.inventory.length}+ products..." 
                           value="${this.marketSettings.search}"
                           oninput="agriEngine.marketSettings.search=this.value; agriEngine.render()"
                           style="width:100%; padding:12px; border-radius:8px; border:none; font-size:16px; margin-bottom:10px;">
                    <!-- Category Filter -->
                    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:5px;">
                        ${categories.map(cat => `
                            <button onclick="agriEngine.marketSettings.category='${cat}'; agriEngine.render()"
                                    style="padding:8px 15px; border-radius:20px; border:none; background:${this.marketSettings.category === cat ? 'white' : 'rgba(255,255,255,0.3)'}; color:${this.marketSettings.category === cat ? '#f68b1e' : 'white'}; font-weight:bold; cursor:pointer; white-space:nowrap; font-size:12px;">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <!-- Products Grid -->
                <div style="padding:10px; display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
                    ${items.map(item => `
                        <div style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); transition:transform 0.2s;">
                            <img src="${item.i}" 
                                 alt="${item.n}"
                                 style="width:100%; height:140px; object-fit:cover;">
                            <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #f68b1e;">
                                <div style="color:#94a3b8; font-size:12px; margin-bottom:5px;">CART ITEMS</div>
                                <div style="color:white; font-size:28px; font-weight:bold;">${stats.cartItems}</div>
                            </div>
                            <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #2d6a4f;">
                                <div style="color:#94a3b8; font-size:12px; margin-bottom:5px;">WALLET</div>
                                <div style="color:white; font-size:20px; font-weight:bold;">KSh ${this.state.wallet.toLocaleString()}</div>
                            </div>
                            <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:4px solid #8b5cf6;">
                                <div style="color:#94a3b8; font-size:12px; margin-bottom:5px;">ACADEMY</div>
                                <div style="color:white; font-size:16px; font-weight:bold;">${stats.academyProgress}</div>
                            </div>
                        </div>
                        <!-- User Info -->
                        <div style="background:#1e293b; padding:20px; border-radius:10px; margin-bottom:20px;">
                            <div style="color:#94a3b8; font-size:12px; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;">User Information</div>
                            <div style="color:white; margin-bottom:8px;"><strong>Name:</strong> ${this.state.userName}</div>
                            <div style="color:white; margin-bottom:8px;"><strong>Wallet Balance:</strong> KSh ${this.state.wallet.toLocaleString()}</div>
                            <div style="color:white; margin-bottom:8px;"><strong>Total Products:</strong> ${stats.totalProducts}</div>
                            <div style="color:white;"><strong>Learning Progress:</strong> ${stats.academyProgress}</div>
                        </div>
                        <!-- Quick Actions -->
                        <div style="background:#1e293b; padding:20px; border-radius:10px; margin-bottom:20px;">
                            <div style="color:#94a3b8; font-size:12px; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px;">Quick Actions</div>
                            <button onclick="agriEngine.state.wallet += 10000; agriEngine.render(); alert('✅ Added KSh 10,000 to wallet')"
                                    style="width:100%; background:#2d6a4f; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:10px;">
                                💰 Add KSh 10,000 to Wallet
                            </button>
                            <button onclick="if(confirm('Clear all cart items?')){agriEngine.state.cart=[]; agriEngine.saveCart(); agriEngine.render();}"
                                    style="width:100%; background:#f59e0b; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:10px;">
                                🛒 Clear Cart
                            </button>
                            <button onclick="agriEngine.state.currentPage=1; agriEngine.render(); alert('Academy progress reset')"
                                    style="width:100%; background:#8b5cf6; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">
                                📚 Reset Academy Progress
                            </button>
                        </div>
                        <!-- System Control -->
                        <button onclick="if(confirm('Lock admin panel?')){agriEngine.adminSettings.isLocked=true; agriEngine.render();}"
                                style="width:100%; background:#ef4444; color:white; border:none; padding:18px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">
                            🔒 LOCK SYSTEM
                        </button>
                    </div>
                </div>
            `;
        }
    },
    updateNavigation: function() {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;
        const tabs = [
            { id: 'market', icon: '🛒', label: 'Market' },
            { id: 'academy', icon: '📚', label: 'Academy' },
            { id: 'tools', icon: '🛠️', label: 'Tools' },
            { id: 'cart', icon: '🛍️', label: 'Cart' },
            { id: 'admin', icon: '⚙️', label: 'Admin' }
        ];
        nav.innerHTML = tabs.map(tab => {
            const isActive = this.state.activeTab === tab.id;
            return `
                <div onclick="agriEngine.switchTab('${tab.id}')"
                     style="flex:1; text-align:center; padding:10px 5px; cursor:pointer; position:relative; transition:all 0.2s;">
                    ${tab.id === 'cart' ? `<span id="cart-badge" style="position:absolute; top:5px; right:calc(50% - 25px); background:#ef4444; color:white; border-radius:10px; padding:2px 6px; font-size:10px; font-weight:bold; display:none;"></span>` : ''}
                    <div style="font-size:24px; margin-bottom:2px;">${tab.icon}</div>
                    <div style="font-size:10px; color:${isActive ? '#f68b1e' : '#666'}; font-weight:${isActive ? 'bold' : 'normal'};">
                        ${tab.label}
                    </div>
                    ${isActive ? `<div style="position:absolute; bottom:0; left:20%; right:20%; height:3px; background:#f68b1e; border-radius:3px 3px 0 0;"></div>` : ''}
                </div>
            `;
        }).join('');
    },
    showNotification: function(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position:fixed; top:80px; left:50%; transform:translateX(-50%);
            background:#2d6a4f; color:white; padding:12px 24px;
            border-radius:8px; font-weight:bold; z-index:9999;
            box-shadow:0 4px 6px rgba(0,0,0,0.3); animation:slideDown 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
};
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => agriEngine.init());
} else {
    agriEngine.init();
}
// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform:translateX(-50%) translateY(-20px); opacity:0; }
        to { transform:translateX(-50%) translateY(0); opacity:1; }
    }
`;
document.head.appendChild(style);
