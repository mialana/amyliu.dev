import * as Panzoom from "@panzoom/panzoom";

const PROJECT_CONTENT_ID = "project-content";

const SVG_CLASS_NAME = "rehyped-inline-svg";
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

function attachPanzoomToSvg(svg: SVGSVGElement, wrapper: HTMLDivElement) {
    const panzoom = Panzoom.default(svg, PANZOOM_OPTIONS);

    // timeout for cursor change logic: https://stackoverflow.com/a/77122346
    let wheelEventEndTimeout: NodeJS.Timeout | null = null;
    wrapper.addEventListener("wheel", function (event) {
        panzoom.zoomWithWheel(event);
        wrapper.style.cursor = PANZOOM_ZOOM_CURSOR;

        if (wheelEventEndTimeout) clearTimeout(wheelEventEndTimeout);
        wheelEventEndTimeout = setTimeout(() => {
            wrapper.style.cursor = PANZOOM_PAN_CURSOR;
        }, 500);
    });
}

export default function () {
    const projectContent = document.getElementById(PROJECT_CONTENT_ID);
    if (!projectContent) return;

    // ensure background loading gifs are removed after load
    projectContent.querySelectorAll("img").forEach((img) => {
        img.addEventListener("load", () => {
            img.classList.add("bg-none", "bg-transparent");
        });
    });

    // convert all SVG img elements to inline SVG and add panzoom
    const wrappers = projectContent.querySelectorAll<HTMLDivElement>(`.${SVG_WRAPPER_CLASS_NAME}`);

    wrappers.forEach((wrapper) => {
        const svg = wrapper.querySelector<SVGSVGElement>(`.${SVG_CLASS_NAME}`);

        if (!svg) return;

        attachPanzoomToSvg(svg, wrapper);
    });
}
