// js/engine/chartEngine.js

export function generateExecutiveCharts(filteredData = [], datasetMode = "monthly", thresholds = {}) {
  const {
    lowDOI = 15,
    highDOI = 90
  } = thresholds;

  const revenueTrend = generateRevenueTrend(filteredData, datasetMode);
  const conversionFunnel = generateConversionFunnel(filteredData);
  const qualityMetrics = generateQualityMetrics(filteredData);
  const inventoryHealth = generateInventoryDistribution(filteredData, lowDOI, highDOI);

  return [
    revenueTrend,
    conversionFunnel,
    qualityMetrics,
    inventoryHealth
  ];
}

/* ===========================
   REVENUE TREND
=========================== */

function generateRevenueTrend(data, datasetMode) {
  const groupMap = {};

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const key = datasetMode === "monthly"
      ? row.month
      : row.date;

    if (!key) continue;

    const revenue = Number(row.final_sale_amount) || 0;

    if (!groupMap[key]) {
      groupMap[key] = 0;
    }

    groupMap[key] += revenue;
  }

  const sortedKeys = Object.keys(groupMap).sort();

  const labels = [];
  const series = [];

  for (let i = 0; i < sortedKeys.length; i++) {
    const k = sortedKeys[i];
    labels.push(k);
    series.push(groupMap[k]);
  }

  return {
    id: "revenueTrend",
    type: "line",
    title: "Revenue Trend",
    labels,
    series
  };
}

/* ===========================
   CONVERSION FUNNEL
=========================== */

function generateConversionFunnel(data) {
  let totalViews = 0;
  let totalClicks = 0;
  let totalFinalUnits = 0;
  let totalRevenue = 0;

  for (let i = 0; i < data.length; i++) {
    totalViews += Number(data[i].views) || 0;
    totalClicks += Number(data[i].clicks) || 0;
    totalFinalUnits += Number(data[i].final_sale_units) || 0;
    totalRevenue += Number(data[i].final_sale_amount) || 0;
  }

  return {
    id: "conversionFunnel",
    type: "bar-horizontal",
    title: "Conversion Funnel",
    labels: ["Views", "Clicks", "Final Units", "Revenue"],
    series: [totalViews, totalClicks, totalFinalUnits, totalRevenue]
  };
}

/* ===========================
   RETURN VS CANCEL
=========================== */

function generateQualityMetrics(data) {
  let totalGrossUnits = 0;
  let totalReturnUnits = 0;
  let totalCancelUnits = 0;

  for (let i = 0; i < data.length; i++) {
    totalGrossUnits += Number(data[i].gross_units) || 0;
    totalReturnUnits += Number(data[i].return_units) || 0;
    totalCancelUnits += Number(data[i].cancellation_units) || 0;
  }

  const returnRate = safeDivide(totalReturnUnits, totalGrossUnits) * 100;
  const cancelRate = safeDivide(totalCancelUnits, totalGrossUnits) * 100;

  return {
    id: "qualityMetrics",
    type: "bar",
    title: "Return vs Cancellation %",
    labels: ["Return %", "Cancel %"],
    series: [returnRate, cancelRate]
  };
}

/* ===========================
   INVENTORY DISTRIBUTION
=========================== */

function generateInventoryDistribution(data, lowDOI, highDOI) {
  let low = 0;
  let healthy = 0;
  let overstock = 0;

  const processedSkus = new Set();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const sku = row.mpsku;

    if (!sku || processedSkus.has(sku)) continue;

    processedSkus.add(sku);

    const stock = Number(row.total_stock) || 0;
    const velocity = Number(row.daily_velocity) || 0;
    const doi = safeDivide(stock, velocity);

    if (doi < lowDOI) {
      low++;
    } else if (doi > highDOI) {
      overstock++;
    } else {
      healthy++;
    }
  }

  return {
    id: "inventoryHealth",
    type: "bar",
    title: "Inventory Health Distribution",
    labels: ["Low DOI", "Healthy", "Overstock"],
    series: [low, healthy, overstock]
  };
}

/* ===========================
   SAFE DIVIDE
=========================== */

function safeDivide(numerator, denominator) {
  if (!denominator || denominator === 0) return 0;
  return numerator / denominator;
}
