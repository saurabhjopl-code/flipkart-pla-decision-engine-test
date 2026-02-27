import { STATE } from "./state.js";
import { renderExecutive } from "./app.js";

/* ===============================
   DATE NORMALIZER
=================================*/

function normalizeDate(dateStr) {
    if (!dateStr) return null;

    if (dateStr instanceof Date) return dateStr;

    dateStr = String(dateStr).split("T")[0];

    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr);
    }

    // dd-mm-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [dd, mm, yyyy] = dateStr.split("-");
        return new Date(`${yyyy}-${mm}-${dd}`);
    }

    // mm/dd/yyyy
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        return new Date(dateStr);
    }

    const d = new Date(dateStr);
    if (!isNaN(d)) return d;

    return null;
}

/* ===============================
   EXTRACT YYYY-MM FROM DATE
=================================*/

function getYearMonth(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
}

/* ===============================
   DATE FILTER LOGIC
=================================*/

function matchDateFilters(row) {

    const rowDate = normalizeDate(row["Date"]);
    if (!rowDate) return false;

    if (STATE.filters.startDate) {
        const start = new Date(STATE.filters.startDate);
        if (rowDate < start) return false;
    }

    if (STATE.filters.endDate) {
        const end = new Date(STATE.filters.endDate);
        if (rowDate > end) return false;
    }

    if (STATE.filters.month) {
        const rowYM = getYearMonth(rowDate);
        if (rowYM !== STATE.filters.month)
            return false;
    }

    return true;
}

/* ===============================
   GENERIC DATA FILTER
=================================*/

function applyDatasetFilter(dataset) {

    return dataset.filter(row => {

        if (STATE.filters.account && row["ACC"] !== STATE.filters.account)
            return false;

        if (!matchDateFilters(row))
            return false;

        return true;
    });
}

/* ===============================
   APPLY FILTERS
=================================*/

export function applyFilters() {

    STATE.data.gmvDaily = applyDatasetFilter(STATE.raw.gmvDaily);
    STATE.data.ctrDaily = applyDatasetFilter(STATE.raw.ctrDaily);
    STATE.data.adsDaily = applyDatasetFilter(STATE.raw.adsDaily);

    STATE.data.campaign = STATE.raw.campaign.filter(r =>
        !STATE.filters.account || r["ACC"] === STATE.filters.account
    );

    STATE.data.keyword = STATE.raw.keyword.filter(r =>
        !STATE.filters.account || r["ACC"] === STATE.filters.account
    );

    renderExecutive();
}

/* ===============================
   INIT FILTERS
=================================*/

export function initFilters() {

    const accountSelect = document.getElementById("accountFilter");
    const monthSelect = document.getElementById("monthFilter");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const resetBtn = document.getElementById("resetFilters");

    /* ACCOUNTS */
    const accounts = [...new Set(STATE.raw.gmvDaily.map(r => r["ACC"]))];

    accountSelect.innerHTML = `<option value="">All Accounts</option>`;
    accounts.forEach(acc => {
        accountSelect.innerHTML += `<option value="${acc}">${acc}</option>`;
    });

    /* MONTHS (From Date_Master only to populate dropdown) */
    const months = [...new Set(
        STATE.raw.dateMaster.map(r => r["Year-Month (2026-02)"])
    )];

    monthSelect.innerHTML = `<option value="">All Months</option>`;
    months.forEach(m => {
        monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });

    /* EVENTS */

    accountSelect.addEventListener("change", e => {
        STATE.filters.account = e.target.value || null;
        applyFilters();
    });

    monthSelect.addEventListener("change", e => {
        STATE.filters.month = e.target.value || null;
        applyFilters();
    });

    startInput.addEventListener("change", e => {
        STATE.filters.startDate = e.target.value || null;
        applyFilters();
    });

    endInput.addEventListener("change", e => {
        STATE.filters.endDate = e.target.value || null;
        applyFilters();
    });

    resetBtn.addEventListener("click", () => {

        STATE.filters.account = null;
        STATE.filters.month = null;
        STATE.filters.startDate = null;
        STATE.filters.endDate = null;

        accountSelect.value = "";
        monthSelect.value = "";
        startInput.value = "";
        endInput.value = "";

        applyFilters();
    });
}
