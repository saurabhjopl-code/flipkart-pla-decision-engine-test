import { STATE } from "../state.js";
import { sum } from "../utils.js";

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

export function renderCTRSummary() {

    const totalRevenue = sum(STATE.data.ctrDaily, "Net Sales");
    const totalUnits = sum(STATE.data.ctrDaily, "Net Units");
    const cancel = sum(STATE.data.ctrDaily, "Cancellation Amount");
    const returns = sum(STATE.data.ctrDaily, "Return Amount");

    return `
        <div class="summary-grid">
            <div class="summary-card"><h3>Total Revenue</h3><p>${formatCurrency(totalRevenue)}</p></div>
            <div class="summary-card"><h3>Net Units</h3><p>${totalUnits.toLocaleString()}</p></div>
            <div class="summary-card"><h3>Cancellation Impact</h3><p>${formatCurrency(cancel)}</p></div>
            <div class="summary-card"><h3>Return Impact</h3><p>${formatCurrency(returns)}</p></div>
        </div>
    `;
}
