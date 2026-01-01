export function handleScrollToAnchorTarget(
    anchor: HTMLAnchorElement,
    container: HTMLElement,
    offset = 0,
    behavior: ScrollBehavior = "smooth",
) {
    /* get the hash from the anchor's href */
    const hash = anchor.getAttribute("href");
    if (!hash) return;

    // update URL without triggering native scroll
    history.pushState(null, "", hash);

    const target = document.querySelector(hash);
    if (!target) return;
    if (!(target instanceof HTMLElement)) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    /**
     * `containerRect.top` is absolute Y position, so adding container.scrollTop gets us the correct
     * Y position within the container */
    const top = targetRect.top - containerRect.top + container.scrollTop - offset;

    container.scrollTo({ top, behavior });
}
