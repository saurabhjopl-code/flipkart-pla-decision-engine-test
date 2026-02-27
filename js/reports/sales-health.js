import { STATE } from "../state.js";

let currentType = "GMV";

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

export function renderSalesHealth(container) {

    if (!container) return;

    const data = getDataset();
    const revenueField = getRevenueField();

    container.innerHTML = `
        <div class="section-title">Sales Health</div>

        <div class="toggle-group">
            <button class="toggle-btn ${currentType==="GMV"?"active":""}" onclick="window.switchSalesType('GMV')">GMV</button>
            <button class="toggle-btn ${currentType==="CTR"?"active":""}" onclick="window.switchSalesType('CTR')">CTR</button>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Gross Sale Units</th>
                    <th>Gross Sale Amount</th>
                    <th>Cancel Units</th>
                    <th>Cancel Amount</th>
                    <th>Return Units</th>
                    <th>Return Amount</th>
                    <th>Net Units</th>
                    <th>Net Sales Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        <td>${row["Date"]}</td>
                        <td>${row["Gross Units"] || 0}</td>
                        <td>${formatCurrency(row["Gross Sale Amount"] || row["Gross Revenue"] || 0)}</td>
                        <td>${row["Cancellation Units"] || 0}</td>
                        <td>${formatCurrency(row["Cancellation Amount"] || 0)}</td>
                        <td>${row["Return Units"] || 0}</td>
                        <td>${formatCurrency(row["Return Amount"] || 0)}</td>
                        <td>${row["Net Units"] || 0}</td>
                        <td>${formatCurrency(row[revenueField] || 0)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

window.switchSalesType = function(type) {
    currentType = type;
    const container = document.getElementById("reportContainer");
    renderSalesHealth(container);
};
