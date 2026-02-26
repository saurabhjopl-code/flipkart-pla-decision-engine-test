// js/main.js

import { fetchCSV } from "./data/fetchEngine.js";
import { generateExecutiveReport } from "./reports/executiveReport.js";
import { renderExecutiveDashboard } from "./ui/dashboardUI.js";
import { applyAllFilters } from "./filters/filterEngine.js";
import { populateFilters } from "./ui/filterUI.js";

const CONFIG = {
  salesMonthly: "YOUR_MONTHLY_URL",
  trafficMonthly: "YOUR_TRAFFIC_MONTHLY_URL",
  stockMaster: "YOUR_STOCK_URL",
  dimSku: "YOUR_DIMSKU_URL"
};

const appState = {
  monthlyData: [],
  filters: {
    months: [],
    category: [],
    brand: [],
    vertical: [],
    style: [],
    search: ""
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  bindSearch();
});

async function loadData() {
  const [salesMonthly, trafficMonthly, stockMaster, dimSku] =
    await Promise.all([
      fetchCSV(CONFIG.salesMonthly),
      fetchCSV(CONFIG.trafficMonthly),
      fetchCSV(CONFIG.stockMaster),
      fetchCSV(CONFIG.dimSku)
    ]);

  appState.monthlyData = salesMonthly.map(row => ({
    ...row,
    views: Number(row.views) || 0,
    clicks: Number(row.clicks) || 0,
    final_sale_units: Number(row.final_sale_units) || 0,
    final_sale_amount: Number(row.final_sale_amount) || 0,
    total_stock: Number(row.total_stock) || 0,
    daily_velocity: (Number(row.final_sale_units) || 0) / 30
  }));

  populateFilters(appState.monthlyData, updateFilter);

  render();
}

function updateFilter(key, value) {
  appState.filters[key] = value;
  render();
}

function bindSearch() {
  const input = document.getElementById("sku-search");
  input.addEventListener("input", e => {
    appState.filters.search = e.target.value;
    render();
  });
}

function render() {
  const filtered = applyAllFilters(appState.monthlyData, appState.filters);
  const report = generateExecutiveReport(filtered, "monthly");
  renderExecutiveDashboard(report);
}
