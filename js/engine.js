// 1. DATA CORE (Maintained)
agriEngine.state = agriEngine.state || {
    activeTab: 'academy',
    wallet: 15000,
    isLoggedIn: false,
    selectedCourse: null,
    registeredUnits: [],
    page: 1,
    inventory: []
};
// 2. JUMIA-STYLE DATA PRESERVATION
if(agriEngine.state.inventory.length === 0) {
    for(let i=1; i<=110; i++) {
        agriEngine.state.inventory.push({
            id: i, n: "Agri-Product SKU-" + i, p: 1250 + (i * 25),
            i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
        });
    }
}
// 3. E-LEARNING LOGIC
const courses = [
    { id: 'agri_1', name: 'Diploma in Modern Agribusiness', units: ['Market Analysis', 'Value Chain', 'Agri-Finance'] },
    { id: 'soil_2', name: 'Certificate in Soil Science', units: ['pH Testing', 'Fertilizer Mix', 'Microbiology'] },
    { id: 'live_3', name: 'Livestock Management Tech', units: ['Vet Care', 'Feed Optimization', 'Breeding'] }
];
// 4. THE PROFESSIONAL ACADEMY RENDERER
agriEngine.renderAcademy = (v) => {
    // LOGIN SCREEN
    if (!agriEngine.state.isLoggedIn) {
        v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#f8fafc; min-height:100vh;">
            <div style="background:white; padding:30px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
                <div style="font-size:50px; margin-bottom:10px;">??</div>
                <h2 style="color:#065f46; margin-bottom:5px;">Student Portal</h2>
                <p style="color:#64748b; font-size:14px; margin-bottom:25px;">Welcome back, OMONDI ROBIN</p>
                <input type="password" id="studPin" placeholder="Enter Student PIN" style="width:100%; padding:15px; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:15px; text-align:center;">
                <button onclick="if(document.getElementById('studPin').value==='1234'){agriEngine.state.isLoggedIn=true; agriEngine.render();}else{alert('Invalid PIN')}" 
                    style="width:100%; background:#065f46; color:white; border:none; padding:15px; border-radius:10px; font-weight:bold;">LOGIN TO PORTAL</button>
            </div>
        </div>`;
        return;
    }
    // COURSE SELECTION
    if (!agriEngine.state.selectedCourse) {
        v.innerHTML = `<div style="padding:20px; background:#f8fafc; min-height:100vh;">
            <h2 style="color:#065f46;">Select Your Course</h2>
            ${courses.map(c => `
                <div onclick="agriEngine.state.selectedCourse='${c.id}'; agriEngine.render();" 
                    style="background:white; padding:20px; border-radius:15px; margin-bottom:15px; border-left:6px solid #065f46; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="margin:0; color:#1e293b;">${c.name}</h3>
                    <p style="margin:5px 0 0; font-size:12px; color:#64748b;">3 Core Units Available</p>
                </div>
            `).join('')}
        </div>`;
        return;
    }
    // UNIT REGISTRATION
    const activeCourse = courses.find(c => c.id === agriEngine.state.selectedCourse);
    v.innerHTML = `<div style="padding:20px; background:#f8fafc; min-height:100vh;">
        <button onclick="agriEngine.state.selectedCourse=null; agriEngine.render();" style="border:none; background:none; color:#065f46; font-weight:bold; margin-bottom:15px;"><- Back to Courses</button>
        <h2 style="margin-top:0;">${activeCourse.name}</h2>
        <p style="color:#64748b;">Register for your units:</p>
        ${activeCourse.units.map(u => {
            const isReg = agriEngine.state.registeredUnits.includes(u);
            return `
                <div style="background:white; padding:20px; border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; color:#334155;">${u}</span>
                    <button onclick="if(!agriEngine.state.registeredUnits.includes('${u}')){agriEngine.state.registeredUnits.push('${u}'); agriEngine.render();}" 
                        style="background:${isReg ? '#cbd5e1' : '#065f46'}; color:white; border:none; padding:8px 15px; border-radius:8px; font-size:12px;">
                        ${isReg ? 'REGISTERED' : 'REGISTER'}
                    </button>
                </div>`;
        }).join('')}
        ${agriEngine.state.registeredUnits.length > 0 ? `<button onclick="alert('Accessing Learning Material...');" style="width:100%; margin-top:20px; background:#f68b1e; color:white; border:none; padding:18px; border-radius:12px; font-weight:bold;">ENTER CLASSROOM</button>` : ''}
    </div>`;
};
// 5. GLOBAL RENDER (Fixed Nav Labels)
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') {
        v.innerHTML = `<div style="padding:20px; background:#0f172a; min-height:100vh; color:white;"><h2>ADMIN PANEL</h2><button onclick="agriEngine.state.wallet+=5000; agriEngine.render();" style="padding:15px; background:#38bdf8; border:none; border-radius:8px; width:100%;">GIFT KSh 5,000</button><p style="margin-top:20px;">Wallet: KSh ${this.state.wallet.toLocaleString()}</p></div>`;
    } 
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h2>TOOLS</h2><p>20 Advanced Calculators Active</p></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; color:white; padding:15px;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div><div style="padding:10px;">${this.state.inventory.slice(0,10).map(i => `<div style="background:white; margin-bottom:5px; padding:10px;">${i.n} - KSh ${i.p}</div>`).join('')}</div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render(); window.scrollTo(0,0);" style="flex:1; text-align:center; padding:20px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:10px;">${t.l}</div>`).join('');
};
agriEngine.render();
