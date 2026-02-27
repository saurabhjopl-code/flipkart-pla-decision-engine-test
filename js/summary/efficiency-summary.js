import { STATE } from "../state.js";
import { sum } from "../utils.js";

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

export function renderEfficiencySummary() {

    const adRevenue = sum(STATE.data.adsDaily, "Revenue (Ads)");
    const adSpend = sum(STATE.data.adsDaily, "Ad Spend");

    const roi = adSpend ? (adRevenue / adSpend).toFixed(2) : 0;
    const acos = adRevenue ? ((adSpend / adRevenue) * 100).toFixed(2) : 0;

    return `
        <div class="summary-grid">
            <div class="summary-card"><h3>ROI</h3><p>${roi}x</p></div>
            <div class="summary-card"><h3>ACOS</h3><p>${acos}%</p></div>
            <div class="summary-card"><h3>Ad Spend</h3><p>${formatCurrency(adSpend)}</p></div>
            <div class="summary-card"><h3>Ads Revenue</h3><p>${formatCurrency(adRevenue)}</p></div>
        </div>
    `;
}
