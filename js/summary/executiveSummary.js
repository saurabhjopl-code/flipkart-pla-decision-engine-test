// js/summary/executiveSummary.js

export function generateExecutiveSummary(filteredData = [], datasetMode = "monthly") {
  if (!Array.isArray(filteredData)) {
    return getEmptySummary(datasetMode);
  }

  let totalViews = 0;
  let totalClicks = 0;
  let totalRevenue = 0;
  let totalGrossUnits = 0;
  let totalFinalUnits = 0;
  let totalCancelUnits = 0;
  let totalReturnUnits = 0;
  let totalStock = 0;
  let totalDailyVelocity = 0;

  const uniqueSkus = new Set();
  const monthRevenueMap = {};

  for (let i = 0; i < filteredData.length; i++) {
    const row = filteredData[i];

    const views = Number(row.views) || 0;
    const clicks = Number(row.clicks) || 0;
    const revenue = Number(row.final_sale_amount) || 0;
    const grossUnits = Number(row.gross_units) || 0;
    const finalUnits = Number(row.final_sale_units) || 0;
    const cancelUnits = Number(row.cancellation_units) || 0;
    const returnUnits = Number(row.return_units) || 0;
    const stock = Number(row.total_stock) || 0;
    const dailyVelocity = Number(row.daily_velocity) || 0;

    totalViews += views;
    totalClicks += clicks;
    totalRevenue += revenue;
    totalGrossUnits += grossUnits;
    totalFinalUnits += finalUnits;
    totalCancelUnits += cancelUnits;
    totalReturnUnits += returnUnits;
    totalStock += stock;
    totalDailyVelocity += dailyVelocity;

    if (row.mpsku) {
      uniqueSkus.add(row.mpsku);
    }

    if (datasetMode === "monthly" && row.month) {
      if (!monthRevenueMap[row.month]) {
        monthRevenueMap[row.month] = 0;
      }
      monthRevenueMap[row.month] += revenue;
    }
  }

  const ctr = safeDivide(totalClicks, totalViews);
  const cvr = safeDivide(totalFinalUnits, totalClicks);
  const returnRate = safeDivide(totalReturnUnits, totalGrossUnits);
  const cancelRate = safeDivide(totalCancelUnits, totalGrossUnits);
  const asp = safeDivide(totalRevenue, totalFinalUnits);
  const avgDoi = safeDivide(totalStock, totalDailyVelocity);

  let revenueMoM = null;

  if (datasetMode === "monthly") {
    const sortedMonths = Object.keys(monthRevenueMap).sort();
    if (sortedMonths.length >= 2) {
      const latestMonth = sortedMonths[sortedMonths.length - 1];
      const previousMonth = sortedMonths[sortedMonths.length - 2];

      const currentRevenue = monthRevenueMap[latestMonth];
      const previousRevenue = monthRevenueMap[previousMonth];

      revenueMoM = safeDivide(
        currentRevenue - previousRevenue,
        previousRevenue
      );
    }
  }

  return {
    totals: {
      views: totalViews,
      clicks: totalClicks,
      revenue: totalRevenue,
      finalUnits: totalFinalUnits,
      stock: totalStock
    },

    kpis: {
      ctr,
      cvr,
      returnRate,
      cancelRate,
      asp,
      avgDoi
    },

    growth: {
      revenueMoM
    },

    metadata: {
      totalSkus: uniqueSkus.size,
      datasetMode,
      totalRows: filteredData.length
    }
  };
}

function safeDivide(numerator, denominator) {
  if (!denominator || denominator === 0) return 0;
  return numerator / denominator;
}

function getEmptySummary(datasetMode) {
  return {
    totals: {
      views: 0,
      clicks: 0,
      revenue: 0,
      finalUnits: 0,
      stock: 0
    },
    kpis: {
      ctr: 0,
      cvr: 0,
      returnRate: 0,
      cancelRate: 0,
      asp: 0,
      avgDoi: 0
    },
    growth: {
      revenueMoM: null
    },
    metadata: {
      totalSkus: 0,
      datasetMode,
      totalRows: 0
    }
  };
}
