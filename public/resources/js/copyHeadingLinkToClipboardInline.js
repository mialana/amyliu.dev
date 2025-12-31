/* Inline script that copies heading anchor links to clipboard on click */
(() => {
    function copyLink(anchor) {
        const url = new URL(anchor.getAttribute("href"), window.location.href).toString();
        navigator.clipboard?.writeText(url);
    }

    document.addEventListener("click", (e) => {
        const anchor = e.target.closest(".heading-anchor");
        if (!anchor) return;

        copyLink(anchor);
    });
})();
