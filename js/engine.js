// 1. PERSISTENT DATA CORE
agriEngine.state = agriEngine.state || {
    activeTab: 'market',
    wallet: 15000,
    isLoggedIn: false,
    selectedCourse: null,
    registeredUnits: [],
    userName: "OMONDI ROBIN",
    inventory: []
};
// 2. DATA SAFETY: Re-populate Market only if empty
if(agriEngine.state.inventory.length === 0) {
    for(let i=1; i<=110; i++) {
        agriEngine.state.inventory.push({
            id: i, n: "Agri-Pro Product SKU-" + i, p: 1250 + (i * 25), op: 2800 + (i*10),
            i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
        });
    }
}
// 3. COURSE DATABASE
const courseCatalog = [
    { id: '1', title: 'Modern Agribusiness', units: ['Crop Economics', 'Export Logistics', 'Risk Management'] },
    { id: '2', title: 'Sustainable Soil Science', units: ['pH Optimization', 'Organic Matter', 'Irrigation Tech'] },
    { id: '3', title: 'Livestock & Dairy Tech', units: ['Animal Nutrition', 'Vaccination', 'Zero Grazing'] }
];
// 4. THE MASTER RENDERER (Switching between 4 Dashboards)
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    // --- DASHBOARD 1: ADMIN ---
    if(this.state.activeTab === 'admin') {
        v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;">
            <h2 style="color:#38bdf8; margin-bottom:20px;">SYSTEM ADMIN</h2>
            <div style="background:#1e293b; padding:20px; border-radius:15px; border:1px solid #334155;">
                <p style="font-size:12px; color:#94a3b8;">STUDENT NAME</p>
                <h3 style="margin:0;">${this.state.userName}</h3>
                <hr style="border:0; border-top:1px solid #334155; margin:15px 0;">
                <p style="font-size:12px; color:#94a3b8;">WALLET BALANCE</p>
                <h2 style="margin:0; color:#4ade80;">KSh ${this.state.wallet.toLocaleString()}</h2>
                <button onclick="agriEngine.state.wallet += 10000; agriEngine.render();" style="width:100%; background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:10px; font-weight:bold; margin-top:20px; cursor:pointer;">GIFT KSH 10,000</button>
            </div>
            <button onclick="location.reload();" style="width:100%; margin-top:10px; background:none; border:1px solid #ef4444; color:#ef4444; padding:12px; border-radius:10px;">RESTART ENGINE</button>
        </div>`;
    } 
    // --- DASHBOARD 2: ACADEMY (Professional Portal) ---
    else if(this.state.activeTab === 'academy') {
        if(!this.state.isLoggedIn) {
            v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#f8fafc; min-height:100vh;">
                <div style="background:white; padding:30px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                    <div style="font-size:40px;">??</div>
                    <h2 style="color:#065f46;">Student Portal</h2>
                    <input type="password" id="p" placeholder="Enter Portal PIN" style="width:100%; padding:15px; border-radius:10px; border:1px solid #ddd; margin-bottom:15px; text-align:center;">
                    <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.state.isLoggedIn=true; agriEngine.render();}else{alert('Wrong PIN')}" style="width:100%; background:#065f46; color:white; border:none; padding:15px; border-radius:10px; font-weight:bold;">ACCESS DASHBOARD</button>
                </div>
            </div>`;
        } else if(!this.state.selectedCourse) {
            v.innerHTML = `<div style="padding:20px; background:#f1f5f9; min-height:100vh;">
                <h3 style="color:#065f46;">Welcome, Omondi Robin</h3>
                <p style="color:#64748b; font-size:14px;">Select a course to begin your units:</p>
                ${courseCatalog.map(c => `<div onclick="agriEngine.state.selectedCourse='${c.id}'; agriEngine.render();" style="background:white; padding:20px; border-radius:15px; margin-bottom:12px; border-left:6px solid #065f46; box-shadow:0 4px 6px rgba(0,0,0,0.05); cursor:pointer;">
                    <h4 style="margin:0;">${c.title}</h4>
                    <span style="font-size:11px; color:#065f46; font-weight:bold;">ENROLL NOW</span>
                </div>`).join('')}
            </div>`;
        } else {
            const course = courseCatalog.find(c => c.id === this.state.selectedCourse);
            v.innerHTML = `<div style="padding:20px; background:#f8fafc; min-height:100vh;">
                <span onclick="agriEngine.state.selectedCourse=null; agriEngine.render();" style="color:#065f46; font-weight:bold; cursor:pointer;"><- Back</span>
                <h2 style="margin:10px 0;">${course.title}</h2>
                <div style="background:white; padding:20px; border-radius:15px;">
                    <p style="font-weight:bold; margin-top:0;">Available Units:</p>
                    ${course.units.map(u => {
                        const reg = this.state.registeredUnits.includes(u);
                        return `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                            <span style="font-size:14px;">${u}</span>
                            <button onclick="if(!agriEngine.state.registeredUnits.includes('${u}')){agriEngine.state.registeredUnits.push('${u}'); agriEngine.render();}" style="background:${reg?'#cbd5e1':'#065f46'}; color:white; border:none; padding:5px 10px; border-radius:5px; font-size:11px;">${reg?'REGISTERED':'REGISTER'}</button>
                        </div>`;
                    }).join('')}
                </div>
                ${this.state.registeredUnits.length > 0 ? `<button onclick="alert('Entering Classroom...')" style="width:100%; background:#f68b1e; color:white; border:none; padding:18px; border-radius:12px; font-weight:bold; margin-top:20px;">ENTER CLASSROOM</button>` : ''}
            </div>`;
        }
    }
    // --- DASHBOARD 3: TOOLS ---
    else if(this.state.activeTab === 'tools') {
        const t_list = ["Soil pH", "Rainfall", "Profit", "Harvest", "Seed Gap", "Pest Alert", "Weather", "NPK Calc", "Livestock", "Irrigation", "Market Price", "Storage", "Tractor", "Labor", "Insurance", "Compost", "Vet Check", "Solar", "Transport", "Loans"];
        v.innerHTML = `<div style="padding:20px; background:#f8fafc; min-height:100vh;">
            <h3 style="margin-top:0;">AGRICULTURE TOOLS</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-bottom:100px;">
                ${t_list.map(t => `<div onclick="alert('${t} Tool Activated')" style="background:white; padding:20px; border-radius:12px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.05); border-bottom:3px solid #065f46; cursor:pointer;">
                    <div style="font-weight:bold; font-size:12px; color:#334155;">${t.toUpperCase()}</div>
                </div>`).join('')}
            </div>
        </div>`;
    }
    // --- DASHBOARD 4: MARKET (Jumia Style) ---
    else {
        v.innerHTML = `<div style="background:#f1f1f2; min-height:100vh;">
            <div style="background:#f68b1e; padding:15px; color:white; position:sticky; top:0; z-index:1000; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold;">?? AGRI-MARKET</span>
                <span style="font-size:12px;">KSh ${this.state.wallet.toLocaleString()}</span>
            </div>
            <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-bottom:100px;">
                ${this.state.inventory.map(i => `<div style="background:white; border-radius:5px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <img src="${i.i}" style="width:100%; height:120px; object-fit:cover;">
                    <div style="padding:10px;">
                        <div style="font-size:12px; color:#333; height:32px; overflow:hidden;">${i.n}</div>
                        <div style="color:#f68b1e; font-weight:bold; font-size:16px;">KSh ${i.p.toLocaleString()}</div>
                        <div style="color:#999; font-size:11px; text-decoration:line-through;">KSh ${i.op.toLocaleString()}</div>
                    </div>
                    <button onclick="alert('Added to cart!');" style="width:100%; background:#f68b1e; color:white; border:none; padding:12px; font-weight:bold; font-size:12px; cursor:pointer;">ADD TO CART</button>
                </div>`).join('')}
            </div>
        </div>`;
    }
    // --- NAVIGATION BAR ---
    n.innerHTML = [
        {id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}
    ].map(t => `
        <div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render(); window.scrollTo(0,0);" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px; cursor:pointer;">
            ${t.l}
        </div>
    `).join('');
};
agriEngine.render();
