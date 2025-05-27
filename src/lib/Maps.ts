export const LayoutMap = {
    DEFAULT: {
        grid_cols: "grid-cols-[auto_1fr_auto]",
        nav_state: true,
        aside_state: true,
    },
    HIDE_NAV: {
        grid_cols: "grid-cols-[0px_1fr_auto]",
        nav_state: false,
        aside_state: true,
    },
    HIDE_ASIDE: {
        grid_cols: "grid-cols-[auto_1fr_0px]",
        nav_state: true,
        aside_state: false,
    },
    HIDE_BOTH: {
        grid_cols: "grid-cols-[0px_1fr_0px]",
        nav_state: false,
        aside_state: false,
    },
};

export const PositionMap = {
    Left: { button: "left-0", arrowShow: "◀", arrowHide: "▶" },
    Right: { button: "right-0", arrowShow: "▶", arrowHide: "◀" },
};
