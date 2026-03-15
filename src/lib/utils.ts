export function capitalize(word: string): string {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function kebabCaseToHumanReadable(s: string) {
    return s
        .replace(/-/g, " ")
        .replace(/^./, (match) => match.toUpperCase())
        .trim();
}

export function camelCaseToHumanReadable(s: string) {
    return s
        .replace(/[A-Z]/g, " $&")
        .replace(/^./, (match) => match.toUpperCase())
        .trim();
}

export function stringToBoolean(s: string | null | undefined) {
    if (typeof s !== "string") return !!s;
    s = s.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes";
}

export function bifilter<T>(f: (x: T, idx: number, arr: T[]) => boolean, xs: T[]): [T[], T[]] {
    return xs.reduce<[T[], T[]]>(
        ([Tarr, Farr], x, i, arr) => {
            if (f(x, i, arr)) Tarr.push(x);
            else Farr.push(x);
            return [Tarr, Farr];
        },
        [[], []],
    );
}

export function getMobileMediaQuery(): MediaQueryList {
    return window.matchMedia(
        `(max-width: ${getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-desktop").trim()})`,
    );
}

type Ctor<T> = abstract new (...args: any) => T;

export function getRequiredElement<T extends HTMLElement = HTMLElement>(
    selector: string,
    ctor: Ctor<T> = HTMLElement as unknown as Ctor<T>,
): T {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Required element not found in DOM: ${selector}`);
    if (!(el instanceof ctor)) throw new Error(`Element not of required type: ${{ selector, ctor, el }}`);
    return el;
}

export function getRequiredElements<T extends HTMLElement = HTMLElement>(
    selector: string,
    ctor: Ctor<T> = HTMLElement as unknown as Ctor<T>,
): NodeListOf<T> {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) throw new Error(`Required elements not found in DOM: ${selector}`);
    elements.forEach((el) => {
        if (!(el instanceof ctor)) throw new Error(`Element not of required type: ${{ selector, ctor, el }}`);
    });
    return elements as NodeListOf<T>;
}

export function getAriaControlsElements<T extends Element = Element>(
    controller: HTMLElement,
    ctor: Ctor<T> = Element as unknown as Ctor<T>,
): T[] {
    const controlled = controller.ariaControlsElements;
    if (!controlled || !controlled.length)
        throw new Error(`Required controlled elements not found in DOM: ${controller.getAttribute("aria-controls")}`);
    controlled.forEach((el) => {
        if (!(el instanceof ctor))
            throw new Error(`Controlled element not of required type: ${{ controller, ctor, el }}`);
    });
    return controlled as T[];
}
