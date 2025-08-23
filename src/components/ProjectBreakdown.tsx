import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MarkdownHeading {
    depth: number;
    slug: string;
    text: string;
}

interface Section {
    id: string;
    title: string;
    content: string;
}

interface ProjectBreakdownProps {
    children: React.ReactElement;
    headings?: MarkdownHeading[];
}

export default function ProjectBreakdown({
    children,
    headings = [],
}: ProjectBreakdownProps) {
    const [sections, setSections] = useState<Section[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>("");
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse already rendered HTML content into sections based on h2 tags
        const parseSections = () => {
            if (!contentRef.current) return;

            const h2Elements = contentRef.current.querySelectorAll("h2");
            const sections: Section[] = [];

            h2Elements.forEach((h2, index) => {
                const title = h2.textContent || "";

                // Use the heading slug if available, otherwise generate one
                let id: string;
                if (headings.length > index && headings[index]) {
                    id = headings[index].slug;
                } else {
                    id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                }

                // Get content between this h2 and the next h2 (or end of content)
                let content = "";
                let nextElement = h2.nextElementSibling;

                while (nextElement && nextElement.tagName !== "H2") {
                    content += nextElement.outerHTML;
                    nextElement = nextElement.nextElementSibling;
                }

                sections.push({ id, title, content: content.trim() });
            });

            setSections(sections);
        };

        // Use a small delay to ensure the DOM is fully rendered
        const timer = setTimeout(parseSections, 100);
        return () => clearTimeout(timer);
    }, [headings, activeTabId]);

    // Listen for hash changes and sync with tab selection
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // Remove the # symbol

            if (hash && sections.length > 0) {
                // Find the section that matches the hash
                const sectionExists = sections.find(
                    (section) => section.id === hash,
                );
                if (sectionExists) {
                    setActiveTabId(hash);
                }
            }
        };

        // Handle initial hash on component mount
        handleHashChange();

        // Listen for hash changes
        window.addEventListener("hashchange", handleHashChange);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [sections]);

    // Update URL hash when tab changes
    const handleTabChange = (sectionId: string) => {
        setActiveTabId(sectionId);
        const newHash = `#${sectionId}`;
        if (window.location.hash !== newHash) {
            window.history.replaceState(null, "", newHash);
        }
    };

    if (sections.length === 0) {
        return (
            <div ref={contentRef} className="prose prose-lg max-w-none">
                {children}
            </div>
        );
    }

    const activeSection =
        sections.find((section) => section.id === activeTabId) || sections[0];

    return (
        <div className="mx-auto my-8 w-fit **:scroll-mt-24">
            {/* Tab Navigation */}
            <div
                className="sticky top-0 z-10 mb-6 flex scale-103 flex-wrap gap-2 border-b border-neutral-200 bg-white py-2"
                role="tablist"
            >
                {sections.map((section) => (
                    <button
                        key={section.id}
                        id={`tab-${section.id}`}
                        role="tab"
                        aria-selected={activeTabId === section.id}
                        aria-controls={`panel-${section.id}`}
                        onClick={() => handleTabChange(section.id)}
                        className={`mt-6 rounded-t-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                            activeTabId === section.id
                                ? "bg-blue-accent text-white"
                                : "bg-neutral-200 hover:bg-neutral-300"
                        }`}
                    >
                        {section.title}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeTabId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="prose prose-lg max-w-none"
                        role="tabpanel"
                        id={`panel-${activeSection.id}`}
                        aria-labelledby={`tab-${activeSection.id}`}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: activeSection.content || "",
                            }}
                            className="prose prose-h5:font-medium"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Hidden content for parsing - this won't be visible */}
            <div ref={contentRef} className="hidden">
                {children}
            </div>
        </div>
    );
}
