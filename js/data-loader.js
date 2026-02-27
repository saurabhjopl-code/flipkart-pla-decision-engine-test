import { STATE } from "./state.js";

async function fetchCSV(url) {
    const res = await fetch(url);
    const text = await res.text();

    const rows = text.trim().split("\n").map(r => r.split(","));
    const headers = rows.shift();

    return rows.map(r => {
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = r[i]);
        return obj;
    });
}

export async function loadAllData() {

    STATE.raw.gmvDaily = await fetchCSV("GMV_URL");
    STATE.raw.ctrDaily = await fetchCSV("CTR_URL");
    STATE.raw.adsDaily = await fetchCSV("ADS_URL");
    STATE.raw.campaign = await fetchCSV("CAMPAIGN_URL");
    STATE.raw.keyword = await fetchCSV("KEYWORD_URL");

    STATE.data = { ...STATE.raw };
}
