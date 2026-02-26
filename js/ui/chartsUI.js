// js/ui/chartsUI.js

const chartInstances = {};

export function renderChart(chartData) {
  if (!chartData || !chartData.id) return;

  const containerId = `chart-${chartData.id}`;
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(`Chart container not found: ${containerId}`);
    return;
  }

  // Destroy previous instance if exists
  if (chartInstances[chartData.id]) {
    chartInstances[chartData.id].destroy();
    delete chartInstances[chartData.id];
  }

  const options = buildChartOptions(chartData);

  const chart = new ApexCharts(container, options);
  chart.render();

  chartInstances[chartData.id] = chart;
}

/* ======================================
   BUILD CHART OPTIONS
====================================== */

function buildChartOptions(chartData) {
  const themeColors = getThemeColors();

  switch (chartData.type) {
    case "line":
      return buildLineChart(chartData, themeColors);

    case "bar":
      return buildBarChart(chartData, themeColors);

    case "bar-horizontal":
      return buildHorizontalBarChart(chartData, themeColors);

    default:
      return {};
  }
}

/* ======================================
   LINE CHART
====================================== */

function buildLineChart(data, colors) {
  return {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: [colors.primary],
    series: [
      {
        name: data.title,
        data: data.series
      }
    ],
    xaxis: {
      categories: data.labels
    },
    tooltip: {
      y: {
        formatter: formatCurrency
      }
    },
    dataLabels: { enabled: false }
  };
}

/* ======================================
   BAR CHART
====================================== */

function buildBarChart(data, colors) {
  return {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false }
    },
    colors: [colors.success, colors.warning],
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4
      }
    },
    series: [
      {
        name: data.title,
        data: data.series
      }
    ],
    xaxis: {
      categories: data.labels
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}%`
      }
    },
    dataLabels: { enabled: false }
  };
}

/* ======================================
   HORIZONTAL BAR (FUNNEL STYLE)
====================================== */

function buildHorizontalBarChart(data, colors) {
  return {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    colors: [colors.primary],
    series: [
      {
        name: data.title,
        data: data.series
      }
    ],
    xaxis: {
      categories: data.labels,
      labels: {
        formatter: formatLargeNumber
      }
    },
    tooltip: {
      y: {
        formatter: formatCurrency
      }
    },
    dataLabels: { enabled: false }
  };
}

/* ======================================
   UTILITIES
====================================== */

function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);

  return {
    primary: styles.getPropertyValue("--chart-primary").trim(),
    success: styles.getPropertyValue("--chart-success").trim(),
    warning: styles.getPropertyValue("--chart-warning").trim(),
    danger: styles.getPropertyValue("--chart-danger").trim()
  };
}

function formatCurrency(value) {
  if (!value && value !== 0) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatLargeNumber(value) {
  if (!value && value !== 0) return "0";

  return new Intl.NumberFormat("en-IN").format(value);
}
