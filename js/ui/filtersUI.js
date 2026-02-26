// js/ui/filterUI.js

export function populateFilters(data, setFilterCallback) {
  populateDropdown("month-filter", uniqueValues(data, "month"), "months", setFilterCallback);
  populateDropdown("category-filter", uniqueValues(data, "category"), "category", setFilterCallback);
  populateDropdown("brand-filter", uniqueValues(data, "brand"), "brand", setFilterCallback);
  populateDropdown("vertical-filter", uniqueValues(data, "vertical"), "vertical", setFilterCallback);
  populateDropdown("style-filter", uniqueValues(data, "style_id"), "style", setFilterCallback);
}

function populateDropdown(id, values, filterKey, callback) {
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML = "";

  values.forEach(v => {
    const option = document.createElement("option");
    option.value = v;
    option.innerText = v;
    select.appendChild(option);
  });

  select.addEventListener("change", e => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    callback(filterKey, selected);
  });
}

function uniqueValues(data, key) {
  const set = new Set();
  data.forEach(d => {
    if (d[key]) set.add(d[key]);
  });
  return Array.from(set).sort();
}
