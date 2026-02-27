import { STATE } from "../state.js";

let spendChart = null;

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

function consolidate() {

    const grouped = {};

    STATE.data.gmvDaily.forEach(row => {

        const date = row["Date"];

        if (!grouped[date]) {
            grouped[date] = {
                grossUnits: 0,
                netSales: 0,
                adSpend: 0
            };
        }

        grouped[date].grossUnits += Number(row["Gross Units"] || 0);
        grouped[date].netSales += Number(row["Net Sales (GMV)"] || 0);
    });

    STATE.data.adsDaily.forEach(row => {
        const date = row["Date"];
        if (!grouped[date]) return;
        grouped[date].adSpend += Number(row["Ad Spend"] || 0);
    });

    return grouped;
}

export function renderSpendVsSales(container) {

    const grouped = consolidate();
    const dates = Object.keys(grouped).sort();

    container.innerHTML = `
        <div class="section-title">Spend vs Sales</div>

        <div class="chart-wrapper">
            <canvas id="spendVsSalesChart"></canvas>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Gross Units</th>
                    <th>Net Sales (GMV)</th>
                    <th>Actual Ads Spend</th>
                    <th>Fixed Ads (3%)</th>
                    <th>Ads Diff (₹)</th>
                    <th>Ads Diff (%)</th>
                </tr>
            </thead>
            <tbody>
                ${dates.map(date => {

                    const netSales = grouped[date].netSales;
                    const fixed = netSales * 0.03;
                    const spend = grouped[date].adSpend;
                    const diff = spend - fixed;
                    const diffPct = fixed ? ((diff / fixed) * 100).toFixed(2) : 0;

                    return `
                        <tr>
                            <td>${date}</td>
                            <td>${grouped[date].grossUnits}</td>
                            <td>${formatCurrency(netSales)}</td>
                            <td>${formatCurrency(spend)}</td>
                            <td>${formatCurrency(fixed)}</td>
                            <td>${formatCurrency(diff)}</td>
                            <td>${diffPct}%</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;

    renderChart(dates, grouped);
}

function renderChart(dates, grouped) {

    const ctx = document.getElementById("spendVsSalesChart");
    if (!ctx) return;

    if (spendChart) spendChart.destroy();

    spendChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Actual Ads Spend",
                    data: dates.map(d => grouped[d].adSpend)
                },
                {
                    label: "Fixed Ads (3%)",
                    data: dates.map(d => grouped[d].netSales * 0.03)
                }
            ]
        }
    });
}
