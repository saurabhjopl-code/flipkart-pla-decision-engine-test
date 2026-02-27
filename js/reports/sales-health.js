import { STATE } from "../state.js";

export function renderSalesHealth(container) {

    if (!container) return;

    const data = STATE.data.gmvDaily || [];

    container.innerHTML = `
        <div class="section-title">Sales Health</div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Net Units</th>
                    <th>Net Sales</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(r => `
                    <tr>
                        <td>${r["Date"]}</td>
                        <td>${r["Net Units"]}</td>
                        <td>₹ ${Number(r["Net Sales (GMV)"] || 0).toLocaleString()}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
