import type { RemarkPlugin } from "@astrojs/markdown-remark";

import { remarkSectionizeHeadings, type Options } from "./remark-sectionize-headings";

/* Make compatible with Astro typing */
export default remarkSectionizeHeadings as RemarkPlugin<[Options?]>;
