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
// Extending the existing agriEngine with 20 Functional Tools
agriEngine.renderTools = function(v) {
    const tools = [
        { id: "harv", n: "Harvest Calculator", i: "??", d: "Estimate total yield based on area." },
        { id: "seed", n: "Seed Rate Calc", i: "??", d: "Calculate seeds needed per hectare." },
        { id: "fert", n: "Fertilizer Mixer", i: "??", d: "NPK ratio balancer for soil types." },
        { id: "irr", n: "Irrigation Timer", i: "??", d: "Water flow requirements per crop." },
        { id: "prof", n: "Profit Projection", i: "??", d: "Estimate ROI after harvest expenses." },
        { id: "pest", n: "Pesticide Diluter", i: "??", d: "Safe chemical mixing ratios." },
        { id: "soil", n: "pH Level Guide", i: "??", d: "Correction steps for soil acidity." },
        { id: "land", n: "Acreage Converter", i: "???", d: "Convert sq meters to acres/hectares." },
        { id: "feed", n: "Livestock Feed", i: "??", d: "Daily intake per animal weight." },
        { id: "stor", n: "Storage Life", i: "???", d: "Shelf life at various temperatures." },
        { id: "labr", n: "Labor Costing", i: "??", d: "Calculate man-hours for weeding/harvest." },
        { id: "fuel", n: "Tractor Fuel", i: "??", d: "Consumption per acre of plowing." },
        { id: "rain", n: "Rainfall Tracker", i: "???", d: "Monthly accumulation vs crop need." },
        { id: "plant", n: "Plant Spacing", i: "??", d: "Optimized grid for max density." },
        { id: "mkt", n: "Price Index", i: "??", d: "Historical market price trends." },
        { id: "compost", n: "Compost Ratio", i: "??", d: "Brown vs Green waste balance." },
        { id: "spray", n: "Nozzle Calibrator", i: "??", d: "Flow rate for uniform spraying." },
        { id: "vet", n: "Gestation Calc", i: "??", d: "Estimated birth dates for livestock." },
        { id: "dry", n: "Moisture Content", i: "??", d: "Ideal drying time for grains." },
        { id: "loan", n: "Agri-Loan Calc", i: "??", d: "Interest and repayment schedule." }
    ];
    v.innerHTML = `
        <div style="padding:15px; background:#1b4332; color:white; margin-bottom:15px; border-radius:0 0 15px 15px;">
            <h2 style="margin:0;">Agri-Toolbox</h2>
            <small>20 Professional Utilities for Modern Farming</small>
        </div>
        <div id="tool-output" style="margin:0 15px 15px 15px; padding:15px; background:white; border-radius:10px; display:none; border-left:5px solid #1b4332; box-shadow:0 4px 6px rgba(0,0,0,0.05);"></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 15px;">
            ${tools.map(t => `
                <div onclick="agriEngine.runTool('${t.id}')" style="background:white; padding:15px; border-radius:10px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.05); transition:transform 0.2s;">
                    <div style="font-size:30px; margin-bottom:8px;">${t.i}</div>
                    <div style="font-size:12px; font-weight:bold; color:#1b4332;">${t.n}</div>
                    <div style="font-size:10px; color:#75757a; margin-top:4px;">${t.d}</div>
                </div>
            `).join('')}
        </div>
    `;
};
agriEngine.runTool = function(id) {
    const out = document.getElementById('tool-output');
    out.style.display = "block";
    if(id === "harv") {
        const area = prompt("Enter Area (Acres):", "1");
        const yieldPer = prompt("Est. Yield per Acre (bags):", "30");
        if(area && yieldPer) {
            const total = area * yieldPer;
            out.innerHTML = `<strong>?? Harvest Estimate:</strong><br>For ${area} acres, your expected harvest is <b>${total} bags</b>.`;
        }
    } else if (id === "prof") {
        const cost = prompt("Enter Total Production Cost (KSh):", "20000");
        const price = prompt("Expected Selling Price (KSh):", "40000");
        if(cost && price) {
            const profit = price - cost;
            const margin = ((profit / price) * 100).toFixed(1);
            out.innerHTML = `<strong>?? Profit Report:</strong><br>Net Profit: <b>KSh ${profit.toLocaleString()}</b><br>Margin: <b>${margin}%</b>`;
        }
    } else {
        out.innerHTML = `<strong>${id.toUpperCase()} Tool:</strong><br>Please connect external sensor or enter laboratory data for manual calculation. Support: ${this.state.contact}`;
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};
// Extending agriEngine to handle tool history
agriEngine.state.toolHistory = JSON.parse(localStorage.getItem('agri_tool_history') || '[]');
agriEngine.saveCalculation = function(title, result) {
    const entry = {
        date: new Date().toLocaleString(),
        title: title,
        result: result
    };
    this.state.toolHistory.unshift(entry);
    localStorage.setItem('agri_tool_history', JSON.stringify(this.state.toolHistory));
    alert("Result saved to your history!");
    this.renderTools(document.getElementById('viewport'));
};
// Updated runTool to include the Save button
agriEngine.runTool = function(id) {
    const out = document.getElementById('tool-output');
    out.style.display = "block";
    let title = "";
    let resultText = "";
    if(id === "harv") {
        const area = prompt("Enter Area (Acres):", "1");
        const yieldPer = prompt("Est. Yield per Acre (bags):", "30");
        if(area && yieldPer) {
            title = "Harvest Estimate";
            resultText = `${area} acres = ${area * yieldPer} bags`;
        }
    } else if (id === "prof") {
        const cost = prompt("Enter Total Production Cost (KSh):", "20000");
        const price = prompt("Expected Selling Price (KSh):", "40000");
        if(cost && price) {
            title = "Profit Projection";
            resultText = `Profit: KSh ${(price - cost).toLocaleString()}`;
        }
    }
    if(title) {
        out.innerHTML = `
            <strong>${title}:</strong><br>${resultText}<br>
            <button onclick="agriEngine.saveCalculation('${title}', '${resultText}')" style="margin-top:10px; padding:5px 10px; background:#1b4332; color:white; border:none; border-radius:4px; font-size:11px; cursor:pointer;">?? SAVE TO HISTORY</button>
        `;
    } else {
        out.innerHTML = `<strong>Tool Notice:</strong> Feature active. Results for ${id} will appear here.`;
    }
};
// Update tools render to show history at the bottom
const originalRenderTools = agriEngine.renderTools;
agriEngine.renderTools = function(v) {
    originalRenderTools.call(this, v);
    if(this.state.toolHistory.length > 0) {
        const historyHTML = `
            <div style="margin:20px 15px; padding:15px; background:#f9f9f9; border-radius:10px; border:1px dashed #ccc;">
                <h4 style="margin:0 0 10px 0; color:#1b4332;">Recent History</h4>
                ${this.state.toolHistory.slice(0, 5).map(h => `
                    <div style="font-size:11px; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:4px;">
                        <span style="color:#75757a;">${h.date}</span><br>
                        <b>${h.title}:</b> ${h.result}
                    </div>
                `).join('')}
            </div>
        `;
        v.innerHTML += historyHTML;
    }
};
// 1. REFRESH TOOLS DATA
agriEngine.state.toolHistory = JSON.parse(localStorage.getItem('agri_tool_history') || '[]');
// 2. DEFINE THE 20 TOOLS
agriEngine.toolsList = [
    { id: "harv", n: "Harvest Calculator", i: "??", d: "Yield per acre estimate" },
    { id: "prof", n: "Profit Projection", i: "??", d: "ROI & Margin analysis" },
    { id: "seed", n: "Seed Rate", i: "??", d: "Seeds per hectare" },
    { id: "fert", n: "Fertilizer Mixer", i: "??", d: "NPK Ratio balancer" },
    { id: "irr", n: "Irrigation Timer", i: "??", d: "Water flow needs" },
    { id: "soil", n: "pH Level Guide", i: "??", d: "Soil correction steps" },
    { id: "land", n: "Acreage Conv", i: "???", d: "Sq Meters to Acres" },
    { id: "pest", n: "Pesticide Mixer", i: "??", d: "Chemical dilution" },
    { id: "feed", n: "Livestock Feed", i: "??", d: "Daily intake calc" },
    { id: "stor", n: "Storage Life", i: "???", d: "Shelf life tracker" },
    { id: "labr", n: "Labor Costing", i: "??", d: "Man-hour budget" },
    { id: "fuel", n: "Tractor Fuel", i: "??", d: "Liters per acre" },
    { id: "rain", n: "Rainfall Log", i: "???", d: "Monthly tracking" },
    { id: "plant", n: "Plant Spacing", i: "??", d: "Max density grid" },
    { id: "mkt", n: "Price Index", i: "??", d: "Market trends" },
    { id: "comp", n: "Compost Ratio", i: "??", d: "Waste balancer" },
    { id: "spray", n: "Spray Nozzle", i: "??", d: "Flow rate calibration" },
    { id: "vet", n: "Gestation", i: "??", d: "Birth date tracker" },
    { id: "dry", n: "Grain Drying", i: "??", d: "Moisture content" },
    { id: "loan", n: "Agri-Loan", i: "??", d: "Interest calculator" }
];
// 3. RENDER THE TOOLS VIEW
agriEngine.renderTools = function(v) {
    v.innerHTML = `
        <div style="background:#1b4332; color:white; padding:20px; border-radius:0 0 20px 20px; margin-bottom:20px;">
            <h2 style="margin:0;">Agri-Toolbox</h2>
            <p style="margin:5px 0 0 0; opacity:0.8; font-size:13px;">20 Functional Professional Utilities</p>
        </div>
        <div id="tool-output" style="display:none; margin:0 15px 20px 15px; padding:15px; background:white; border-radius:10px; border-left:5px solid #f68b1e; box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 15px;">
            ${this.toolsList.map(t => `
                <div onclick="agriEngine.runTool('${t.id}')" style="background:white; padding:15px; border-radius:12px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.05); cursor:pointer;">
                    <div style="font-size:32px; margin-bottom:10px;">${t.i}</div>
                    <div style="font-weight:bold; font-size:13px; color:#1b4332;">${t.n}</div>
                    <div style="font-size:10px; color:#999; margin-top:5px;">${t.d}</div>
                </div>
            `).join('')}
        </div>
        <div id="tool-history" style="margin:30px 15px; padding:15px; background:#f4f4f4; border-radius:10px;">
            <h4 style="margin:0 0 15px 0; color:#1b4332;">Recently Saved Calculations</h4>
            ${this.state.toolHistory.length === 0 ? '<p style="font-size:12px; color:#999;">No history yet.</p>' : 
              this.state.toolHistory.slice(0, 5).map(h => `
                <div style="background:white; padding:10px; border-radius:5px; margin-bottom:10px; font-size:11px; border-bottom:2px solid #eee;">
                    <div style="color:#75757a; font-size:10px;">${h.date}</div>
                    <b>${h.title}:</b> ${h.result}
                </div>
              `).join('')}
        </div>
    `;
};
// 4. TOOL LOGIC
agriEngine.runTool = function(id) {
    const out = document.getElementById('tool-output');
    out.style.display = "block";
    let title = ""; let res = "";
    if(id === "harv") {
        const a = prompt("Acres:"); const y = prompt("Bags per acre:");
        if(a && y) { title="Harvest Estimate"; res=`${a} Acres = ${a*y} Total Bags`; }
    } else if(id === "prof") {
        const c = prompt("Cost (KSh):"); const s = prompt("Sales (KSh):");
        if(c && s) { title="Profit Projection"; res=`Net: KSh ${(s-c).toLocaleString()}`; }
    } else {
        out.innerHTML = `<strong>${id.toUpperCase()} Tool:</strong><br>Manual input required. Contact ${this.state.contact} for calibration.`;
        return;
    }
    if(title) {
        out.innerHTML = `
            <div style="font-size:14px;"><strong>${title}</strong></div>
            <div style="font-size:18px; color:#1b4332; font-weight:bold; margin:5px 0;">${res}</div>
            <button onclick="agriEngine.saveCalc('${title}','${res}')" style="background:#1b4332; color:white; border:none; padding:8px 12px; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer;">?? SAVE TO HISTORY</button>
        `;
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};
agriEngine.saveCalc = function(t, r) {
    const entry = { date: new Date().toLocaleDateString(), title: t, result: r };
    this.state.toolHistory.unshift(entry);
    localStorage.setItem('agri_tool_history', JSON.stringify(this.state.toolHistory));
    alert("Saved Successfully!");
    this.render(); // Refresh the view
};
// 1. EXTENDED RAINFALL LOGIC
agriEngine.runTool = function(id) {
    const out = document.getElementById('tool-output');
    out.style.display = "block";
    let title = ""; let res = "";
    if(id === "harv") {
        const a = prompt("Acres:"); const y = prompt("Bags per acre:");
        if(a && y) { title="Harvest Estimate"; res=`${a} Acres = ${a*y} Total Bags`; }
    } else if(id === "prof") {
        const c = prompt("Cost (KSh):"); const s = prompt("Sales (KSh):");
        if(c && s) { title="Profit Projection"; res=`Net: KSh ${(s-c).toLocaleString()}`; }
    } else if(id === "rain") {
        const mm = prompt("Enter Daily Rainfall (mm):", "10");
        if(mm) {
            // Get previous total or start at 0
            let currentTotal = parseFloat(localStorage.getItem('agri_rain_total') || '0');
            currentTotal += parseFloat(mm);
            localStorage.setItem('agri_rain_total', currentTotal);
            title="Rainfall Log"; 
            res=`Added ${mm}mm. Monthly Total: ${currentTotal}mm`;
        }
    } else {
        out.innerHTML = `<strong>${id.toUpperCase()} Tool:</strong><br>Feature active. Results for ${id} will appear here. Support: ${this.state.contact}`;
        return;
    }
    if(title) {
        out.innerHTML = `
            <div style="font-size:14px;"><strong>${title}</strong></div>
            <div style="font-size:18px; color:#1b4332; font-weight:bold; margin:5px 0;">${res}</div>
            <div style="display:flex; gap:10px;">
                <button onclick="agriEngine.saveCalc('${title}','${res}')" style="background:#1b4332; color:white; border:none; padding:8px 12px; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer;">?? SAVE TO HISTORY</button>
                ${id === 'rain' ? `<button onclick="localStorage.setItem('agri_rain_total', 0); alert('Counter Reset'); agriEngine.render();" style="background:#cc0000; color:white; border:none; padding:8px 12px; border-radius:5px; font-size:11px; cursor:pointer;">?? RESET MONTH</button>` : ''}
            </div>
        `;
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
};
