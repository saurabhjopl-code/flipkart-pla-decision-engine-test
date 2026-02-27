import { STATE } from "../state.js";

let campaignChart = null;

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

export function renderCampaignReport(container) {

    const grouped = {};

    STATE.data.campaign.forEach(row => {

        const id = row["Campaign ID"];

        if (!grouped[id]) {
            grouped[id] = {
                name: row["Campaign Name"],
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

    const ids = Object.keys(grouped);

    container.innerHTML = `
        <div class="section-title">Campaign Performance</div>

        <div class="chart-wrapper">
            <canvas id="campaignChart"></canvas>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th>Campaign ID</th>
                    <th>Campaign Name</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>CTR (%)</th>
                    <th>Ad Spend</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                    <th>ROI</th>
                    <th>ACOS (%)</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${ids.map(id => {

                    const g = grouped[id];
                    const ctr = g.views ? ((g.clicks / g.views) * 100).toFixed(2) : 0;
                    const roi = g.spend ? (g.revenue / g.spend).toFixed(2) : 0;
                    const acos = g.revenue ? ((g.spend / g.revenue) * 100).toFixed(2) : 0;

                    const action =
                        roi > 4 ? "Scale" :
                        roi < 1.5 ? "Stop" :
                        "Hold";

                    return `
                        <tr>
                            <td>${id}</td>
                            <td>${g.name}</td>
                            <td>${g.views}</td>
                            <td>${g.clicks}</td>
                            <td>${ctr}</td>
                            <td>${formatCurrency(g.spend)}</td>
                            <td>${g.units}</td>
                            <td>${formatCurrency(g.revenue)}</td>
                            <td>${roi}</td>
                            <td>${acos}</td>
                            <td>${action}</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;

    renderChart(ids, grouped);
}

function renderChart(ids, grouped) {

    const ctx = document.getElementById("campaignChart");
    if (!ctx) return;

    if (campaignChart) campaignChart.destroy();

    campaignChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ids,
            datasets: [
                {
                    label: "Ad Spend",
                    data: ids.map(id => grouped[id].spend)
                },
                {
                    label: "Revenue",
                    data: ids.map(id => grouped[id].revenue)
                }
            ]
        }
    });
}
