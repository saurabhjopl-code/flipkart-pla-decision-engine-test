import { STATE } from "../state.js";

export function renderKeywordReport(container) {

    if (!container) return;

    const data = STATE.data.keyword || [];

    container.innerHTML = `
        <div class="section-title">Keyword Performance</div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Keyword</th>
                    <th>Campaign</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Spend</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(r => `
                    <tr>
                        <td>${r["Keyword"]}</td>
                        <td>${r["Campaign Name"]}</td>
                        <td>${r["Views"]}</td>
                        <td>${r["Clicks"]}</td>
                        <td>₹ ${Number(r["Ad Spend"] || 0).toLocaleString()}</td>
                        <td>₹ ${Number(r["Revenue (Ads)"] || 0).toLocaleString()}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}
