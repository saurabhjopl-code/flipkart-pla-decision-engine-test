import { STATE } from "./state.js";
import { renderExecutive } from "./app.js";

function parseDate(d) {
    return new Date(d);
}

function matchDateFilters(row) {

    const rowDate = parseDate(row["Date"]);

    if (STATE.filters.startDate) {
        if (rowDate < parseDate(STATE.filters.startDate)) return false;
    }

    if (STATE.filters.endDate) {
        if (rowDate > parseDate(STATE.filters.endDate)) return false;
    }

    if (STATE.filters.month) {
        const monthRow = STATE.raw.dateMaster.find(d => d["Date"] === row["Date"]);
        if (!monthRow || monthRow["Year-Month (2026-02)"] !== STATE.filters.month) return false;
    }

    if (STATE.filters.week) {
        const weekRow = STATE.raw.dateMaster.find(d => d["Date"] === row["Date"]);
        if (!weekRow || weekRow["Week Number"] !== STATE.filters.week) return false;
    }

    return true;
}

function applyAllFilters(dataset) {

    return dataset.filter(row => {

        if (STATE.filters.account && row["ACC"] !== STATE.filters.account) return false;

        if (!matchDateFilters(row)) return false;

        return true;
    });
}

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

export function initFilters() {

    const accountSelect = document.getElementById("accountFilter");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const monthSelect = document.getElementById("monthFilter");
    const weekSelect = document.getElementById("weekFilter");
    const resetBtn = document.getElementById("resetFilters");

    // ACCOUNTS
    const accounts = [...new Set(STATE.raw.gmvDaily.map(r => r["ACC"]))];
    accountSelect.innerHTML = `<option value="">All Accounts</option>`;
    accounts.forEach(acc => {
        accountSelect.innerHTML += `<option value="${acc}">${acc}</option>`;
    });

    // MONTHS
    const months = [...new Set(STATE.raw.dateMaster.map(r => r["Year-Month (2026-02)"]))];
    monthSelect.innerHTML = `<option value="">All Months</option>`;
    months.forEach(m => {
        monthSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });

    // WEEKS
    const weeks = [...new Set(STATE.raw.dateMaster.map(r => r["Week Number"]))];
    weekSelect.innerHTML = `<option value="">All Weeks</option>`;
    weeks.forEach(w => {
        weekSelect.innerHTML += `<option value="${w}">${w}</option>`;
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

    weekSelect.addEventListener("change", e => {
        STATE.filters.week = e.target.value || null;
        applyFilters();
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
