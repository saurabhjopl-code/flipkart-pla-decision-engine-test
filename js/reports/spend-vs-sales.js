import { STATE } from "../state.js";

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
        if (!grouped[date]) {
            grouped[date] = {
                grossUnits: 0,
                netSales: 0,
                adSpend: 0
            };
        }
        grouped[date].adSpend += Number(row["Ad Spend"] || 0);
    });

    return grouped;
}

export function renderSpendVsSales(container) {

    const grouped = consolidate();
    const dates = Object.keys(grouped).sort();

    container.innerHTML = `
        <div class="section-title">Spend vs Sales</div>

        <div class="table-wrapper">
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
                        const g = grouped[date];
                        const fixed = g.netSales * 0.03;
                        const diff = g.adSpend - fixed;
                        const diffPct = fixed ? ((diff / fixed) * 100).toFixed(2) : 0;

                        return `
                            <tr>
                                <td>${date}</td>
                                <td>${g.grossUnits}</td>
                                <td>${formatCurrency(g.netSales)}</td>
                                <td>${formatCurrency(g.adSpend)}</td>
                                <td>${formatCurrency(fixed)}</td>
                                <td>${formatCurrency(diff)}</td>
                                <td>${diffPct}%</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}
