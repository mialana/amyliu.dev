import Choices from "choices.js";

export default function () {
    document.addEventListener("DOMContentLoaded", () => {
        const el = document.getElementById("projects-select") as HTMLSelectElement;

        const choices = new Choices(el, { searchEnabled: false });

        console.log(choices);

        el.addEventListener("addItem", (event: any) => {
            console.log("called");
            const addedValue: string = event.detail.value;

            // Extract group identifier (e.g. "type", "category")
            const addedGroup = addedValue.split(":")[0];

            // Get current selected items
            const selected = choices.getValue() as { value: string }[];

            // Find other items from the same group
            const toRemove = selected.filter(
                (item) => item.value !== addedValue && item.value.startsWith(`${addedGroup}:`),
            );

            // Remove them
            toRemove.forEach((item) => {
                choices.removeActiveItemsByValue(item.value);
            });
        });
    });
}
