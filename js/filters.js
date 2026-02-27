import { STATE } from "./state.js";
import { renderExecutive } from "./app.js";

/* ===============================
   DATE NORMALIZER
=================================*/

function normalizeDate(dateStr) {
    if (!dateStr) return null;

    // If already yyyy-mm-dd
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
        return new Date(dateStr);
    }

    // Convert dd-mm-yyyy to yyyy-mm-dd
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }

    return new Date(dateStr);
}

/* ===============================
   FILTER LOGIC
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
            return normalizeDate(d["Date"]).getTime() === rowDate.getTime();
        });

        if (!match || match["Year-Month (2026-02)"] !== STATE.filters.month)
            return false;
    }

      return true;
}

function applyAllFilters(dataset) {

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

    STATE.data.gmvDaily = applyAllFilters(STATE.raw.gmvDaily);
    STATE.data.ctrDaily = applyAllFilters(STATE.raw.ctrDaily);
    STATE.data.adsDaily = applyAllFilters(STATE.raw.adsDaily);

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
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const monthSelect = document.getElementById("monthFilter");
    const weekSelect = document.getElementById("weekFilter");
    const resetBtn = document.getElementById("resetFilters");

    // Accounts
    const accounts = [...new Set(STATE.raw.gmvDaily.map(r => r["ACC"]))];
    accountSelect.innerHTML = `<option value="">All Accounts</option>`;
    accounts.forEach(acc => {
        accountSelect.innerHTML += `<option value="${acc}">${acc}</option>`;
    });

    // Months
    const months = [...new Set(STATE.raw.dateMaster.map(r => r["Year-Month (2026-02)"]))];
    monthSelect.innerHTML = `<option value="">All Months</option>`;
    months.forEach(m => {
        monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });

    accountSelect.addEventListener("change", e => {
        STATE.filters.account = e.target.value || null;
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

    monthSelect.addEventListener("change", e => {
        STATE.filters.month = e.target.value || null;
        applyFilters();
    });

   });

    resetBtn.addEventListener("click", () => {

        STATE.filters = {
            account: null,
            startDate: null,
            endDate: null,
            month: null,
            week: null
        };

        accountSelect.value = "";
        startInput.value = "";
        endInput.value = "";
        monthSelect.value = "";
        weekSelect.value = "";

        applyFilters();
    });
}
