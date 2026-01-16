/**
 * AgriMastery Global Search Engine
 * Prioritizes Certified Master Sellers
 */

class GlobalSearch {
    static filterProducts(productList, query) {
        console.log([SEARCH] Querying catalog for: \);
        
        return productList
            .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => {
                // Professional Logic: If 'a' is certified and 'b' is not, 'a' comes first.
                if (a.isCertified && !b.isCertified) return -1;
                if (!a.isCertified && b.isCertified) return 1;
                return 0;
            });
    }
}
