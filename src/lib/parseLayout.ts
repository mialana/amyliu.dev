import { LayoutMap } from "@/layouts/MainLayout.astro";

type ValueOf<T> = T[keyof T];

export default function (input: ValueOf<typeof LayoutMap>) {
    const content = input.match(/\[(.*)\]/)?.[1];
    const arr = content!.split("_");

    const navActive = arr[0] != "0px";
    const asideActive = arr[2] != "0px";

    return { navActive, asideActive };
}
