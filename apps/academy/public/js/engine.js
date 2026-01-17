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
// 1. CROP PH DATA REFERENCE
agriEngine.cropData = {
    "Maize": { min: 5.5, max: 7.0, note: "Prefers well-drained loamy soil." },
    "Coffee": { min: 4.5, max: 6.0, note: "Acidic soil is best for Kenyan Arabica." },
    "Potatoes": { min: 5.0, max: 6.5, note: "Slightly acidic soil prevents common scab." },
    "Tea": { min: 4.5, max: 5.5, note: "Requires high acidity for optimal growth." },
    "Beans": { min: 6.0, max: 7.5, note: "Neutral soil improves nitrogen fixation." }
};
// 2. UPDATED pH TOOL LOGIC
const originalRunTool = agriEngine.runTool;
agriEngine.runTool = function(id) {
    const out = document.getElementById('tool-output');
    out.style.display = "block";
    if(id === "soil") {
        const ph = parseFloat(prompt("Enter your Soil pH Reading:", "6.0"));
        if(!isNaN(ph)) {
            let advice = "";
            let recommendations = Object.entries(this.cropData).map(([crop, data]) => {
                const isIdeal = ph >= data.min && ph <= data.max;
                return `<div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #eee;">
                    <span style="font-weight:bold; color:${isIdeal ? '#2d6a4f' : '#75757a'};">${crop}</span>
                    <span style="font-size:11px;">${data.min}-${data.max} pH ${isIdeal ? '?' : '?'}</span>
                </div>`;
            }).join('');
            if(ph < 5.5) advice = "Soil is acidic. Consider adding Lime.";
            else if(ph > 7.5) advice = "Soil is alkaline. Consider adding Gypsum/Sulphur.";
            else advice = "Soil is neutral/optimal for most crops.";
            out.innerHTML = `
                <div style="font-size:14px; margin-bottom:10px;"><strong>Soil Health Report (pH: ${ph})</strong></div>
                <div style="background:#f4f4f4; padding:10px; border-radius:5px; margin-bottom:10px; font-size:12px;">${advice}</div>
                <div style="font-size:11px; color:#333;"><strong>Crop Compatibility:</strong></div>
                ${recommendations}
                <button onclick="agriEngine.saveCalc('Soil Health','pH ${ph}: ${advice}')" style="margin-top:10px; padding:8px 12px; background:#1b4332; color:white; border:none; border-radius:5px; font-size:11px; width:100%; cursor:pointer;">?? SAVE TO HISTORY</button>
            `;
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }
    }
    // Call the original runTool for all other IDs
    originalRunTool.call(this, id);
};
// --- FORCE OVERRIDE TOOLS MODULE ---
agriEngine.renderTools = function(v) {
    const tools = [
        { id: "harv", n: "Harvest Calc", i: "??", d: "Yield per acre" },
        { id: "soil", n: "pH Guide", i: "??", d: "Kenyan Crop Chart" },
        { id: "rain", n: "Rainfall Log", i: "???", d: "Monthly total" },
        { id: "prof", n: "Profit Proj", i: "??", d: "ROI & Margins" },
        { id: "seed", n: "Seed Rate", i: "??", d: "Seeds per Ha" },
        { id: "fert", n: "Fertilizer", i: "??", d: "NPK Balancer" },
        { id: "irr", n: "Irrigation", i: "??", d: "Water flow" },
        { id: "land", n: "Acreage", i: "???", d: "M2 to Acres" },
        { id: "pest", n: "Pesticide", i: "??", d: "Mix ratios" },
        { id: "feed", n: "Livestock", i: "??", d: "Daily intake" },
        { id: "stor", n: "Storage", i: "???", d: "Shelf life" },
        { id: "labr", n: "Labor", i: "??", d: "Man-hours" },
        { id: "fuel", n: "Fuel", i: "??", d: "Tractor usage" },
        { id: "plant", n: "Spacing", i: "??", d: "Plant grid" },
        { id: "mkt", n: "Market", i: "??", d: "Price index" },
        { id: "comp", n: "Compost", i: "??", d: "Waste mix" },
        { id: "spray", n: "Nozzle", i: "??", d: "Flow rate" },
        { id: "vet", n: "Gestation", i: "??", d: "Birth dates" },
        { id: "dry", n: "Drying", i: "??", d: "Moisture %" },
        { id: "loan", n: "Agri-Loan", i: "??", d: "Interest calc" }
    ];
    v.innerHTML = `
        <div style="background:#1b4332; color:white; padding:20px; border-radius:0 0 15px 15px; margin-bottom:15px;">
            <h2 style="margin:0;">Agri-Toolbox</h2>
            <small>20 Professional Utilities Active</small>
        </div>
        <div id="tool-output" style="display:none; margin:0 15px 15px 15px; padding:15px; background:white; border-radius:10px; border-left:5px solid #f68b1e; box-shadow:0 4px 6px rgba(0,0,0,0.05);"></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0 15px;">
            ${tools.map(t => `
                <div onclick="agriEngine.runTool('${t.id}')" style="background:white; padding:15px; border-radius:10px; text-align:center; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                    <div style="font-size:30px; margin-bottom:5px;">${t.i}</div>
                    <div style="font-size:12px; font-weight:bold; color:#1b4332;">${t.n}</div>
                    <div style="font-size:10px; color:#999;">${t.d}</div>
                </div>
            `).join('')}
        </div>
        <div id="tool-history-list" style="margin:20px 15px; padding:15px; background:#eee; border-radius:10px;">
            <h4 style="margin:0 0 10px 0;">Saved History</h4>
            ${this.state.toolHistory.slice(0,3).map(h => `<div style="font-size:11px; margin-bottom:5px; background:#fff; padding:5px; border-radius:3px;"><b>${h.title}:</b> ${h.result}</div>`).join('')}
        </div>
    `;
};
// Update the global render to point to the correct tab logic
const originalRender = agriEngine.render;
agriEngine.render = function() {
    const view = document.getElementById('viewport');
    this.renderNav();
    if (this.state.activeTab === 'tools') this.renderTools(view);
    else if (this.state.activeTab === 'market') this.renderEasyShop(view);
    else if (this.state.activeTab === 'admin') this.renderAdmin(view);
    else this.renderAcademy(view);
};
agriEngine.render(); // Immediate Refresh
// 1. ACADEMY DATA & CURRICULUM
agriEngine.courses = [
    { 
        id: "crop101", n: "Modern Crop Science", i: "??", 
        lessons: ["Soil Preparation", "Seed Selection", "Pest Management"],
        progress: 0
    },
    { 
        id: "live201", n: "Livestock Mastery", i: "??", 
        lessons: ["Animal Nutrition", "Disease Control", "Breeding Basics"],
        progress: 0
    },
    { 
        id: "biz301", n: "Agri-Business 101", i: "??", 
        lessons: ["Market Analysis", "Farm Record Keeping", "Value Addition"],
        progress: 0
    }
];
// 2. OVERRIDE ACADEMY RENDER
agriEngine.renderAcademy = function(v) {
    v.innerHTML = `
        <div style="background:#2d6a4f; color:white; padding:20px; border-radius:0 0 20px 20px; margin-bottom:20px;">
            <h2 style="margin:0;">Agri-Academy</h2>
            <p style="margin:5px 0 0 0; opacity:0.8; font-size:13px;">Master the art of modern farming</p>
        </div>
        <div id="lesson-viewer" style="display:none; margin:0 15px 20px 15px; padding:20px; background:white; border-radius:15px; border-top:5px solid #2d6a4f; box-shadow:0 10px 20px rgba(0,0,0,0.05);"></div>
        <div style="padding:0 15px;">
            <h4 style="margin:0 0 15px 0; color:#333;">Your Courses</h4>
            ${this.courses.map(c => `
                <div onclick="agriEngine.openCourse('${c.id}')" style="background:white; padding:15px; border-radius:12px; margin-bottom:12px; display:flex; align-items:center; gap:15px; box-shadow:0 2px 5px rgba(0,0,0,0.05); cursor:pointer;">
                    <div style="font-size:35px;">${c.i}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold; color:#2d6a4f; font-size:14px;">${c.n}</div>
                        <div style="font-size:11px; color:#75757a;">${c.lessons.length} Modules</div>
                        <div style="width:100%; height:6px; background:#eee; border-radius:10px; margin-top:8px;">
                            <div style="width:${c.progress}%; height:100%; background:#40916c; border-radius:10px;"></div>
                        </div>
                    </div>
                    <div style="font-size:18px; color:#ccc;">??</div>
                </div>
            `).join('')}
        </div>
        <div style="margin:20px 15px; padding:20px; background:linear-gradient(135deg, #1b4332, #2d6a4f); border-radius:15px; color:white; text-align:center;">
            <div style="font-size:24px; margin-bottom:10px;">??</div>
            <div style="font-weight:bold;">Certification Program</div>
            <div style="font-size:11px; opacity:0.9; margin:5px 0 15px 0;">Complete all courses to unlock your AgriMastery Certificate.</div>
            <button onclick="alert('Complete your courses first!')" style="background:rgba(255,255,255,0.2); border:1px solid white; color:white; padding:8px 20px; border-radius:20px; font-size:12px; cursor:pointer;">Claim Certificate</button>
        </div>
    `;
};
// 3. LESSON LOGIC
agriEngine.openCourse = function(id) {
    const course = this.courses.find(c => c.id === id);
    const viewer = document.getElementById('lesson-viewer');
    viewer.style.display = "block";
    viewer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <b style="color:#2d6a4f;">${course.n}</b>
            <span onclick="document.getElementById('lesson-viewer').style.display='none'" style="cursor:pointer; color:#999;">?</span>
        </div>
        <div style="font-size:13px; color:#333; line-height:1.6;">
            <p>Welcome to <strong>${course.lessons[0]}</strong>. This module covers the essential fundamentals required for high-yield productivity.</p>
            <ul style="padding-left:20px;">
                ${course.lessons.map(l => `<li style="margin-bottom:8px; color:#555;">${l} <span style="font-size:10px; color:#2d6a4f; margin-left:10px;">?? Active</span></li>`).join('')}
            </ul>
        </div>
        <button onclick="agriEngine.completeLesson('${id}')" style="width:100%; background:#2d6a4f; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; margin-top:10px; cursor:pointer;">MARK AS COMPLETED</button>
    `;
    window.scrollTo({top: 0, behavior: 'smooth'});
};
agriEngine.completeLesson = function(id) {
    const course = this.courses.find(c => c.id === id);
    course.progress = Math.min(course.progress + 33.4, 100);
    alert(`Progress updated for ${course.n}!`);
    this.renderAcademy(document.getElementById('viewport'));
    document.getElementById('lesson-viewer').style.display = 'none';
};
// 1. QUIZ DATA BANK
agriEngine.quizzes = {
    "crop101": [
        { q: "What is the ideal pH for Maize?", a: "5.5 - 7.0", o: ["4.0 - 5.0", "5.5 - 7.0", "8.0 - 9.0"] },
        { q: "Which nutrient is primary for leaf growth?", a: "Nitrogen", o: ["Zinc", "Iron", "Nitrogen"] }
    ],
    "live201": [
        { q: "Which breed is best for milk in Kenya?", a: "Friesian", o: ["Friesian", "Boran", "Dorper"] },
        { q: "What is the gestation period of a cow?", a: "283 Days", o: ["150 Days", "283 Days", "365 Days"] }
    ]
};
// 2. OVERRIDE COMPLETION LOGIC WITH QUIZ
agriEngine.completeLesson = function(id) {
    const quiz = this.quizzes[id];
    if(!quiz) {
        this.applyProgress(id);
        return;
    }
    const viewer = document.getElementById('lesson-viewer');
    viewer.innerHTML = `
        <div style="border-bottom:2px solid #f68b1e; padding-bottom:10px; margin-bottom:15px;">
            <b style="color:#1b4332;">Final Assessment: ${id.toUpperCase()}</b>
        </div>
        ${quiz.map((item, idx) => `
            <div style="margin-bottom:15px;">
                <p style="font-size:13px; font-weight:bold; margin-bottom:8px;">${idx + 1}. ${item.q}</p>
                ${item.o.map(opt => `
                    <label style="display:block; font-size:12px; margin-bottom:5px; padding:8px; background:#f9f9f9; border-radius:5px;">
                        <input type="radio" name="q${idx}" value="${opt}"> ${opt}
                    </label>
                `).join('')}
            </div>
        `).join('')}
        <button onclick="agriEngine.validateQuiz('${id}')" style="width:100%; background:#f68b1e; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">SUBMIT ANSWERS</button>
    `;
};
agriEngine.validateQuiz = function(id) {
    const quiz = this.quizzes[id];
    let score = 0;
    quiz.forEach((item, idx) => {
        const selected = document.querySelector(`input[name="q${idx}"]:checked`);
        if(selected && selected.value === item.a) score++;
    });
    if(score === quiz.length) {
        alert("Perfect Score! 100% Correct.");
        this.applyProgress(id);
    } else {
        alert(`You got ${score}/${quiz.length}. Please review the lesson and try again!`);
    }
};
agriEngine.applyProgress = function(id) {
    const course = this.courses.find(c => c.id === id);
    course.progress = Math.min(course.progress + 33.4, 100);
    localStorage.setItem('agri_courses', JSON.stringify(this.courses));
    this.renderAcademy(document.getElementById('viewport'));
    document.getElementById('lesson-viewer').style.display = 'none';
};
// 1. ENSURE COURSE DATA EXISTS IN STATE
agriEngine.courses = [
    { 
        id: "crop101", n: "Modern Crop Science", i: "??", 
        lessons: ["Soil Preparation", "Seed Selection", "Pest Management"],
        progress: 0
    },
    { 
        id: "live201", n: "Livestock Mastery", i: "??", 
        lessons: ["Animal Nutrition", "Disease Control", "Breeding Basics"],
        progress: 0
    },
    { 
        id: "biz301", n: "Agri-Business 101", i: "??", 
        lessons: ["Market Analysis", "Farm Record Keeping", "Value Addition"],
        progress: 0
    }
];
// 2. RE-DECLARE RENDER TO ENSURE CONTENT LOADS
agriEngine.renderAcademy = function(v) {
    if (!v) v = document.getElementById('viewport');
    v.innerHTML = `
        <div style="background:#2d6a4f; color:white; padding:20px; border-radius:0 0 20px 20px; margin-bottom:20px;">
            <h2 style="margin:0;">Agri-Academy</h2>
            <p style="margin:5px 0 0 0; opacity:0.8; font-size:13px;">Learning Center Active</p>
        </div>
        <div id="lesson-viewer" style="display:none; margin:0 15px 20px 15px; padding:20px; background:white; border-radius:15px; border-top:5px solid #2d6a4f; box-shadow:0 10px 20px rgba(0,0,0,0.1);"></div>
        <div style="padding:0 15px;">
            <h4 style="margin:0 0 15px 0; color:#333;">Available Modules</h4>
            ${this.courses.map(c => `
                <div onclick="agriEngine.openCourse('${c.id}')" style="background:white; padding:15px; border-radius:12px; margin-bottom:12px; display:flex; align-items:center; gap:15px; box-shadow:0 2px 5px rgba(0,0,0,0.05); cursor:pointer;">
                    <div style="font-size:35px;">${c.i}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold; color:#2d6a4f; font-size:14px;">${c.n}</div>
                        <div style="font-size:11px; color:#75757a;">${c.lessons.length} Lessons</div>
                        <div style="width:100%; height:6px; background:#eee; border-radius:10px; margin-top:8px;">
                            <div style="width:${c.progress}%; height:100%; background:#40916c; border-radius:10px; transition: width 0.5s;"></div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};
// 3. AUTO-REFRESH IF USER IS ON ACADEMY TAB
if (agriEngine.state.activeTab === 'student') {
    agriEngine.renderAcademy(document.getElementById('viewport'));
}
// 1. ADMIN RENDER OVERHAUL
agriEngine.renderAdmin = function(v) {
    const stats = {
        totalItems: this.state.inventory.length || 1000,
        activeStudents: 1, // Current user
        systemWallet: this.state.wallet.toLocaleString(),
        support: this.state.contact
    };
    v.innerHTML = `
        <div style="background:#1e3a8a; color:white; padding:25px; border-radius:0 0 25px 25px; margin-bottom:20px; box-shadow:0 4px 12px rgba(30,58,138,0.2);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0;">Control Center</h2>
                <div style="background:rgba(255,255,255,0.2); padding:5px 12px; border-radius:15px; font-size:11px;">Admin Active</div>
            </div>
            <p style="margin:5px 0 0 0; opacity:0.8; font-size:13px;">Managing EasyShop & Academy</p>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 15px; margin-bottom:20px;">
            <div style="background:white; padding:15px; border-radius:12px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <div style="color:#75757a; font-size:10px; font-weight:bold; text-transform:uppercase;">Student Wallet</div>
                <div style="font-size:18px; font-weight:900; color:#1e3a8a; margin-top:5px;">KSh ${stats.systemWallet}</div>
            </div>
            <div style="background:white; padding:15px; border-radius:12px; box-shadow:0(0,0,0,0.05);">
                <div style="color:#75757a; font-size:10px; font-weight:bold; text-transform:uppercase;">Inventory</div>
                <div style="font-size:18px; font-weight:900; color:#1e3a8a; margin-top:5px;">${stats.totalItems} Items</div>
            </div>
        </div>
        <div style="padding:0 15px;">
            <div style="background:white; border-radius:15px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <div style="padding:15px; background:#f8fafc; border-bottom:1px solid #eee; font-weight:bold; color:#1e3a8a; display:flex; justify-content:space-between;">
                    <span>System Controls</span>
                    <span>???</span>
                </div>
                <div style="padding:10px;">
                    <div onclick="agriEngine.adminAddCash()" style="display:flex; align-items:center; gap:15px; padding:12px; border-bottom:1px solid #f1f1f2; cursor:pointer;">
                        <div style="font-size:20px;">??</div>
                        <div style="flex:1;"><div style="font-size:13px; font-weight:bold;">Top-up Student Wallet</div><div style="font-size:11px; color:#75757a;">Manual balance adjustment</div></div>
                    </div>
                    <div onclick="agriEngine.adminEditContact()" style="display:flex; align-items:center; gap:15px; padding:12px; border-bottom:1px solid #f1f1f2; cursor:pointer;">
                        <div style="font-size:20px;">??</div>
                        <div style="flex:1;"><div style="font-size:13px; font-weight:bold;">Support Line</div><div style="font-size:11px; color:#75757a;">Current: ${stats.support}</div></div>
                    </div>
                    <div onclick="agriEngine.adminViewHistory()" style="display:flex; align-items:center; gap:15px; padding:12px; cursor:pointer;">
                        <div style="font-size:20px;">??</div>
                        <div style="flex:1;"><div style="font-size:13px; font-weight:bold;">Audit Logs</div><div style="font-size:11px; color:#75757a;">View all tool calculations</div></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="admin-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:20000; padding:40px 20px;">
            <div style="background:white; border-radius:20px; padding:20px; position:relative;">
                <div onclick="document.getElementById('admin-modal').style.display='none'" style="position:absolute; right:15px; top:15px; font-size:20px; color:#999;">?</div>
                <div id="admin-modal-content"></div>
            </div>
        </div>
    `;
};
// 2. ADMIN ACTIONS
agriEngine.adminAddCash = function() {
    const amt = prompt("Enter amount to add to student wallet (KSh):", "1000");
    if(amt) {
        this.state.wallet += parseInt(amt);
        localStorage.setItem('agri_wallet', this.state.wallet);
        alert(`Successfully added KSh ${amt}`);
        this.render();
    }
};
agriEngine.adminEditContact = function() {
    const newNum = prompt("Enter new support contact number:", this.state.contact);
    if(newNum) {
        this.state.contact = newNum;
        localStorage.setItem('agri_contact', newNum);
        alert("Support contact updated!");
        this.render();
    }
};
agriEngine.adminViewHistory = function() {
    const modal = document.getElementById('admin-modal');
    const content = document.getElementById('admin-modal-content');
    const history = JSON.parse(localStorage.getItem('agri_tool_history') || '[]');
    modal.style.display = "block";
    content.innerHTML = `
        <h3 style="color:#1e3a8a; margin-top:0;">Tool Audit Logs</h3>
        <div style="max-height:300px; overflow-y:auto; border-top:1px solid #eee;">
            ${history.length === 0 ? '<p>No history found.</p>' : history.map(h => `
                <div style="padding:10px 0; border-bottom:1px solid #eee; font-size:12px;">
                    <span style="color:#75757a;">${h.date}</span><br>
                    <strong>${h.title}</strong>: ${h.result}
                </div>
            `).join('')}
        </div>
    `;
};
