import { STATE } from "../state.js";
import { sum } from "../utils.js";

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

function calculateROI(revenue, spend) {
    if (!spend) return 0;
    return (revenue / spend).toFixed(2);
}

function calculateACOS(revenue, spend) {
    if (!revenue) return 0;
    return ((spend / revenue) * 100).toFixed(2);
}

export function renderAdsSummary() {

    const totalRevenue = sum(STATE.data.adsDaily, "Revenue (Ads)");
    const totalSpend = sum(STATE.data.adsDaily, "Ad Spend");
    const totalUnits = sum(STATE.data.adsDaily, "Units Sold (Ads)");

    const roi = calculateROI(totalRevenue, totalSpend);
    const acos = calculateACOS(totalRevenue, totalSpend);

    return `
        <div class="section-title">Ads Summary</div>
        <div class="summary-grid">
            <div class="summary-card"><h3>Ad Spend</h3><p>${formatCurrency(totalSpend)}</p></div>
            <div class="summary-card"><h3>Ads Revenue</h3><p>${formatCurrency(totalRevenue)}</p></div>
            <div class="summary-card"><h3>ROI</h3><p>${roi}x</p></div>
            <div class="summary-card"><h3>ACOS</h3><p>${acos}%</p></div>
            <div class="summary-card"><h3>Units Sold</h3><p>${totalUnits.toLocaleString()}</p></div>
        </div>
    `;
}
