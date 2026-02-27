import { STATE } from "../state.js";

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

function consolidate(data) {
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
        grouped[date].grossAmount += Number(row["Gross Sale Amount"] || 0);
        grouped[date].cancelUnits += Number(row["Cancel Units"] || 0);
        grouped[date].cancelAmount += Number(row["Cancel Amount"] || 0);
        grouped[date].returnUnits += Number(row["Return Units"] || 0);
        grouped[date].returnAmount += Number(row["Return Amount"] || 0);
        grouped[date].netUnits += Number(row["Net Units"] || 0);
        grouped[date].netSales += Number(row["Net Sales (GMV)"] || 0);
    });

    return grouped;
}

export function renderSalesHealth(container) {

    const grouped = consolidate(STATE.data.gmvDaily);
    const dates = Object.keys(grouped).sort();

    container.innerHTML = `
        <div class="section-title">Sales Health</div>

        <div class="table-wrapper">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Gross Units</th>
                        <th>Gross Sale Amount</th>
                        <th>Cancel Units</th>
                        <th>Cancel Amount</th>
                        <th>Return Units</th>
                        <th>Return Amount</th>
                        <th>Net Units</th>
                        <th>Net Sales</th>
                    </tr>
                </thead>
                <tbody>
                    ${dates.map(d => {
                        const g = grouped[d];
                        return `
                            <tr>
                                <td>${d}</td>
                                <td>${g.grossUnits}</td>
                                <td>${formatCurrency(g.grossAmount)}</td>
                                <td>${g.cancelUnits}</td>
                                <td>${formatCurrency(g.cancelAmount)}</td>
                                <td>${g.returnUnits}</td>
                                <td>${formatCurrency(g.returnAmount)}</td>
                                <td>${g.netUnits}</td>
                                <td>${formatCurrency(g.netSales)}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}
