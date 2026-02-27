import { STATE } from "../state.js";

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

export function renderKeywordReport(container) {

    const grouped = {};

    STATE.data.keyword.forEach(row => {

        const key = row["Keyword"];
        if (!grouped[key]) {
            grouped[key] = {
                match: row["Match Type"] || "-",
                campaign: row["Campaign Name"] || "-",
                views: 0,
                clicks: 0,
                spend: 0,
                units: 0,
                revenue: 0
            };
        }

        grouped[key].views += Number(row["Views"] || 0);
        grouped[key].clicks += Number(row["Clicks"] || 0);
        grouped[key].spend += Number(row["Ad Spend"] || 0);
        grouped[key].units += Number(row["Units Sold (Ads)"] || 0);
        grouped[key].revenue += Number(row["Revenue (Ads)"] || 0);
    });

    const keys = Object.keys(grouped);

    container.innerHTML = `
        <div class="section-title">Keyword Performance</div>

        <div class="table-wrapper">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Match</th>
                        <th>Campaign</th>
                        <th>Views</th>
                        <th>Clicks</th>
                        <th>CTR %</th>
                        <th>Spend</th>
                        <th>Total Units</th>
                        <th>Total Revenue</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody>
                    ${keys.map(k => {
                        const g = grouped[k];
                        const ctr = g.views ? ((g.clicks / g.views) * 100).toFixed(2) : 0;
                        const roi = g.spend ? (g.revenue / g.spend).toFixed(2) : 0;

                        return `
                            <tr>
                                <td>${k}</td>
                                <td>${g.match}</td>
                                <td>${g.campaign}</td>
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
