// js/ui/dashboardUI.js

import { renderChart } from "./chartsUI.js";

export function renderExecutiveDashboard(report) {
  const reportSection = document.getElementById("report-section");
  if (!reportSection) return;

  // 🔥 Clear entire section before rendering
  reportSection.innerHTML = "";

  // Create executive container
  const container = document.createElement("section");
  container.id = "executive-dashboard";

  container.innerHTML = `
    <div id="executive-summary-container" class="summary-grid"></div>

    <div id="executive-charts-container">

      <div class="chart-row full-width">
        <div id="chart-revenueTrend" class="chart-box"></div>
      </div>

      <div class="chart-row two-col">
        <div id="chart-conversionFunnel" class="chart-box"></div>
        <div id="chart-qualityMetrics" class="chart-box"></div>
      </div>

      <div class="chart-row full-width">
        <div id="chart-inventoryHealth" class="chart-box"></div>
      </div>

    </div>
  `;

  reportSection.appendChild(container);

  renderSummary(report.summary);
  renderCharts(report.charts);
}

/* ======================================
   TABLE VIEW RENDER (For other reports)
====================================== */

export function renderTableReport(columns, rows, loadCount = 50) {
  const reportSection = document.getElementById("report-section");
  if (!reportSection) return;

  reportSection.innerHTML = "";

  const tableWrapper = document.createElement("div");
  tableWrapper.className = "table-wrapper";

  const table = document.createElement("table");
  table.className = "report-table";

  // HEADER
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  columns.forEach(col => {
    const th = document.createElement("th");
    th.innerText = col;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // BODY
  const tbody = document.createElement("tbody");

  const visibleRows = rows.slice(0, loadCount);

  visibleRows.forEach(row => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      td.innerText = row[col] ?? "-";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableWrapper.appendChild(table);

  // Load More
  if (rows.length > loadCount) {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "load-more-btn";
    loadMoreBtn.innerText = "Load More";

    loadMoreBtn.onclick = () => {
      renderTableReport(columns, rows, loadCount + 50);
    };

    tableWrapper.appendChild(loadMoreBtn);
  }

  reportSection.appendChild(tableWrapper);
}

/* ======================================
   SUMMARY
====================================== */

function renderSummary(summary) {
  const container = document.getElementById("executive-summary-container");
  if (!container) return;

  container.innerHTML = "";

  const cards = [
    ["Total Revenue", formatCurrency(summary.totals.revenue)],
    ["Total Views", formatNumber(summary.totals.views)],
    ["CTR", formatPercent(summary.kpis.ctr)],
    ["CVR", formatPercent(summary.kpis.cvr)],
    ["Return %", formatPercent(summary.kpis.returnRate)],
    ["Avg DOI", formatNumber(summary.kpis.avgDoi)]
  ];

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "summary-card";
    div.innerHTML = `
      <div class="summary-title">${card[0]}</div>
      <div class="summary-value">${card[1]}</div>
    `;
    container.appendChild(div);
  });
}

/* ======================================
   CHARTS
====================================== */

function renderCharts(charts) {
  charts.forEach(chart => {
    renderChart(chart);
  });
}

/* ======================================
   FORMATTERS
====================================== */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Math.round(value || 0));
}

function formatPercent(value) {
  return `${((value || 0) * 100).toFixed(2)}%`;
}
