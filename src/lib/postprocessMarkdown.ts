import * as Panzoom from "@panzoom/panzoom";

const SVG_SELECTOR = "img[src$='svg']"; // naive search: any <img> with 'svg' in their src attribute
const SVG_CLASS_NAME = "rehyped-inline-svg";
const SVG_INNER_CLASS_NAME = "rehyped-inline-svg-child";
const SVG_WRAPPER_CLASS_NAME = "rehyped-inline-svg-wrapper";

// const PANZOOM_PAN_CURSOR = "grabbing"
const PANZOOM_PAN_CURSOR = "url('/resources/png/drag.png'), auto";
const PANZOOM_ZOOM_IN_CURSOR = "zoom-in";
const PANZOOM_ZOOM_OUT_CURSOR = "zoom-out";
const PANZOOM_ZOOM_CURSOR = "url('/resources/png/magnifying_glass.png'), auto";
const PANZOOM_OPTIONS: Panzoom.PanzoomGlobalOptions = {
    canvas: true,
    minScale: 0.75,
    step: 0.2,
    cursor: PANZOOM_PAN_CURSOR,
};

/* Wait for element to be successfully added to DOM */
function waitForElement(targetEle: Element, callback: (waitedForEle: Element, context: Element) => void) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            // Check if nodes were added
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    // Check if the added node matches the selector
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const ele = node as Element;
                        const wrapper = ele.closest(`.${SVG_WRAPPER_CLASS_NAME}`);
                        if ((ele === targetEle || ele.contains(targetEle)) && wrapper) {
                            // Element found, call the callback function
                            callback(targetEle, wrapper);
                            // Stop observing once the element is found to prevent performance issues
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function attachPanzoomToSvgCallback(waitedForEle: Element, context: Element) {
    if (!(waitedForEle instanceof SVGSVGElement)) {
        console.log(`Expected inline SVG, got: ${waitedForEle}. Aborting...`);
        return;
    }
    if (!context.matches(`.${SVG_WRAPPER_CLASS_NAME}`)) {
        console.log(`Expected element with classname ${SVG_WRAPPER_CLASS_NAME}, got: ${context}. Aborting...`);
        return;
    }

    const renderedSvg = waitedForEle as SVGSVGElement;
    const renderedWrapper = context as HTMLDivElement;
    const panzoom = Panzoom.default(renderedSvg, PANZOOM_OPTIONS);

    // timeout logic: https://stackoverflow.com/a/77122346
    let wheelEventEndTimeout: NodeJS.Timeout | null = null;
    renderedWrapper.addEventListener("wheel", function (event) {
        panzoom.zoomWithWheel(event);
        // if (event.deltaY < 0) {
        //     renderedWrapper.style.cursor = PANZOOM_ZOOM_IN_CURSOR;
        // } else if (event.deltaY > 0) {
        //     renderedWrapper.style.cursor = PANZOOM_ZOOM_OUT_CURSOR;
        // }
        renderedWrapper.style.cursor = PANZOOM_ZOOM_CURSOR;

        if (wheelEventEndTimeout) clearTimeout(wheelEventEndTimeout);
        wheelEventEndTimeout = setTimeout(() => {
            renderedWrapper.style.cursor = PANZOOM_PAN_CURSOR;
        }, 500);
    });
}

export default function postprocessMarkdown(el: HTMLDivElement | null) {
    if (el) {
        // set all links that aren't internal header links to open to new tab
        el.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
            if (!link.href.startsWith("#")) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener noreferrer");
            }
        });

        // ensure background loading gifs are removed after load
        el.querySelectorAll("img, svg").forEach((img) => {
            img.addEventListener("load", () => {
                img.classList.add("bg-none", "bg-transparent");
            });
        });

        // convert all SVG img elements to inline SVG and add panzoom
        (async () => {
            const imgs = el.querySelectorAll<HTMLImageElement>(SVG_SELECTOR);

            for (const img of imgs) {
                const src = img.getAttribute("src");
                if (!src) continue;

                try {
                    const res = await fetch(src);
                    if (!res.ok) continue;

                    let svgText = await res.text();

                    const svgStart = svgText.indexOf("<svg");
                    if (svgStart === -1) continue;
                    svgText = svgText.slice(svgStart);

                    const template = document.createElement("template");
                    template.innerHTML = svgText.trim();
                    const svg = template.content.firstElementChild as SVGSVGElement;

                    if (!svg || svg.tagName.toLowerCase() !== "svg") continue;

                    img.classList.forEach((c) => svg.classList.add(c)); // transfer over classes
                    svg.classList.toggle(SVG_CLASS_NAME); // add class name to converted svg
                    svg.querySelectorAll("svg").forEach((innerSvg) => {
                        innerSvg.classList.toggle(SVG_INNER_CLASS_NAME);
                    }); // add inner class name to all children svg of converted svg

                    const wrapper = document.createElement("div");

                    wrapper.classList.add(SVG_WRAPPER_CLASS_NAME, "not-prose");

                    waitForElement(svg, attachPanzoomToSvgCallback);

                    wrapper.appendChild(svg);
                    img.replaceWith(wrapper);
                } catch (e) {
                    console.log("SVG inline failed:", src, e);
                }
            }
        })();
    }
}
