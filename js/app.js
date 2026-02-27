import { loadAllData } from "./data-loader.js";
import { STATE } from "./state.js";
import { sum } from "./utils.js";

function calculateROI(revenue, spend) {
    if (!spend) return 0;
    return (revenue / spend).toFixed(2);
}

function calculateACOS(revenue, spend) {
    if (!revenue) return 0;
    return ((spend / revenue) * 100).toFixed(2);
}

function renderExecutiveSummary() {

    const container = document.getElementById("summaryContainer");

    // GMV
    const totalGMV = sum(STATE.data.gmvDaily, "Net Sales (GMV)");
    const totalNetUnits = sum(STATE.data.gmvDaily, "Net Units");
    const totalCancel = sum(STATE.data.gmvDaily, "Cancellation Amount");
    const totalReturn = sum(STATE.data.gmvDaily, "Return Amount");

    // ADS
    const totalAdsRevenue = sum(STATE.data.adsDaily, "Revenue (Ads)");
    const totalSpend = sum(STATE.data.adsDaily, "Ad Spend");
    const totalAdUnits = sum(STATE.data.adsDaily, "Units Sold (Ads)");

    const overallROI = calculateROI(totalAdsRevenue, totalSpend);
    const overallACOS = calculateACOS(totalAdsRevenue, totalSpend);

    container.innerHTML = `
        <div class="summary-grid">

            <div class="summary-card">
                <h3>Total GMV</h3>
                <p>₹ ${totalGMV.toLocaleString()}</p>
            </div>

            <div class="summary-card">
                <h3>Total Net Units</h3>
                <p>${totalNetUnits.toLocaleString()}</p>
            </div>

            <div class="summary-card">
                <h3>Ads Revenue</h3>
                <p>₹ ${totalAdsRevenue.toLocaleString()}</p>
            </div>

            <div class="summary-card">
                <h3>Total Ad Spend</h3>
                <p>₹ ${totalSpend.toLocaleString()}</p>
            </div>

            <div class="summary-card">
                <h3>Overall ROI</h3>
                <p>${overallROI}x</p>
            </div>

            <div class="summary-card">
                <h3>Overall ACOS</h3>
                <p>${overallACOS}%</p>
            </div>

            <div class="summary-card">
                <h3>Ad Units Sold</h3>
                <p>${totalAdUnits.toLocaleString()}</p>
            </div>

            <div class="summary-card">
                <h3>Cancellation Impact</h3>
                <p>₹ ${totalCancel.toLocaleString()}</p>
            </div>

            <div class="summary-card">
                <h3>Return Impact</h3>
                <p>₹ ${totalReturn.toLocaleString()}</p>
            </div>

        </div>
    `;
}

async function init() {
    await loadAllData();
    renderExecutiveSummary();
}

init();
