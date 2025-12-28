import { definePlugin, AttachedPluginData, type ExpressiveCodePlugin } from "expressive-code";
import { h } from "astro-expressive-code/hast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";

import { codeCaptionsStyleSettings, getCodeCaptionsStyleSettings } from "./styles";

export interface CodeCaptionsOptions {
    /**
     * Class applied to the figcaption element
     * @default "ec-code-caption"
     */
    captionClass?: string;

    /**
     * Class applied to the wrapping figure
     * @default "expressive-code-with-caption"
     */
    figureClass?: string;

    /**
     * Marker used to separate caption from code
     * @default "---"
     */
    delimiter?: string;
}

interface CaptionData {
    caption?: string;
}
const captionData = new AttachedPluginData<CaptionData>(() => ({}));

export function pluginCodeCaptions(options: CodeCaptionsOptions = {}): ExpressiveCodePlugin {
    /* set undefined parameters to defaults */
    const parsedOptions = {
        captionClass: (options.captionClass = "ec-code-caption"),
        figureClass: (options.figureClass = "expressive-code-with-caption"),
        delimiter: (options.delimiter = "---"),
    };

    return definePlugin({
        name: "Code captions",
        styleSettings: codeCaptionsStyleSettings,
        baseStyles: (context) => getCodeCaptionsStyleSettings(context),
        hooks: {
            preprocessCode: (context) => {
                const allLines = [...context.codeBlock.getLines()];

                if (allLines.length && allLines[allLines.length - 1]?.text !== parsedOptions.delimiter) {
                    return;
                }
                const captionStartLine = allLines.findLastIndex((line, index) => {
                    // Let's skip the actual last match
                    if (index === allLines.length - 1) return false;
                    return line.text === parsedOptions.delimiter;
                });
                if (!captionStartLine) return;

                const blockData = captionData.getOrCreateFor(context.codeBlock);
                blockData.caption = allLines
                    .slice(captionStartLine + 1, allLines.length - 1)
                    .map((line) => line.text)
                    .join("\n");

                for (let i = allLines.length; i > captionStartLine; i--) {
                    // Do this in reverse direction so there's no issue with line numbers
                    // changing as we delete lines
                    context.codeBlock.deleteLine(i - 1);
                }

                // Also delete the last line if it remains empty
                if (context.codeBlock.getLines().length > 0) {
                    const lastLine = context.codeBlock.getLines()[context.codeBlock.getLines().length - 1];
                    if (lastLine && lastLine.text.trim() === "") {
                        context.codeBlock.deleteLine(context.codeBlock.getLines().length - 1);
                    }
                }
            },
            postprocessRenderedBlockGroup: async ({ renderedGroupContents, renderData }) => {
                // Find the block that has a caption, if any
                const captionBlock = renderedGroupContents.find((groupContent) => {
                    const blockData = captionData.getOrCreateFor(groupContent.codeBlock);
                    return !!blockData.caption;
                });
                if (!captionBlock) {
                    return;
                }
                const oldRoot = renderData.groupAst;

                const caption = captionData.getOrCreateFor(captionBlock.codeBlock).caption!;

                /* Create HAST for caption */
                const figcaption = h(
                    "figcaption",
                    { className: [parsedOptions.captionClass] },
                    toHast(fromMarkdown(caption)),
                );

                /* Replace `oldRoot` with a figure element that has `oldRoot` as child */
                renderData.groupAst = h("figure", { className: [parsedOptions.figureClass] }, [oldRoot, figcaption]);
            },
        },
    });
}
