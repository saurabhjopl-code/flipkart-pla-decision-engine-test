// js/ui/dashboardUI.js

import { renderChart } from "./chartsUI.js";

export function renderExecutiveDashboard(report) {
  if (!report || report.reportId !== "executive") {
    console.warn("Invalid report passed to Executive Dashboard");
    return;
  }

  renderSummary(report.summary);
  renderCharts(report.charts);
}

/* ======================================
   SUMMARY RENDERING
====================================== */

function renderSummary(summary) {
  const container = document.getElementById("executive-summary-container");
  if (!container) return;

  container.innerHTML = "";

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totals.revenue),
      sub: formatGrowth(summary.growth.revenueMoM)
    },
    {
      title: "Total Views",
      value: formatNumber(summary.totals.views),
      sub: ""
    },
    {
      title: "CTR",
      value: formatPercent(summary.kpis.ctr),
      sub: ""
    },
    {
      title: "CVR",
      value: formatPercent(summary.kpis.cvr),
      sub: ""
    },
    {
      title: "Return %",
      value: formatPercent(summary.kpis.returnRate),
      sub: ""
    },
    {
      title: "Avg DOI",
      value: formatNumber(summary.kpis.avgDoi),
      sub: ""
    }
  ];

  cards.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "summary-card";

    cardEl.innerHTML = `
      <div class="summary-title">${card.title}</div>
      <div class="summary-value">${card.value}</div>
      <div class="summary-sub">${card.sub}</div>
    `;

    container.appendChild(cardEl);
  });
}

/* ======================================
   CHART RENDERING
====================================== */

function renderCharts(charts = []) {
  if (!Array.isArray(charts)) return;

  charts.forEach(chartData => {
    renderChart(chartData);
  });
}

/* ======================================
   FORMATTERS
====================================== */

function formatCurrency(value) {
  if (!value && value !== 0) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatNumber(value) {
  if (!value && value !== 0) return "0";

  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

function formatPercent(value) {
  if (!value && value !== 0) return "0%";

  return `${(value * 100).toFixed(2)}%`;
}

function formatGrowth(value) {
  if (value === null || value === undefined) return "";

  const percent = (value * 100).toFixed(2);
  const arrow = value >= 0 ? "▲" : "▼";

  return `${arrow} ${percent}% MoM`;
}
