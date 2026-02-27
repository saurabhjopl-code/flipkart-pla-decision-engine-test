import { loadAllData } from "./data-loader.js";
import { STATE } from "./state.js";
import { sum } from "./utils.js";
import { initFilters, applyFilters } from "./filters.js";

let adsChart = null;
let salesChart = null;
let currentRevenueType = "GMV";

/* ===============================
   PROGRESS BAR CONTROL
=================================*/

function showLoader() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;

    bar.style.width = "30%";
    setTimeout(() => bar.style.width = "65%", 120);
}

function hideLoader() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;

    bar.style.width = "100%";
    setTimeout(() => {
        bar.style.width = "0%";
    }, 400);
}

/* ===============================
   HELPERS
=================================*/

function formatCurrency(num) {
    return "₹ " + Number(num || 0).toLocaleString();
}

function calculateROI(revenue, spend) {
    if (!spend) return 0;
    return (revenue / spend).toFixed(2);
}

function calculateACOS(revenue, spend) {
    if (!revenue) return 0;
    return ((spend / revenue) * 100).toFixed(2);
}

/* ===============================
   ADS SUMMARY
=================================*/

function renderAdsSummary() {

    const totalRevenue = sum(STATE.data.adsDaily, "Revenue (Ads)");
    const totalSpend = sum(STATE.data.adsDaily, "Ad Spend");
    const totalUnits = sum(STATE.data.adsDaily, "Units Sold (Ads)");

    const roi = calculateROI(totalRevenue, totalSpend);
    const acos = calculateACOS(totalRevenue, totalSpend);

    return `
        <div class="section-title">Ads Summary</div>
        <div class="summary-grid">
            <div class="summary-card"><h3>Ad Spend</h3><p>${formatCurrency(totalSpend)}</p></div>
            <div class="summary-card"><h3>Ads Revenue</h3><p>${formatCurrency(totalRevenue)}</p></div>
            <div class="summary-card"><h3>ROI</h3><p>${roi}x</p></div>
            <div class="summary-card"><h3>ACOS</h3><p>${acos}%</p></div>
            <div class="summary-card"><h3>Units Sold</h3><p>${totalUnits.toLocaleString()}</p></div>
        </div>
    `;
}

/* ===============================
   ADS LINE CHART
=================================*/

function renderAdsChart() {

    const ctx = document.getElementById("adsChart");
    if (!ctx) return;

    const grouped = {};

    STATE.data.adsDaily.forEach(row => {
        const date = row["Date"];
        if (!grouped[date]) grouped[date] = { spend: 0, revenue: 0 };
        grouped[date].spend += parseFloat(row["Ad Spend"]) || 0;
        grouped[date].revenue += parseFloat(row["Revenue (Ads)"]) || 0;
    });

    const labels = Object.keys(grouped).sort();
    const spendData = labels.map(d => grouped[d].spend);
    const revenueData = labels.map(d => grouped[d].revenue);

    if (adsChart) adsChart.destroy();

    adsChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                { label: "Ad Spend", data: spendData, borderWidth: 2, tension: 0.3 },
                { label: "Ads Revenue", data: revenueData, borderWidth: 2, tension: 0.3 }
            ]
        }
    });
}

/* ===============================
   REVENUE SUMMARY
=================================*/

function renderRevenueSummary(type = "GMV") {

    let revenueData = [];
    let revenueField = "";

    if (type === "GMV") {
        revenueData = STATE.data.gmvDaily;
        revenueField = "Net Sales (GMV)";
    } else {
        revenueData = STATE.data.ctrDaily;
        revenueField = "Net Sales";
    }

    const totalRevenue = sum(revenueData, revenueField);
    const totalUnits = sum(revenueData, "Net Units");
    const cancel = sum(revenueData, "Cancellation Amount");
    const returns = sum(revenueData, "Return Amount");

    return `
        <div class="section-title">Revenue Summary</div>
        <div class="toggle-group">
            <button class="toggle-btn ${type==="GMV"?"active":""}" onclick="window.switchRevenue('GMV')">GMV</button>
            <button class="toggle-btn ${type==="CTR"?"active":""}" onclick="window.switchRevenue('CTR')">CTR</button>
        </div>
        <div class="summary-grid">
            <div class="summary-card"><h3>Total Revenue</h3><p>${formatCurrency(totalRevenue)}</p></div>
            <div class="summary-card"><h3>Net Units</h3><p>${totalUnits.toLocaleString()}</p></div>
            <div class="summary-card"><h3>Cancellation Impact</h3><p>${formatCurrency(cancel)}</p></div>
            <div class="summary-card"><h3>Return Impact</h3><p>${formatCurrency(returns)}</p></div>
        </div>
    `;
}

/* ===============================
   SALES BAR CHART
=================================*/

function renderSalesChart(type = "GMV") {

    const ctx = document.getElementById("salesChart");
    if (!ctx) return;

    let dataset = [];
    let field = "";

    if (type === "GMV") {
        dataset = STATE.data.gmvDaily;
        field = "Net Sales (GMV)";
    } else {
        dataset = STATE.data.ctrDaily;
        field = "Net Sales";
    }

    const grouped = {};

    dataset.forEach(row => {
        const date = row["Date"];
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += parseFloat(row[field]) || 0;
    });

    const labels = Object.keys(grouped).sort();
    const values = labels.map(d => grouped[d]);

    if (salesChart) salesChart.destroy();

    salesChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{ label: "Daily Sales", data: values }]
        }
    });
}

/* ===============================
   MAIN RENDER
=================================*/

export function renderExecutive(type = currentRevenueType) {

    showLoader();
    currentRevenueType = type;

    const container = document.getElementById("summaryContainer");
    if (!container) return;

    container.innerHTML = `
        ${renderAdsSummary()}
        <div class="chart-wrapper">
            <div class="section-title">Daily Ads Spend vs Revenue</div>
            <canvas id="adsChart"></canvas>
        </div>
        ${renderRevenueSummary(type)}
        <div class="chart-wrapper">
            <div class="section-title">Daily Sales</div>
            <canvas id="salesChart"></canvas>
        </div>
    `;

    renderAdsChart();
    renderSalesChart(type);

    setTimeout(hideLoader, 300);
}

/* ===============================
   TOGGLE HANDLER
=================================*/

window.switchRevenue = function(type) {
    renderExecutive(type);
};

/* ===============================
   INIT
=================================*/

async function init() {

    showLoader();

    await loadAllData();
    initFilters();

    // AUTO CURRENT MONTH
    const today = new Date();
    const currentMonth =
        `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`;

    STATE.filters.month = currentMonth;

    const monthSelect = document.getElementById("monthFilter");
    if (monthSelect) monthSelect.value = currentMonth;

    applyFilters();

    setTimeout(hideLoader, 500);
}

init();
