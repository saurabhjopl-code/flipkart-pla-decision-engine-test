// js/main.js

import { generateExecutiveReport } from "./reports/executiveReport.js";
import { renderExecutiveDashboard } from "./ui/dashboardUI.js";

/* ======================================
   APP STATE
====================================== */

const appState = {
  processed: {
    monthlyData: [],
    dailyData: []
  },
  filters: {
    datasetMode: "monthly"
  }
};

/* ======================================
   INIT APP
====================================== */

document.addEventListener("DOMContentLoaded", () => {
  simulateDataLoad();
});

/* ======================================
   SIMULATED DATA (Replace with real fetch later)
====================================== */

function simulateDataLoad() {
  const monthlyData = generateMockMonthlyData();
  const dailyData = generateMockDailyData();

  appState.processed.monthlyData = monthlyData;
  appState.processed.dailyData = dailyData;

  updateProgress(100);

  renderExecutive();
}

/* ======================================
   RENDER EXECUTIVE
====================================== */

function renderExecutive() {
  const datasetMode = appState.filters.datasetMode;
  const data =
    datasetMode === "daily"
      ? appState.processed.dailyData
      : appState.processed.monthlyData;

  const report = generateExecutiveReport(data, datasetMode);

  renderExecutiveDashboard(report);
}

/* ======================================
   MOCK DATA GENERATORS
====================================== */

function generateMockMonthlyData() {
  const months = ["2025-01", "2025-02", "2025-03", "2025-04"];
  const skus = ["SKU1", "SKU2", "SKU3", "SKU4", "SKU5"];

  const data = [];

  months.forEach(month => {
    skus.forEach(sku => {
      const views = randomBetween(1000, 5000);
      const clicks = randomBetween(200, 800);
      const finalUnits = randomBetween(50, 300);
      const revenue = finalUnits * randomBetween(500, 1200);
      const grossUnits = finalUnits + randomBetween(10, 50);
      const cancelUnits = randomBetween(5, 20);
      const returnUnits = randomBetween(5, 25);
      const stock = randomBetween(200, 1000);
      const dailyVelocity = finalUnits / 30;

      data.push({
        mpsku: sku,
        month,
        views,
        clicks,
        final_sale_units: finalUnits,
        final_sale_amount: revenue,
        gross_units: grossUnits,
        cancellation_units: cancelUnits,
        return_units: returnUnits,
        total_stock: stock,
        daily_velocity: dailyVelocity
      });
    });
  });

  return data;
}

function generateMockDailyData() {
  const dates = ["2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04"];
  const skus = ["SKU1", "SKU2", "SKU3"];

  const data = [];

  dates.forEach(date => {
    skus.forEach(sku => {
      const views = randomBetween(200, 800);
      const clicks = randomBetween(50, 200);
      const finalUnits = randomBetween(10, 50);
      const revenue = finalUnits * randomBetween(500, 1200);
      const grossUnits = finalUnits + randomBetween(2, 10);
      const cancelUnits = randomBetween(1, 5);
      const returnUnits = randomBetween(1, 6);
      const stock = randomBetween(100, 400);
      const dailyVelocity = finalUnits;

      data.push({
        mpsku: sku,
        date,
        views,
        clicks,
        final_sale_units: finalUnits,
        final_sale_amount: revenue,
        gross_units: grossUnits,
        cancellation_units: cancelUnits,
        return_units: returnUnits,
        total_stock: stock,
        daily_velocity: dailyVelocity
      });
    });
  });

  return data;
}

/* ======================================
   UTILITIES
====================================== */

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ======================================
   PROGRESS BAR CONTROL
====================================== */

function updateProgress(percent) {
  const fill = document.getElementById("progress-bar-fill");
  const text = document.getElementById("progress-percentage");
  const section = document.getElementById("progress-section");
  const status = document.getElementById("progress-status");

  if (!fill || !text || !section) return;

  fill.style.width = percent + "%";
  text.innerText = percent + "%";

  if (percent >= 100) {
    fill.style.background = "var(--success)";
    if (status) {
      status.innerText = "All Data Loaded Successfully";
    }
    setTimeout(() => {
      section.style.display = "none";
    }, 1500);
  }
}
