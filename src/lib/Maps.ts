export const LayoutMap = {
    DEFAULT: {
        grid_cols: "grid-cols-[auto_minmax(0,1fr)_auto]",
        nav_active: true,
        aside_active: true,
    },
    HIDE_NAV: {
        grid_cols: "grid-cols-[0px_minmax(0,1fr)_auto]",
        nav_active: false,
        aside_active: true,
    },
    HIDE_ASIDE: {
        grid_cols: "grid-cols-[auto_minmax(0,1fr)_0px]",
        nav_active: true,
        aside_active: false,
    },
    HIDE_BOTH: {
        grid_cols: "grid-cols-[0px_minmax(0,1fr)_0px]",
        nav_active: false,
        aside_active: false,
    },
};

export const PositionMap = {
    Left: { absolutePosition: "left-0", arrowShow: "◀", arrowHide: "▶" },
    Right: { absolutePosition: "right-0", arrowShow: "▶", arrowHide: "◀" },
};
