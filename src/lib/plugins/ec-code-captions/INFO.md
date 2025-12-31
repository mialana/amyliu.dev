# Expressive Code Captions

This plugin is ported from the [expressive-code-caption](https://github.com/FujoWebDev/fujocoded-plugins/blob/main/expressive-code-caption/index.ts) package.

The additional features I added to this one were classing logic (as always) for easier css selection.

Furthermore, since I am heavily dependent on [CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers) for styling, I use the following function in `styles.ts`:

```typescript
export function getCodeCaptionsStyleSettings({ cssVar }: ResolverContext, options: CodeCaptionsOptions) {
    const result = `
        .${options.captionClass}, .${options.captionClass} * {
            all: revert-layer; /* the figcapture element should not abide by .expressive-code styles */
        }
    `;

    return result;
}
```

What this does is revert the styling of the newly created figcaption to the previous layer.
I found this was necessary as Expressive Code applies an `all: revert` to every element within
the `.expressive-code` class.

But since the caption really does not / should not abide by the styling of the codeblock,
a `revert-layer` allows me to define styling in a previous layer that I own.

And since all my text colors, line heights, etc. are uniformally defined in my "defaults" layer,
I really have to do no extra work to make the captions abide by the styling of the rest of the website.
And more importantly, no repeated code, which I despise.

Note that this logic depends on setting the `cascadeLayer` config option for Expressive Code in `astro.config.ts`.
