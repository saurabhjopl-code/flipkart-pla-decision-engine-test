import { loadAllData } from "./data-loader.js";
import { STATE } from "./state.js";
import { sum } from "./utils.js";
import { initFilters, applyFilters } from "./filters.js";

import { renderSalesHealth } from "./reports/sales-health.js";
import { renderSpendVsSales } from "./reports/spend-vs-sales.js";
import { renderCampaignReport } from "./reports/campaign.js";
import { renderKeywordReport } from "./reports/keyword.js";
import { renderPlacementReport } from "./reports/placement.js";

let adsChart = null;
let salesChart = null;
let currentRevenueType = "GMV";
let currentPage = "executive";

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
   EXECUTIVE RENDER
=================================*/

export function renderExecutive(type = currentRevenueType) {

    currentPage = "executive";
    showLoader();

    const summaryContainer = document.getElementById("summaryContainer");
    const reportContainer = document.getElementById("reportContainer");

    if (!summaryContainer || !reportContainer) return;

    reportContainer.innerHTML = "";

    summaryContainer.innerHTML = `
        ${renderAdsSummary()}
    `;

    setTimeout(hideLoader, 300);
}

/* ===============================
   REPORT NAVIGATION
=================================*/

function loadReport(page) {

    currentPage = page;

    const summaryContainer = document.getElementById("summaryContainer");
    const reportContainer = document.getElementById("reportContainer");

    if (!summaryContainer || !reportContainer) return;

    if (page === "executive") {
        renderExecutive();
        return;
    }

    summaryContainer.innerHTML = "";
    reportContainer.innerHTML = "";

    switch (page) {
        case "sales-health":
            renderSalesHealth(reportContainer);
            break;
        case "spend-vs-sales":
            renderSpendVsSales(reportContainer);
            break;
        case "campaign":
            renderCampaignReport(reportContainer);
            break;
        case "keyword":
            renderKeywordReport(reportContainer);
            break;
        case "placement":
            renderPlacementReport(reportContainer);
            break;
    }
}

function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");
            const page = item.getAttribute("data-page");
            loadReport(page);
        });
    });
}

/* ===============================
   GLOBAL PAGE RERENDER
=================================*/

window.renderCurrentPage = function() {
    loadReport(currentPage);
};

/* ===============================
   INIT
=================================*/

async function init() {

    showLoader();

    await loadAllData();
    initFilters();
    initNavigation();

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
