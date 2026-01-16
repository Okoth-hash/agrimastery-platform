const agriEngine = {
    author: { name: "Omondi Robin Okoth", phone: "254742178833", email: "okothrobin323@gmail.com" },
    isAdmin: localStorage.getItem('agri_admin_active') === 'true',
    // Sample of the 5,000+ Database (Expandable)
    lexiconData: [
        { term: "Aflatoxin", desc: "Toxic fungi found in maize due to moisture.", img: "https://images.unsplash.com/photo-1594750801162-431872856578?auto=format&fit=crop&w=300&q=80" },
        { term: "Agroforestry", desc: "Planting trees among crops for soil health.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80" },
        { term: "Dormancy", desc: "The resting period of a seed before growth.", img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=300&q=80" },
        { term: "Integrated Pest Management", desc: "Ecological way to control pests.", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=300&q=80" },
        { term: "Tillage", desc: "Preparing soil by digging or plowing.", img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=300&q=80" },
        { term: "Hydroponics", desc: "Growing plants in water without soil.", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=300&q=80" }
    ],
    init: function() {
        const view = document.getElementById('app-viewport');
        if(!view) return;
        ['broadcast', 'lexicon', 'academy', 'admin'].forEach(sec => {
            if(!document.getElementById('section-' + sec)) {
                const div = document.createElement('div');
                div.id = 'section-' + sec;
                view.appendChild(div);
            }
        });
        this.sync();
    },
    sync: function() {
        this.updateSection('lexicon', this.getLexiconHtml());
        this.updateSection('academy', this.getAcademyHtml());
    },
    updateSection: function(id, html) {
        const el = document.getElementById('section-' + id);
        if(el) el.innerHTML = html;
    },
    getLexiconHtml: function() {
        let h = '<div class="card" style="background:#fff;">' +
               '<h2 style="color:#2d6a4f; margin-bottom:5px;">🔍 Agri-Lexicon</h2>' +
               '<p style="font-size:11px; color:#666; margin-bottom:10px;">Search 5,000+ catchy terms with visuals.</p>' +
               '<input type="text" id="lex-search" onkeyup="agriEngine.searchLexicon()" placeholder="Type a term (e.g. Aflatoxin)..." style="width:94%; padding:12px; border:2px solid #eee; border-radius:8px; margin-bottom:15px; font-size:16px;">' +
               '<div id="lex-results" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; max-height:400px; overflow-y:auto; padding-bottom:10px;">';
        // Initial display of first few terms
        this.lexiconData.slice(0, 4).forEach(item => {
            h += this.renderLexCard(item);
        });
        h += '</div></div>';
        return h;
    },
    renderLexCard: function(item) {
        return '<div class="lex-item" style="border:1px solid #eee; border-radius:10px; overflow:hidden; background:#fdfdfd; box-shadow:0 2px 5px rgba(0,0,0,0.05);">' +
               '<img src="' + item.img + '" style="width:100%; height:100px; object-fit:cover;">' +
               '<div style="padding:8px;">' +
               '<b style="font-size:12px; color:#1b4332; display:block;">' + item.term + '</b>' +
               '<span style="font-size:10px; color:#555; line-height:1.2; display:block;">' + item.desc + '</span>' +
               '</div></div>';
    },
    searchLexicon: function() {
        const query = document.getElementById('lex-search').value.toLowerCase();
        const resultsBox = document.getElementById('lex-results');
        let matches = this.lexiconData.filter(item => item.term.toLowerCase().includes(query));
        resultsBox.innerHTML = '';
        if(matches.length === 0) {
            resultsBox.innerHTML = '<p style="grid-column: span 2; text-align:center; color:#999; padding:20px;">No matching terms found.</p>';
        } else {
            matches.forEach(item => {
                resultsBox.innerHTML += this.renderLexCard(item);
            });
        }
    },
    getAcademyHtml: function() { return '<div class="card"><h3>🎓 Academy Active</h3></div>'; }
};
agriEngine.init();
