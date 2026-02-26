// js/main.js

import { fetchCSV } from "./data/fetchEngine.js";
import { generateExecutiveReport } from "./reports/executiveReport.js";
import { renderExecutiveDashboard } from "./ui/dashboardUI.js";

/* ======================================
   🔧 CONFIG — PUT YOUR SHEET URLs HERE
====================================== */

const CONFIG = {
  monthlyURL: "PASTE_MONTHLY_SUMMARY_CSV_URL_HERE",
  dailyURL: "PASTE_DAILY_SUMMARY_CSV_URL_HERE"
};

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
   INIT
====================================== */

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
});

/* ======================================
   LOAD DATA
====================================== */

async function loadData() {
  try {
    updateProgress(20);

    const monthlyData = await fetchCSV(CONFIG.monthlyURL);
    updateProgress(60);

    const dailyData = await fetchCSV(CONFIG.dailyURL);
    updateProgress(90);

    appState.processed.monthlyData = monthlyData;
    appState.processed.dailyData = dailyData;

    updateProgress(100);

    renderExecutive();

  } catch (error) {
    console.error("Data Load Error:", error);
  }
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
