import { STATE } from "../state.js";

let currentType = "GMV";
let salesChart = null;

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

function getDataset() {
    return currentType === "GMV"
        ? STATE.data.gmvDaily
        : STATE.data.ctrDaily;
}

function getRevenueField() {
    return currentType === "GMV"
        ? "Net Sales (GMV)"
        : "Net Sales";
}

function consolidateByDate(data, revenueField) {

    const grouped = {};

    data.forEach(row => {

        const date = row["Date"];

        if (!grouped[date]) {
            grouped[date] = {
                grossUnits: 0,
                grossAmount: 0,
                cancelUnits: 0,
                cancelAmount: 0,
                returnUnits: 0,
                returnAmount: 0,
                netUnits: 0,
                netSales: 0
            };
        }

        grouped[date].grossUnits += Number(row["Gross Units"] || 0);
        grouped[date].grossAmount += Number(row["Gross Sale Amount"] || row["Gross Revenue"] || 0);
        grouped[date].cancelUnits += Number(row["Cancellation Units"] || 0);
        grouped[date].cancelAmount += Number(row["Cancellation Amount"] || 0);
        grouped[date].returnUnits += Number(row["Return Units"] || 0);
        grouped[date].returnAmount += Number(row["Return Amount"] || 0);
        grouped[date].netUnits += Number(row["Net Units"] || 0);
        grouped[date].netSales += Number(row[revenueField] || 0);
    });

    return grouped;
}

export function renderSalesHealth(container) {

    if (!container) return;

    const data = getDataset();
    const revenueField = getRevenueField();

    const grouped = consolidateByDate(data, revenueField);
    const dates = Object.keys(grouped).sort();

    container.innerHTML = `
        <div class="section-title">Sales Health</div>

        <div class="toggle-group">
            <button class="toggle-btn ${currentType==="GMV"?"active":""}" onclick="window.switchSalesType('GMV')">GMV</button>
            <button class="toggle-btn ${currentType==="CTR"?"active":""}" onclick="window.switchSalesType('CTR')">CTR</button>
        </div>

        <div class="chart-wrapper">
            <canvas id="salesHealthChart"></canvas>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Gross Units</th>
                    <th>Gross Amount</th>
                    <th>Cancel Units</th>
                    <th>Cancel Amount</th>
                    <th>Return Units</th>
                    <th>Return Amount</th>
                    <th>Net Units</th>
                    <th>Net Sales</th>
                </tr>
            </thead>
            <tbody>
                ${dates.map(date => `
                    <tr>
                        <td>${date}</td>
                        <td>${grouped[date].grossUnits}</td>
                        <td>${formatCurrency(grouped[date].grossAmount)}</td>
                        <td>${grouped[date].cancelUnits}</td>
                        <td>${formatCurrency(grouped[date].cancelAmount)}</td>
                        <td>${grouped[date].returnUnits}</td>
                        <td>${formatCurrency(grouped[date].returnAmount)}</td>
                        <td>${grouped[date].netUnits}</td>
                        <td>${formatCurrency(grouped[date].netSales)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    renderChart(dates, grouped);
}

function renderChart(dates, grouped) {

    const ctx = document.getElementById("salesHealthChart");
    if (!ctx) return;

    if (salesChart) salesChart.destroy();

    salesChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Net Sales",
                    data: dates.map(d => grouped[d].netSales)
                }
            ]
        }
    });
}

window.switchSalesType = function(type) {
    currentType = type;
    const container = document.getElementById("reportContainer");
    renderSalesHealth(container);
};
