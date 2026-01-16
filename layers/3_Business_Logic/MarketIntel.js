/**
 * AgriMastery Market Intelligence Engine
 * Tracks real-time commodity prices in KES
 */

const marketPrices = {
    "Maize": { price: 3200, unit: "90kg bag", trend: "up" },
    "Beans": { price: 8500, unit: "90kg bag", trend: "stable" },
    "Potatoes": { price: 2500, unit: "50kg bag", trend: "down" }
};

function getLatestPrice(crop) {
    const data = marketPrices[crop];
    if (data) {
        return \Current price for \: KES \ per \. Trend is \.\;
    }
    return "Crop data not found.";
}
