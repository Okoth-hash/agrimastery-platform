/**
 * AgriMastery Global Analytics Engine
 * Provides Business Intelligence for okoth-hash
 */

class AnalyticsEngine {
    static generateRegionalReport(salesData) {
        const report = {
            totalRevenue: 0,
            topCategory: "",
            regionalBreakdown: {}
        };

        salesData.forEach(sale => {
            report.totalRevenue += sale.amount;
            // Count sales by region
            report.regionalBreakdown[sale.region] = (report.regionalBreakdown[sale.region] || 0) + 1;
        });

        console.log("--- GLOBAL SALES REPORT GENERATED ---");
        return report;
    }
}
