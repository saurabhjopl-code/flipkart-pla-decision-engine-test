import { STATE } from "../state.js";

let keywordChart = null;

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

export function renderKeywordReport(container) {

    const grouped = {};

    STATE.data.keyword.forEach(row => {

        const key = row["Keyword"];

        if (!grouped[key]) {
            grouped[key] = {
                match: row["Match Type"],
                campaign: row["Campaign Name"],
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

        <div class="chart-wrapper">
            <canvas id="keywordChart"></canvas>
        </div>

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
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${keys.map(k => {

                    const g = grouped[k];
                    const ctr = g.views ? ((g.clicks / g.views) * 100).toFixed(2) : 0;
                    const roi = g.spend ? (g.revenue / g.spend).toFixed(2) : 0;

                    const action =
                        roi > 4 ? "Scale" :
                        roi < 1.5 ? "Stop" :
                        "Hold";

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
                            <td>${action}</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;

    renderChart(keys, grouped);
}

function renderChart(keys, grouped) {

    const ctx = document.getElementById("keywordChart");
    if (!ctx) return;

    if (keywordChart) keywordChart.destroy();

    keywordChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: keys,
            datasets: [
                {
                    label: "Spend",
                    data: keys.map(k => grouped[k].spend)
                },
                {
                    label: "Revenue",
                    data: keys.map(k => grouped[k].revenue)
                }
            ]
        }
    });
}
