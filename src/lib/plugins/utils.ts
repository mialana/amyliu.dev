import type { Element } from "hast";

export const addClassToHast = (node: Element, newClassName: string): Element => {
    if (node.properties) {
        // Ensure properties.className is an array, then push
        if (Array.isArray(node.properties.className)) {
            node.properties.className.push(newClassName);
        } else if (typeof node.properties.className === "string") {
            // If it's a string, convert to array first
            node.properties.className = node.properties.className.split(" ").filter(Boolean);
            node.properties.className.push(newClassName);
        } else {
            node.properties.className = [newClassName];
        }
    }
    return node;
};
