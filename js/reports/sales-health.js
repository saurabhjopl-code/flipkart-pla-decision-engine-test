import { STATE } from "../state.js";

let currentType = "GMV";

/* ===============================
   HELPERS
=================================*/

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

/* ===============================
   TABLE BUILDER
=================================*/

function buildTable() {

    const dataset = getDataset();
    const revenueField = getRevenueField();

    if (!dataset.length) {
        return `<div class="no-data">No Data Available</div>`;
    }

    const rows = dataset
        .sort((a,b)=> new Date(a["Date"]) - new Date(b["Date"]))
        .map(row => {

            const grossUnits =
                Number(row["Gross Units"] || row["Gross Sale Units"] || 0);

            const grossAmount =
                Number(row["Gross GMV"] || row["Gross Sale Amount"] || 0);

            const cancelUnits =
                Number(row["Cancellation Units"] || row["Cancel Units"] || 0);

            const cancelAmount =
                Number(row["Cancellation Amount"] || row["Cancel Amount"] || 0);

            const returnUnits =
                Number(row["Return Units"] || 0);

            const returnAmount =
                Number(row["Return Amount"] || 0);

            const netUnits =
                Number(row["Net Units"] || 0);

            const netSales =
                Number(row[revenueField] || 0);

            return `
                <tr>
                    <td>${row["Date"]}</td>
                    <td>${grossUnits.toLocaleString()}</td>
                    <td>${formatCurrency(grossAmount)}</td>
                    <td>${cancelUnits.toLocaleString()}</td>
                    <td>${formatCurrency(cancelAmount)}</td>
                    <td>${returnUnits.toLocaleString()}</td>
                    <td>${formatCurrency(returnAmount)}</td>
                    <td>${netUnits.toLocaleString()}</td>
                    <td>${formatCurrency(netSales)}</td>
                </tr>
            `;
        }).join("");

    return `
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
                ${rows}
            </tbody>
        </table>
    `;
}

/* ===============================
   MAIN RENDER
=================================*/

export function renderSalesHealth() {

    const report = document.getElementById("reportContainer");
    if (!report) return;

    report.innerHTML = `
        <div class="section-title">Sales Health Report</div>

        <div class="toggle-group">
            <button class="toggle-btn ${currentType==="GMV"?"active":""}" 
                onclick="window.switchSalesType('GMV')">GMV</button>
            <button class="toggle-btn ${currentType==="CTR"?"active":""}" 
                onclick="window.switchSalesType('CTR')">CTR</button>
        </div>

        ${buildTable()}
    `;
}

/* ===============================
   TOGGLE HANDLER
=================================*/

window.switchSalesType = function(type) {
    currentType = type;
    renderSalesHealth();
};
