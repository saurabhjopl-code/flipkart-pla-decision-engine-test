import { STATE } from "./state.js";
import { renderExecutive } from "./app.js";

function parseDate(d) {
    return new Date(d);
}

function applyDateFilter(dataset) {
    if (!STATE.filters.startDate && !STATE.filters.endDate) return dataset;

    return dataset.filter(row => {
        const rowDate = parseDate(row["Date"]);
        if (STATE.filters.startDate && rowDate < parseDate(STATE.filters.startDate)) return false;
        if (STATE.filters.endDate && rowDate > parseDate(STATE.filters.endDate)) return false;
        return true;
    });
}

function applyAccountFilter(dataset) {
    if (!STATE.filters.account) return dataset;
    return dataset.filter(row => row["ACC"] === STATE.filters.account);
}

export function applyFilters() {

    STATE.data.gmvDaily = applyDateFilter(
        applyAccountFilter(STATE.raw.gmvDaily)
    );

    STATE.data.ctrDaily = applyDateFilter(
        applyAccountFilter(STATE.raw.ctrDaily)
    );

    STATE.data.adsDaily = applyDateFilter(
        applyAccountFilter(STATE.raw.adsDaily)
    );

    STATE.data.campaign = applyAccountFilter(STATE.raw.campaign);
    STATE.data.keyword = applyAccountFilter(STATE.raw.keyword);

    renderExecutive();
}

export function initFilters() {

    const accountSelect = document.getElementById("accountFilter");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");

    // Populate account dropdown
    const accounts = [...new Set(STATE.raw.gmvDaily.map(r => r["ACC"]))];

    accountSelect.innerHTML = `<option value="">All Accounts</option>`;
    accounts.forEach(acc => {
        accountSelect.innerHTML += `<option value="${acc}">${acc}</option>`;
    });

    accountSelect.addEventListener("change", (e) => {
        STATE.filters.account = e.target.value || null;
        applyFilters();
    });

    startInput.addEventListener("change", (e) => {
        STATE.filters.startDate = e.target.value || null;
        applyFilters();
    });

    endInput.addEventListener("change", (e) => {
        STATE.filters.endDate = e.target.value || null;
        applyFilters();
    });
}
