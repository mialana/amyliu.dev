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

export function getCodeCaptionsStyleSettings({ cssVar }: ResolverContext) {
    const result = `

        .expressive-code {
            margin-inline: ${cssVar("codeCaptions.innerDivInlineMargin")};
        }

    `;

    console.log(result)

    return result;
}
