import { CONFIG } from "./config.js";
import { STATE } from "./state.js";
import { parseCSV, updateProgress } from "./utils.js";

async function fetchSheet(url) {
    const res = await fetch(url);
    const text = await res.text();
    return parseCSV(text);
}

export async function loadAllData() {

    updateProgress(10);

    STATE.data.gmvDaily = await fetchSheet(CONFIG.SHEETS.GMV_DAILY);
    updateProgress(25);

    STATE.data.ctrDaily = await fetchSheet(CONFIG.SHEETS.CTR_DAILY);
    updateProgress(40);

    STATE.data.adsDaily = await fetchSheet(CONFIG.SHEETS.ADS_DAILY);
    updateProgress(55);

    STATE.data.campaign = await fetchSheet(CONFIG.SHEETS.CAMPAIGN);
    updateProgress(70);

    STATE.data.keyword = await fetchSheet(CONFIG.SHEETS.KEYWORD);
    updateProgress(85);

    STATE.data.dateMaster = await fetchSheet(CONFIG.SHEETS.DATE_MASTER);
    updateProgress(100);

    STATE.isLoaded = true;
}
