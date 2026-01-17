// 1. DATA CORE (Maintains Wallet & Inventory)
agriEngine.state = agriEngine.state || {
    activeTab: 'academy',
    wallet: 15000,
    isLoggedIn: false,
    selectedCourse: null,
    registeredUnits: [],
    inClassroom: false,
    currentUnit: null,
    classPage: 1,
    inventory: []
};
// 2. COURSE CONTENT DATABASE
const courseData = {
    'Crop Economics': [
        "Welcome to Crop Economics. Page 1: Understanding Supply and Demand in Local Markets.",
        "Page 2: How to calculate your Cost of Production per Acre.",
        "Page 3: Strategic Pricing: When to sell your harvest for maximum profit."
    ],
    'Export Logistics': [
        "Page 1: International Quality Standards (GlobalGAP) requirements.",
        "Page 2: Cold chain management for perishable produce.",
        "Page 3: Documentation for exporting from East Africa."
    ],
    'pH Optimization': [
        "Page 1: Why Soil pH is the foundation of nutrient uptake.",
        "Page 2: Using Lime to raise pH in acidic tropical soils.",
        "Page 3: Measuring pH using digital sensors vs. manual kits."
    ]
};
// 3. ACADEMY & CLASSROOM RENDERER
agriEngine.renderAcademy = (v) => {
    // A. LOGIN SCREEN
    if (!agriEngine.state.isLoggedIn) {
        v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#f8fafc; min-height:100vh;">
            <div style="background:white; padding:30px; border-radius:25px; box-shadow:0 15px 35px rgba(0,0,0,0.1);">
                <img src="https://cdn-icons-png.flaticon.com/128/3443/3443421.png" style="width:80px;">
                <h2 style="color:#065f46;">Student Portal</h2>
                <input type="password" id="p" placeholder="PIN" style="width:80px; padding:15px; border:2px solid #ddd; border-radius:10px; text-align:center; font-size:20px;">
                <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.state.isLoggedIn=true; agriEngine.render();}" style="width:100%; background:#065f46; color:white; border:none; padding:18px; border-radius:12px; font-weight:bold; margin-top:20px;">SIGN IN</button>
            </div>
        </div>`;
        return;
    }
    // B. CLASSROOM VIEW (Inside the lessons)
    if (agriEngine.state.inClassroom) {
        const content = courseData[agriEngine.state.currentUnit] || ["Content coming soon..."];
        const text = content[agriEngine.state.classPage - 1] || "End of Unit.";
        v.innerHTML = `<div style="padding:20px; background:white; min-height:100vh;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <button onclick="agriEngine.state.inClassroom=false; agriEngine.render();" style="background:#eee; border:none; padding:8px 15px; border-radius:5px;">Exit Class</button>
                <span style="font-weight:bold; color:#065f46;">${agriEngine.state.currentUnit}</span>
            </div>
            <div style="background:#f8fafc; padding:30px; border-radius:20px; min-height:300px; border:1px solid #e2e8f0; line-height:1.8;">
                <p style="font-size:18px; color:#1e293b;">${text}</p>
            </div>
            <div style="margin-top:20px; display:flex; gap:10px;">
                <button onclick="if(agriEngine.state.classPage>1){agriEngine.state.classPage--; agriEngine.render();}" style="flex:1; padding:15px; background:#64748b; color:white; border:none; border-radius:10px;">PREVIOUS</button>
                <button onclick="if(agriEngine.state.classPage<${content.length}){agriEngine.state.classPage++; agriEngine.render();}else{alert('Unit Complete!')}" style="flex:1; padding:15px; background:#065f46; color:white; border:none; border-radius:10px;">NEXT PAGE</button>
            </div>
        </div>`;
        return;
    }
    // C. COURSE & UNIT SELECTION
    v.innerHTML = `<div style="padding:20px; background:#f1f5f9; min-height:100vh;">
        <div style="background:white; padding:15px; border-radius:15px; display:flex; align-items:center; margin-bottom:20px;">
            <img src="https://cdn-icons-png.flaticon.com/128/201/201614.png" style="width:50px; border-radius:50%;">
            <div style="margin-left:15px;"><h4 style="margin:0;">OMONDI ROBIN</h4><p style="margin:0; font-size:11px; color:green;">Active Student</p></div>
        </div>
        <h3>My Registered Units</h3>
        ${agriEngine.state.registeredUnits.length === 0 ? '<p>No units registered yet. Go to courses to enroll.</p>' : 
            agriEngine.state.registeredUnits.map(unit => `
                <div style="background:white; padding:20px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border-left:5px solid #f68b1e;">
                    <span style="font-weight:bold;">${unit}</span>
                    <button onclick="agriEngine.state.currentUnit='${unit}'; agriEngine.state.inClassroom=true; agriEngine.state.classPage=1; agriEngine.render();" style="background:#065f46; color:white; border:none; padding:8px 15px; border-radius:5px;">STUDY</button>
                </div>
            `).join('')
        }
        <hr style="margin:20px 0; border:0; border-top:1px solid #ddd;">
        <h4>Enroll in New Units</h4>
        <div onclick="if(!agriEngine.state.registeredUnits.includes('Crop Economics')){agriEngine.state.registeredUnits.push('Crop Economics'); agriEngine.render();}" style="background:#fff; padding:15px; border-radius:10px; margin-bottom:10px; cursor:pointer;">+ Crop Economics</div>
        <div onclick="if(!agriEngine.state.registeredUnits.includes('pH Optimization')){agriEngine.state.registeredUnits.push('pH Optimization'); agriEngine.render();}" style="background:#fff; padding:15px; border-radius:10px; cursor:pointer;">+ pH Optimization</div>
    </div>`;
};
// 4. MAIN CONTROLLER (Preserves Market & Tools)
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') {
        v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;"><h2>ADMIN</h2><p>Wallet: KSh ${this.state.wallet.toLocaleString()}</p><button onclick="agriEngine.state.wallet+=10000; agriEngine.render();" style="padding:15px; background:#38bdf8; width:100%; border:none; border-radius:10px; font-weight:bold;">GIFT 10K</button></div>`;
    } 
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h3>20 TOOLS ACTIVE</h3><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">${['Soil','Irrigation','Rain','Pests'].map(t=>`<div style="background:white; padding:20px; border-radius:10px; text-align:center; border-bottom:3px solid #065f46;">${t}</div>`).join('')}</div></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; padding:15px; color:white; font-weight:bold;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div><div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">${this.state.inventory.slice(0,10).map(i=>`<div style="background:white; padding:10px; border-radius:5px;"><div style="font-size:11px;">${i.n}</div><div style="font-weight:bold; color:#f68b1e;">KSh ${i.p}</div></div>`).join('')}</div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">${t.l}</div>`).join('');
};
agriEngine.render();
