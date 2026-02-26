// js/main.js

import { fetchCSV } from "./data/fetchEngine.js";
import { generateExecutiveReport } from "./reports/executiveReport.js";
import { renderExecutiveDashboard } from "./ui/dashboardUI.js";

/* ======================================
   CONFIG — GOOGLE SHEETS
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
   CENTRAL APP STATE
====================================== */

const appState = {
  raw: {},
  processed: {
    monthlyData: [],
    dailyData: []
  },
  filters: {
    months: [],
    dateRange: null,
    search: "",
    datasetMode: "monthly"
  },
  activeReport: "executive"
};

/* ======================================
   INIT
====================================== */

document.addEventListener("DOMContentLoaded", async () => {
  bindSidebar();
  bindSearch();
  await loadData();
});

/* ======================================
   LOAD DATA
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

    renderApp();

  } catch (error) {
    console.error("Data Load Error:", error);
  }
}

/* ======================================
   DATASET BUILDERS
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

    return {
      ...row,
      ...trafficRow,
      ...skuRow,
      total_stock: Number(stockRow.total_stock) || 0,
      daily_velocity: finalUnits / 30
    };
  });
}

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
   FILTER ENGINE (BASIC VERSION)
====================================== */

function applyFilters(data) {
  let result = [...data];

  if (appState.filters.search) {
    const term = appState.filters.search.toLowerCase();
    result = result.filter(r =>
      String(r.mpsku).toLowerCase().includes(term)
    );
  }

  return result;
}

/* ======================================
   RENDER APP
====================================== */

function renderApp() {
  const dataset =
    appState.filters.datasetMode === "daily"
      ? appState.processed.dailyData
      : appState.processed.monthlyData;

  const filtered = applyFilters(dataset);

  if (appState.activeReport === "executive") {
    const report = generateExecutiveReport(
      filtered,
      appState.filters.datasetMode
    );
    renderExecutiveDashboard(report);
  }
}

/* ======================================
   SIDEBAR NAV
====================================== */

function bindSidebar() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));

      item.classList.add("active");

      const text = item.innerText.toLowerCase();

      if (text.includes("executive")) {
        appState.activeReport = "executive";
      }

      renderApp();
    });
  });
}

/* ======================================
   SEARCH
====================================== */

function bindSearch() {
  const input = document.getElementById("sku-search");
  if (!input) return;

  input.addEventListener("input", e => {
    appState.filters.search = e.target.value;
    renderApp();
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
