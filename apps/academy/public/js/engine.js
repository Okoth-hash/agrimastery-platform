// 1. DATA SHIELD & AUTO-SYNC
(function() {
    const savedWallet = localStorage.getItem('agri_wallet');
    const savedCart = localStorage.getItem('agri_cart');
    const updateID = Date.now().toString();
    if (localStorage.getItem('agri_last_sync') !== updateID) {
        console.log("? Live Sync V12: Updating with Zero Data Loss...");
        if(savedWallet) agriEngine.state.wallet = parseFloat(savedWallet);
        if(savedCart) agriEngine.state.cart = JSON.parse(savedCart);
        localStorage.setItem('agri_last_sync', updateID);
    }
})();
// 2. JUMIA-STYLE MARKET WITH SEARCH
agriEngine.renderEasyShop = function(v) {
    if (!v) v = document.getElementById('viewport');
    const q = (this.marketState.searchQuery || "").toLowerCase();
    const items = this.state.inventory.filter(i => i.n.toLowerCase().includes(q));
    v.innerHTML = `
        <div style="background:#f1f1f2; min-height:100vh; padding-bottom:100px;">
            <div style="background:#f68b1e; color:white; padding:15px; position:sticky; top:0; z-index:2000;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px;">
                    <span>? LIVE: OKOTH-HASH V12</span>
                    <span>?? 0742178833</span>
                </div>
                <input type="text" placeholder="Search 100+ items..." 
                    oninput="agriEngine.handleSearch(this.value)"
                    style="width:100%; padding:12px; border-radius:8px; border:none; color:#333;">
            </div>
            <div style="padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${items.map(item => `
                    <div style="background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                        <img src="${item.i}" style="width:100%; height:120px; object-fit:cover;">
                        <div style="padding:10px;">
                            <div style="font-size:12px; font-weight:bold; height:30px; overflow:even;">${item.n}</div>
                            <div style="color:#f68b1e; font-weight:bold; margin-top:5px;">KSh ${item.p.toLocaleString()}</div>
                        </div>
                        <button onclick="agriEngine.addToCart(${item.id})" style="width:100%; background:#f68b1e; color:white; border:none; padding:12px; font-weight:bold;">ADD TO CART</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};
agriEngine.render();
