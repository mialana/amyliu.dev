/**
 * Currently unused, but useful for setting css within expressive-code stylesheet.
 */

import { PluginStyleSettings, type ResolverContext } from "expressive-code";
import { type CodeCaptionsOptions } from ".";

export interface CodeCaptionsStyleSettings {}

declare module "expressive-code" {
    export interface StyleSettings {
        codeCaptions: CodeCaptionsStyleSettings;
    }
}

export const codeCaptionsStyleSettings = new PluginStyleSettings({ defaultValues: { codeCaptions: {} } });

export function getCodeCaptionsStyleSettings({ cssVar }: ResolverContext, options: CodeCaptionsOptions) {
    const result = `
        .${options.captionClass}, .${options.captionClass} * {
            all: revert-layer; /* the figcapture element should not abide by .expressive-code styles */
        }
    `;

    return result;
}
