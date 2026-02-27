import { STATE } from "../state.js";
import { sum } from "../utils.js";

export function renderCampaignReport(container) {

    if (!container) return;

    const data = STATE.data.campaign || [];

    const grouped = {};

    data.forEach(row => {

        const id = row["Campaign ID"];
        const name = row["Campaign Name"];

        if (!grouped[id]) {
            grouped[id] = {
                id,
                name,
                views: 0,
                clicks: 0,
                spend: 0,
                units: 0,
                revenue: 0
            };
        }

        grouped[id].views += Number(row["Views"] || 0);
        grouped[id].clicks += Number(row["Clicks"] || 0);
        grouped[id].spend += Number(row["Ad Spend"] || 0);
        grouped[id].units += Number(row["Units Sold (Ads)"] || 0);
        grouped[id].revenue += Number(row["Revenue (Ads)"] || 0);
    });

    const rows = Object.values(grouped);

    container.innerHTML = `
        <div class="section-title">Campaign Performance</div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Campaign ID</th>
                    <th>Campaign Name</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Ad Spend</th>
                    <th>Units</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${rows.map(r => `
                    <tr>
                        <td>${r.id}</td>
                        <td>${r.name}</td>
                        <td>${r.views}</td>
                        <td>${r.clicks}</td>
                        <td>₹ ${r.spend.toLocaleString()}</td>
                        <td>${r.units}</td>
                        <td>₹ ${r.revenue.toLocaleString()}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
