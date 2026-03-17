# Amy Liu Personal Portfolio Website

[**Live Deployment**](https://amyliu.dev)

Functionality and implementation techniques are documented within the codebase through comprehensive commenting.

Although this is a site built to feature my other projects, its personal goals are still to maintain best web development practices and maximize performance and accessibility stats reported by engines like [Lighthouse Page Speed insights](https://pagespeed.web.dev/). It is:

- build on Typescript, HTML/CSS
- uses the [Astro](https://astro.build/) framework
- is hosted through [Cloudflare Workers](https://workers.cloudflare.com/)
- augments development and CI via Python scripting, [GitHub Actions](https://github.com/features/actions), and [Husky hooks](https://typicode.github.io/husky/)
- and more

## Development Instructions

1. Clone the repo.
2. Run the following in terminal.

```bash
npm run dev
```

This will install dependencies and run other CI requirements beforehand.

3. Preview production server:

```bash
npm run preview
```

This will build static assets and create an environment that closely matches a deployed site.

## Miscellaneous Features List

- [D2 Declarative Diagramming](https://d2lang.com/) for diagram
- A suite of custom [Rehype](https://github.com/rehypejs/rehype) and [Remark](https://github.com/remarkjs/remark) plugins to perform preprocessing on content writen in Markdown. This occurs at build-time and optimizes loading. Plugins including but not limited to:
    - LaTeX math rendering for formulas
    - SVGs (output format of D2 diagrams) to inline SVGs for optimal performance and additional functionality
        - i.e. Custom Panning and Zooming for better UX of diagrams
- Intelligent styling using new [Cascade Layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers) for CSS combined with inline [TailwindCSS](https://tailwindcss.com/)
- Custom Filtering and Sorting for [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) via [Server-side On-Demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/) (SSR)
- Custom ground-up "On This Page" table of contents that mimics the functionality of that of many industry sites, such as the template of [Starlight Docs](https://starlight.astro.build/getting-started/)
