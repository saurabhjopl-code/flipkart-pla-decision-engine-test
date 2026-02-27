import { loadAllData } from "./data-loader.js";
import { STATE } from "./state.js";
import { sum } from "./utils.js";

function renderExecutiveSummary() {

    const container = document.getElementById("summaryContainer");

    const totalGMV = sum(STATE.data.gmvDaily, "Net Sales (GMV)");
    const totalAdsRevenue = sum(STATE.data.adsDaily, "Revenue (Ads)");
    const totalSpend = sum(STATE.data.adsDaily, "Ad Spend");

    container.innerHTML = `
        <div class="summary-grid">
            <div class="summary-card">
                <h3>Total GMV</h3>
                <p>₹ ${totalGMV.toLocaleString()}</p>
            </div>
            <div class="summary-card">
                <h3>Ads Revenue</h3>
                <p>₹ ${totalAdsRevenue.toLocaleString()}</p>
            </div>
            <div class="summary-card">
                <h3>Total Ad Spend</h3>
                <p>₹ ${totalSpend.toLocaleString()}</p>
            </div>
        </div>
    `;
}

async function init() {
    await loadAllData();
    renderExecutiveSummary();
}

init();
