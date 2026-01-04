# Rehype Svg

This plugin converts `img` elements that are created from an SVG file to an inline SVG.

This is for the purposes of allowing high-quality SVGs, which I also apply `panzoom` to in the DOM.

The main pipeline here was that I am now using [D2](https://d2lang.com/) rather than Mermaid for diagramming.
And to host them in production, I use the [astro-d2](https://astro-d2.vercel.app/) integration,
which uses a Remark plugin to convert the D2 diagrams to SVG and replace the original ` ```d2 ` code blocks in MDAST. However, they are replaced with image links, which will be converted `img` elements in the DOM. Hence the desire for this plugin.

And this works out because Remark plugins will run before Rehype plugins, so I can apply `rehype-svg` to those `img` elements.

A gotcha though was that the `img` elements show up in the HAST as `raw` nodes, which lead to a bit of confusion in development when I was unclear on why the target `img` elements weren't being visited in HAST tree traversal. But debugging led to this realization, and now I have [rehype-raw](https://github.com/rehypejs/rehype-raw) run before this one.

Thank god that there is strict ordering for Rehype and Remark plugins right?

## Example

Before `astro-d2`:

```markdown
′′′d2

MyBeautifulDiagram

′′′

<!-- Using ′ rather than ` so that I don't commit markdown-ception >
```

(which renders out to this, if you are curious [and are in an environment that can render D2])

```d2

MyBeautifulDiagram

```

Then, `astro-d2` will use Remark to create this:

```markdown
![](/d2/index-0.svg)
```

Which would usually just render to a normal `img` in HTML:

```html
<img src="/d2/index-0.svg" />
```

But with `rehype-svg`, it appears like this in the DOM:

```html
<div class="{desired-wrapper-classname}">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        data-d2-version="0.7.1"
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 2710 432"
        class="rehyped-inline-svg"
    >
        <svg class="d2-3142699309 d2-svg" width="2710" height="432" viewBox="-89 -89 2710 432"></svg>
    </svg>
</div>
```
