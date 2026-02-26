// js/main.js

import { fetchCSV } from "./data/fetchEngine.js";
import { generateExecutiveReport } from "./reports/executiveReport.js";
import { renderExecutiveDashboard } from "./ui/dashboardUI.js";

/* ======================================
   CONFIG — GOOGLE SHEET LINKS
====================================== */

const CONFIG = {
  salesReport: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-6KShJnKfPviCRzYVJWchuHhFBQY8po5-anJ87JA73AVGE3uY8qY_TefaQFXtyxBNmNYHuaISkGyT/pub?gid=1245431300&single=true&output=csv",
  salesMonthly: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-6KShJnKfPviCRzYVJWchuHhFBQY8po5-anJ87JA73AVGE3uY8qY_TefaQFXtyxBNmNYHuaISkGyT/pub?gid=443969071&single=true&output=csv",
  trafficReport: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-6KShJnKfPviCRzYVJWchuHhFBQY8po5-anJ87JA73AVGE3uY8qY_TefaQFXtyxBNmNYHuaISkGyT/pub?gid=1205093811&single=true&output=csv",
  trafficMonthly: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-6KShJnKfPviCRzYVJWchuHhFBQY8po5-anJ87JA73AVGE3uY8qY_TefaQFXtyxBNmNYHuaISkGyT/pub?gid=2112938796&single=true&output=csv",
  stockMaster: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-6KShJnKfPviCRzYVJWchuHhFBQY8po5-anJ87JA73AVGE3uY8qY_TefaQFXtyxBNmNYHuaISkGyT/pub?gid=623504169&single=true&output=csv",
  dimSku: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-6KShJnKfPviCRzYVJWchuHhFBQY8po5-anJ87JA73AVGE3uY8qY_TefaQFXtyxBNmNYHuaISkGyT/pub?gid=1901424404&single=true&output=csv"
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
   LOAD & PROCESS DATA
====================================== */

async function loadData() {
  try {
    updateProgress(10);

    const [
      salesMonthly,
      trafficMonthly,
      salesReport,
      trafficReport,
      stockMaster,
      dimSku
    ] = await Promise.all([
      fetchCSV(CONFIG.salesMonthly),
      fetchCSV(CONFIG.trafficMonthly),
      fetchCSV(CONFIG.salesReport),
      fetchCSV(CONFIG.trafficReport),
      fetchCSV(CONFIG.stockMaster),
      fetchCSV(CONFIG.dimSku)
    ]);

    updateProgress(60);

    appState.processed.monthlyData = buildMonthlyDataset(
      salesMonthly,
      trafficMonthly,
      stockMaster,
      dimSku
    );

    appState.processed.dailyData = buildDailyDataset(
      salesReport,
      trafficReport,
      stockMaster,
      dimSku
    );

    updateProgress(100);

    renderExecutive();

  } catch (error) {
    console.error("Data Load Error:", error);
  }
}

/* ======================================
   MONTHLY DATASET BUILDER
====================================== */

function buildMonthlyDataset(sales, traffic, stock, dimSku) {
  const stockMap = mapByKey(stock, "mpsku");
  const trafficMap = groupByCompositeKey(traffic, "mpsku", "month");
  const skuMap = mapByKey(dimSku, "mpsku");

  return sales.map(row => {
    const key = `${row.mpsku}_${row.month}`;
    const trafficRow = trafficMap[key] || {};
    const stockRow = stockMap[row.mpsku] || {};
    const skuRow = skuMap[row.mpsku] || {};

    const finalUnits = Number(row.final_sale_units) || 0;
    const dailyVelocity = finalUnits / 30;

    return {
      ...row,
      ...trafficRow,
      ...skuRow,
      total_stock: Number(stockRow.total_stock) || 0,
      daily_velocity: dailyVelocity
    };
  });
}

/* ======================================
   DAILY DATASET BUILDER
====================================== */

function buildDailyDataset(sales, traffic, stock, dimSku) {
  const stockMap = mapByKey(stock, "mpsku");
  const trafficMap = groupByCompositeKey(traffic, "mpsku", "date");
  const skuMap = mapByKey(dimSku, "mpsku");

  return sales.map(row => {
    const key = `${row.mpsku}_${row.order_date}`;
    const trafficRow = trafficMap[key] || {};
    const stockRow = stockMap[row.mpsku] || {};
    const skuRow = skuMap[row.mpsku] || {};

    const finalUnits = Number(row.final_sale_units) || 0;

    return {
      ...row,
      date: row.order_date,
      ...trafficRow,
      ...skuRow,
      total_stock: Number(stockRow.total_stock) || 0,
      daily_velocity: finalUnits
    };
  });
}

/* ======================================
   UTILITIES
====================================== */

function mapByKey(array, key) {
  const map = {};
  array.forEach(item => {
    map[item[key]] = item;
  });
  return map;
}

function groupByCompositeKey(array, key1, key2) {
  const map = {};
  array.forEach(item => {
    const composite = `${item[key1]}_${item[key2]}`;
    map[composite] = item;
  });
  return map;
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
   PROGRESS BAR
====================================== */

function updateProgress(percent) {
  const fill = document.getElementById("progress-bar-fill");
  const text = document.getElementById("progress-percentage");
  const section = document.getElementById("progress-section");
  const status = document.getElementById("progress-status");

  if (!fill) return;

  fill.style.width = percent + "%";
  text.innerText = percent + "%";

  if (percent >= 100) {
    fill.style.background = "var(--success)";
    status.innerText = "All Data Loaded Successfully";
    setTimeout(() => {
      section.style.display = "none";
    }, 1500);
  }
}
