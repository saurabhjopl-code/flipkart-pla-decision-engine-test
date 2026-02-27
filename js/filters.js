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
        const parts = dateStr.split("-");
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }

    const d = new Date(dateStr);
    if (!isNaN(d)) return d;

    return null;
}

/* ===============================
   DATE MATCHING
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

        const match = STATE.raw.dateMaster.find(d => {
            const masterDate = normalizeDate(d["Date"]);
            return masterDate && masterDate.getTime() === rowDate.getTime();
        });

        if (!match) return false;

        if (match["Year-Month (2026-02)"] !== STATE.filters.month)
            return false;
    }

    return true;
}

/* ===============================
   GENERIC FILTER
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
   APPLY ALL FILTERS
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

    /* MONTHS */
    const months = [...new Set(STATE.raw.dateMaster.map(r => r["Year-Month (2026-02)"]))];

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
