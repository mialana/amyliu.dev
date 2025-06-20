## Hotkeys

Cmd + e = Enlarge parameter input box
U = Jump up network

## Helpful UI

Visualization: Visualize attributes on points, prims, etc.
![](houdini-visualization-ui.png)

Textport Window: Use `exhelp` to get full documentation for VEX method
![](houdini-textport-ui.png)

## VEX methods

- Establish new attribute of type "TYPE" and name "NAME" with `TYPE@NAME`

```vex
// example
v@side = cross(v@N, {0, 1, 0});
```

- `detail()` gets value of attribute from input

```vex
// example
float randVal = (rand(detail(1, "iteration", 0) * 585.35) - 0.5) * ch("multi");
```

- `setpointgroup()` to put points in a new group

```vex
// example
setpointgroup(0, "noiseMask", @ptnum, 1, "set");
```

## Nodes of Interest:

UV Flatten: v.s. UV Unwrap it is better for irregular geometry
![](houdini-uv-flatten.png)

## Links:

[SOP, POP, DOP](https://www.reddit.com/r/Houdini/comments/t4agvh/sop_pop_dop_for_begginers/)
