// 1. DATA LOCK SYSTEM (LocalStorage)
const savedData = JSON.parse(localStorage.getItem('agriMasteryData')) || {};
agriEngine.state = {
    activeTab: 'academy',
    wallet: savedData.wallet || 15000,
    isLoggedIn: false,
    selectedCourse: null,
    registeredUnits: savedData.registeredUnits || [],
    inClassroom: false,
    currentUnit: null,
    classPage: 1,
    inventory: []
};
// Function to save data every time something changes
agriEngine.save = function() {
    const toSave = {
        wallet: this.state.wallet,
        registeredUnits: this.state.registeredUnits
    };
    localStorage.setItem('agriMasteryData', JSON.stringify(toSave));
};
// 2. RESTORE MARKET (110 Items)
for(let i=1; i<=110; i++) {
    agriEngine.state.inventory.push({
        id: i, n: "Agri-Master Pro SKU-" + i, p: 1250 + (i * 25), op: 2800,
        i: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300"
    });
}
// 3. QUIZ DATABASE
const unitQuizzes = {
    'Crop Economics': { q: "To increase profit, should you sell when supply is High or Low?", a: "Low", reward: 2000 },
    'pH Optimization': { q: "Which material is used to raise the pH of acidic soil?", a: "Lime", reward: 2500 }
};
// 4. CLASSROOM & QUIZ RENDERER
agriEngine.renderAcademy = (v) => {
    if (!agriEngine.state.isLoggedIn) {
        v.innerHTML = `<div style="padding:40px 20px; text-align:center; background:#f8fafc; min-height:100vh;">
            <div style="background:white; padding:30px; border-radius:25px; box-shadow:0 15px 35px rgba(0,0,0,0.1);">
                <img src="https://cdn-icons-png.flaticon.com/128/3443/3443421.png" style="width:80px; margin-bottom:15px;">
                <h2 style="color:#065f46; margin:0;">Student Portal</h2>
                <p style="color:#64748b; font-size:12px; margin-bottom:20px;">Welcome back, Omondi Robin</p>
                <input type="password" id="p" placeholder="PIN" style="width:80px; padding:15px; border:2px solid #ddd; border-radius:10px; text-align:center; font-size:20px;">
                <button onclick="if(document.getElementById('p').value==='1234'){agriEngine.state.isLoggedIn=true; agriEngine.render();}" style="width:100%; background:#065f46; color:white; border:none; padding:18px; border-radius:12px; font-weight:bold; margin-top:20px;">SIGN IN</button>
            </div>
        </div>`;
        return;
    }
    if (agriEngine.state.inClassroom) {
        const quiz = unitQuizzes[agriEngine.state.currentUnit];
        v.innerHTML = `<div style="padding:20px; background:white; min-height:100vh;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <button onclick="agriEngine.state.inClassroom=false; agriEngine.render();" style="background:#eee; border:none; padding:8px 15px; border-radius:5px;">Exit</button>
                <span style="font-weight:bold; color:#065f46;">Unit: ${agriEngine.state.currentUnit}</span>
            </div>
            <div style="background:#fff7ed; padding:25px; border-radius:20px; border:2px dashed #f68b1e; text-align:center;">
                <h3 style="color:#f68b1e; margin-top:0;">Final Unit Quiz</h3>
                <p style="font-size:16px;">${quiz.q}</p>
                <input type="text" id="ans" placeholder="Your Answer" style="width:100%; padding:15px; border:1px solid #ddd; border-radius:10px; margin-bottom:15px; text-align:center;">
                <button onclick="if(document.getElementById('ans').value.toLowerCase()==='${quiz.a.toLowerCase()}'){agriEngine.state.wallet+=${quiz.reward}; agriEngine.save(); alert('Correct! KSh ${quiz.reward} added to wallet.'); agriEngine.state.inClassroom=false; agriEngine.render();}else{alert('Try again!')}" 
                    style="width:100%; background:#f68b1e; color:white; border:none; padding:15px; border-radius:10px; font-weight:bold;">SUBMIT FOR REWARD</button>
            </div>
        </div>`;
        return;
    }
    v.innerHTML = `<div style="padding:20px; background:#f1f5f9; min-height:100vh;">
        <div style="background:white; padding:15px; border-radius:15px; display:flex; align-items:center; margin-bottom:20px;">
            <img src="https://cdn-icons-png.flaticon.com/128/201/201614.png" style="width:50px;">
            <div style="margin-left:15px;"><h4 style="margin:0;">OMONDI ROBIN</h4><p style="margin:0; font-size:11px; color:green;">Wallet: KSh ${agriEngine.state.wallet.toLocaleString()}</p></div>
        </div>
        <h3>My Courses</h3>
        ${agriEngine.state.registeredUnits.map(unit => `<div style="background:white; padding:20px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border-left:5px solid #065f46;">
            <span>${unit}</span><button onclick="agriEngine.state.currentUnit='${unit}'; agriEngine.state.inClassroom=true; agriEngine.render();" style="background:#065f46; color:white; border:none; padding:8px 15px; border-radius:5px;">TAKE QUIZ</button>
        </div>`).join('')}
        <button onclick="if(!agriEngine.state.registeredUnits.includes('Crop Economics')){agriEngine.state.registeredUnits.push('Crop Economics'); agriEngine.save(); agriEngine.render();}" style="width:100%; padding:15px; background:white; border:1px solid #065f46; border-radius:10px; color:#065f46; font-weight:bold;">+ Enroll: Crop Economics</button>
    </div>`;
};
// 5. MASTER SYNC
agriEngine.render = function() {
    const v = document.getElementById('viewport');
    const n = document.getElementById('bottom-nav');
    if(this.state.activeTab === 'admin') {
        v.innerHTML = `<div style="padding:20px;"><h2>ADMIN</h2><p>Wallet: KSh ${this.state.wallet.toLocaleString()}</p><button onclick="agriEngine.state.wallet+=5000; agriEngine.save(); agriEngine.render();" style="padding:15px; width:100%; background:green; color:white; border-radius:10px;">GIFT 5K</button></div>`;
    } 
    else if(this.state.activeTab === 'academy') this.renderAcademy(v);
    else if(this.state.activeTab === 'tools') {
        v.innerHTML = `<div style="padding:20px;"><h3>20 TOOLS ACTIVE</h3></div>`;
    }
    else {
        v.innerHTML = `<div style="background:#f68b1e; padding:15px; color:white; font-weight:bold;">?? MARKET | Wallet: KSh ${this.state.wallet.toLocaleString()}</div><div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">${this.state.inventory.slice(0,6).map(i=>`<div style="background:white; padding:10px; border-radius:5px;"><div style="font-size:11px;">${i.n}</div><div style="font-weight:bold; color:#f68b1e;">KSh ${i.p}</div></div>`).join('')}</div>`;
    }
    const tabs = [{id:'admin', l:'ADMIN'}, {id:'academy', l:'ACADEMY'}, {id:'tools', l:'TOOLS'}, {id:'market', l:'MARKET'}];
    n.innerHTML = tabs.map(t => `<div onclick="agriEngine.state.activeTab='${t.id}'; agriEngine.render();" style="flex:1; text-align:center; padding:25px 0; color:${this.state.activeTab===t.id?'#f68b1e':'#94a3af'}; font-weight:bold; font-size:11px;">${t.l}</div>`).join('');
};
agriEngine.render();
