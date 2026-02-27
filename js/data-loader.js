import { STATE } from "./state.js";

async function fetchCSV(url) {
    const res = await fetch(url);
    const text = await res.text();

    const rows = text.trim().split("\n").map(r => r.split(","));
    const headers = rows.shift();

    return rows.map(r => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = r[i];
        });
        return obj;
    });
}

export async function loadAllData() {

    STATE.raw.gmvDaily = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=126143366&single=true&output=csv");

    STATE.raw.ctrDaily = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=1082219598&single=true&output=csv");

    STATE.raw.adsDaily = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=1300284124&single=true&output=csv");

    STATE.raw.campaign = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=2101825819&single=true&output=csv");

    STATE.raw.keyword = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=1571425410&single=true&output=csv");

    STATE.raw.dateMaster = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=2129061992&single=true&output=csv");

    // Default copy into working data
    STATE.data = {
        ...STATE.raw
    };
}
