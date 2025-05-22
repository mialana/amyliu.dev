export function SyncBackgroundWidth() {
    const img = document.getElementById("headshot");
    const bg = document.getElementById("left-bg");
    if (!img || !bg) return;

    const rect = img.getBoundingClientRect();
    // distance from viewport left edge to img centre
    const newWidth = rect.left + rect.width / 2;
    bg.style.width = `${newWidth}px`;
}
