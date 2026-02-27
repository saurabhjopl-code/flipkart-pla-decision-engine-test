// Utility Helpers

export function parseCSV(text) {
    const rows = text.trim().split("\n");
    const headers = rows[0].split(",");
    return rows.slice(1).map(row => {
        const values = row.split(",");
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = values[i] ? values[i].trim() : "";
        });
        return obj;
    });
}

export function updateProgress(percent) {
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = percent + "%";
}

export function sum(data, field) {
    return data.reduce((acc, row) => acc + (parseFloat(row[field]) || 0), 0);
}
