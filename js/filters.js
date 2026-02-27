import { STATE } from "./state.js";

/* ===============================
   DATE NORMALIZER
=================================*/

function normalizeDate(dateStr) {
    if (!dateStr) return null;

    dateStr = String(dateStr).split("T")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
        return new Date(dateStr);

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [dd, mm, yyyy] = dateStr.split("-");
        return new Date(yyyy, mm - 1, dd);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [dd, mm, yyyy] = dateStr.split("/");
        return new Date(yyyy, mm - 1, dd);
    }

    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
}

function getYearMonth(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
}

function matchDateFilters(row) {

    const rowDate = normalizeDate(row["Date"]);
    if (!rowDate) return false;

    if (STATE.filters.month) {
        if (getYearMonth(rowDate) !== STATE.filters.month)
            return false;
    }

    if (STATE.filters.startDate) {
        if (rowDate < new Date(STATE.filters.startDate))
            return false;
    }

    if (STATE.filters.endDate) {
        if (rowDate > new Date(STATE.filters.endDate))
            return false;
    }

    return true;
}

function applyDatasetFilter(dataset) {
    return dataset.filter(row => {

        if (STATE.filters.account &&
            row["ACC"] !== STATE.filters.account)
            return false;

        if (!matchDateFilters(row))
            return false;

        return true;
    });
}

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

    // 🔥 IMPORTANT FIX
    if (window.renderCurrentPage) {
        window.renderCurrentPage();
    }
}

export function initFilters() {

    const accountSelect = document.getElementById("accountFilter");
    const monthSelect = document.getElementById("monthFilter");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const resetBtn = document.getElementById("resetFilters");

    const accounts = [...new Set(STATE.raw.gmvDaily.map(r => r["ACC"]))];

    accountSelect.innerHTML = `<option value="">All Accounts</option>`;
    accounts.forEach(acc => {
        accountSelect.innerHTML += `<option value="${acc}">${acc}</option>`;
    });

    const months = [...new Set(
        STATE.raw.dateMaster.map(r => r["Year-Month (2026-02)"])
    )];

    monthSelect.innerHTML = `<option value="">All Months</option>`;
    months.forEach(m => {
        monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });

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

        STATE.filters = {
            account: null,
            month: null,
            startDate: null,
            endDate: null
        };

        accountSelect.value = "";
        monthSelect.value = "";
        startInput.value = "";
        endInput.value = "";

        applyFilters();
    });
}
