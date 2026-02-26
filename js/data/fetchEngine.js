// js/data/fetchEngine.js

export async function fetchCSV(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const text = await response.text();
    return parseCSV(text);

  } catch (error) {
    console.error("CSV Fetch Error:", error);
    return [];
  }
}

/* ======================================
   SIMPLE CSV PARSER
====================================== */

function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",").map(h => h.trim());

  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",");
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = normalizeValue(values[index]);
    });

    data.push(obj);
  }

  return data;
}

/* ======================================
   NORMALIZATION
====================================== */

function normalizeValue(value) {
  if (!value) return "";

  const trimmed = value.trim();

  if (!isNaN(trimmed) && trimmed !== "") {
    return Number(trimmed);
  }

  return trimmed;
}
