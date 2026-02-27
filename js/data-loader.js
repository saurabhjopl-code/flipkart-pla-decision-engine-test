import { STATE } from "./state.js";

const SHEETS = {
    gmvDaily: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=126143366&single=true&output=csv",
    ctrDaily: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=1082219598&single=true&output=csv",
    adsDaily: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=1300284124&single=true&output=csv",
    campaign: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=2101825819&single=true&output=csv",
    keyword: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=1571425410&single=true&output=csv",
    placement: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd_uFyNN_LsA0hZ4EuRYflMnzY-NwSAn9sRhvPbbeRrRkAe5d07tIEJ_gilGwvR5-H1l3jjTOdjq6j/pub?gid=83055390&single=true&output=csv"
};

function parseCSV(text) {
    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows.shift();
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = row[i]);
        return obj;
    });
}

export async function loadAllData() {

    const entries = Object.entries(SHEETS);

    for (let [key, url] of entries) {
        const res = await fetch(url);
        const text = await res.text();
        STATE.rawData[key] = parseCSV(text);
    }
}
