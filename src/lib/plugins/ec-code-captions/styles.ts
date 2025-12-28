import { PluginStyleSettings, type ResolverContext } from "expressive-code";
import { type CodeCaptionsOptions } from ".";

export interface CodeCaptionsStyleSettings {
    /**
     * Inline margin of `.expressive-code` div, which has now become an inner element of a figure.
     *
     * @default "auto"
     */
    innerDivInlineMargin: string;
}

declare module "expressive-code" {
    export interface StyleSettings {
        codeCaptions: CodeCaptionsStyleSettings;
    }
}

export const codeCaptionsStyleSettings = new PluginStyleSettings({
    defaultValues: { codeCaptions: { innerDivInlineMargin: "auto" } },
});

export function getCodeCaptionsStyleSettings({ cssVar }: ResolverContext, options: CodeCaptionsOptions) {
    const result = `
        .${options.figureClass} {
            margin-inline: ${cssVar("codeCaptions.innerDivInlineMargin")};
        }

        .${options.captionClass}, .${options.captionClass} * {
            all: revert-layer; /* ensure expressive-code styles don't affect the figcaption */
        }
    `;

    return result;
}
