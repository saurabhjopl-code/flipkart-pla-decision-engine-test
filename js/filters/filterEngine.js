// js/filters/filterEngine.js

export function applyAllFilters(data, filters) {
  if (!Array.isArray(data)) return [];

  let result = [...data];

  /* ===========================
     SEARCH
  =========================== */
  if (filters.search && filters.search.trim() !== "") {
    const term = filters.search.toLowerCase();
    result = result.filter(row =>
      String(row.mpsku || "").toLowerCase().includes(term) ||
      String(row.style_id || "").toLowerCase().includes(term)
    );
  }

  /* ===========================
     MONTH FILTER
  =========================== */
  if (filters.months && filters.months.length > 0) {
    result = result.filter(row =>
      filters.months.includes(row.month)
    );
  }

  /* ===========================
     DATE RANGE FILTER
  =========================== */
  if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
    result = result.filter(row => {
      const d = row.date || row.order_date;
      if (!d) return false;

      return d >= filters.dateRange.start && d <= filters.dateRange.end;
    });
  }

  /* ===========================
     CATEGORY
  =========================== */
  if (filters.category && filters.category.length > 0) {
    result = result.filter(row =>
      filters.category.includes(row.category)
    );
  }

  /* ===========================
     BRAND
  =========================== */
  if (filters.brand && filters.brand.length > 0) {
    result = result.filter(row =>
      filters.brand.includes(row.brand)
    );
  }

  /* ===========================
     VERTICAL
  =========================== */
  if (filters.vertical && filters.vertical.length > 0) {
    result = result.filter(row =>
      filters.vertical.includes(row.vertical)
    );
  }

  /* ===========================
     STYLE
  =========================== */
  if (filters.style && filters.style.length > 0) {
    result = result.filter(row =>
      filters.style.includes(row.style_id)
    );
  }

  return result;
}
