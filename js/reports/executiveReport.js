// js/reports/executiveReport.js

import { generateExecutiveSummary } from "../summary/executiveSummary.js";
import { generateExecutiveCharts } from "../engine/chartEngine.js";
import { THRESHOLDS } from "../config/thresholds.js";

export function generateExecutiveReport(filteredData = [], datasetMode = "monthly") {
  try {
    // 1️⃣ Generate Summary
    const summary = generateExecutiveSummary(filteredData, datasetMode);

    // 2️⃣ Generate Charts
    const charts = generateExecutiveCharts(
      filteredData,
      datasetMode,
      THRESHOLDS
    );

    // 3️⃣ Standard Report Contract
    return {
      reportId: "executive",
      summary,
      charts,
      table: null
    };

  } catch (error) {
    console.error("Executive Report Generation Error:", error);

    return {
      reportId: "executive",
      summary: generateExecutiveSummary([], datasetMode),
      charts: [],
      table: null
    };
  }
}
