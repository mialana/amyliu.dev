// NavButton.ts

export default function toggleButton() {
    const btn = document.getElementById("nav-toggle");
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector("main")!;

    btn?.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));

        sidebar?.classList.toggle("-translate-x-full");
        sidebar?.classList.toggle("translate-x-0");
        main.classList.toggle("ml-[312px]");
        main.classList.toggle("ml-0");
    });
}
