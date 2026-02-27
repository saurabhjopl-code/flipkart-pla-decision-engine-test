export function showLoader() {
    const bar = document.getElementById("progressBar");
    bar.classList.remove("complete");
    bar.classList.add("active");
}

export function hideLoader() {
    const bar = document.getElementById("progressBar");
    bar.classList.remove("active");
    bar.classList.add("complete");

    setTimeout(() => {
        bar.style.width = "0%";
        bar.classList.remove("complete");
    }, 400);
}
