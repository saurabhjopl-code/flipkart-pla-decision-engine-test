import { STATE } from "../state.js";

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

export function renderPlacementReport(container) {

    const grouped = {};

    STATE.data.campaign.forEach(row => {

        const placement = row["Placement Type"] || "Not Defined";

        if (!grouped[placement]) {
            grouped[placement] = {
                rows: [],
                views: 0,
                clicks: 0,
                spend: 0,
                units: 0,
                revenue: 0
            };
        }

        grouped[placement].views += Number(row["Views"] || 0);
        grouped[placement].clicks += Number(row["Clicks"] || 0);
        grouped[placement].spend += Number(row["Ad Spend"] || 0);
        grouped[placement].units += Number(row["Units Sold (Ads)"] || 0);
        grouped[placement].revenue += Number(row["Revenue (Ads)"] || 0);

        grouped[placement].rows.push(row);
    });

    const placements = Object.keys(grouped);

    container.innerHTML = `
        <div class="section-title">Placement Performance</div>

        <div class="table-wrapper">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Placement</th>
                        <th>Views</th>
                        <th>Clicks</th>
                        <th>CTR %</th>
                        <th>Ad Spend</th>
                        <th>Total Units</th>
                        <th>Total Revenue</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody>
                    ${placements.map(p => {
                        const g = grouped[p];
                        const ctr = g.views ? ((g.clicks / g.views) * 100).toFixed(2) : 0;
                        const roi = g.spend ? (g.revenue / g.spend).toFixed(2) : 0;

                        return `
                            <tr>
                                <td>${p}</td>
                                <td>${g.views}</td>
                                <td>${g.clicks}</td>
                                <td>${ctr}</td>
                                <td>${formatCurrency(g.spend)}</td>
                                <td>${g.units}</td>
                                <td>${formatCurrency(g.revenue)}</td>
                                <td>${roi}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}
