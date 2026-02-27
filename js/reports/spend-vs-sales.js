import { STATE } from "../state.js";

export function renderSpendVsSales(container) {

    if (!container) return;

    const data = STATE.data.adsDaily || [];

    container.innerHTML = `
        <div class="section-title">Spend vs Sales</div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Ad Spend</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(r => `
                    <tr>
                        <td>${r["Date"]}</td>
                        <td>₹ ${Number(r["Ad Spend"] || 0).toLocaleString()}</td>
                        <td>₹ ${Number(r["Revenue (Ads)"] || 0).toLocaleString()}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
