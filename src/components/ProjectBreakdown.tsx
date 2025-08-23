import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
    id: string;
    title: string;
    content: string;
}

interface ProjectBreakdownProps {
    children: React.ReactElement;
}

export default function ProjectBreakdown({ children }: ProjectBreakdownProps) {
    const [sections, setSections] = useState<Section[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse already rendered HTML content into sections based on h2 tags
        const parseSections = () => {
            if (!contentRef.current) return;

            const h2Elements = contentRef.current.querySelectorAll("h2");
            const sections: Section[] = [];

            h2Elements.forEach((h2, index) => {
                const title = h2.textContent || "";
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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
    }, []);

    if (sections.length === 0) {
        return (
            <div ref={contentRef} className="prose prose-lg max-w-none">
                {children}
            </div>
        );
    }

    return (
        <div className="mx-auto my-8 w-fit">
            {/* Tab Navigation */}
            <div
                className="mb-6 flex flex-wrap gap-2 border-b border-gray-200"
                role="tablist"
            >
                {sections.map((section, index) => (
                    <button
                        key={section.id}
                        id={`tab-${section.id}`}
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`panel-${section.id}`}
                        onClick={() => setActiveTab(index)}
                        className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                            activeTab === index
                                ? "bg-blue-accent text-white"
                                : "bg-neutral-100 hover:bg-neutral-200"
                        }`}
                    >
                        {section.title}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="prose prose-lg max-w-none"
                        role="tabpanel"
                        id={`panel-${sections[activeTab]?.id}`}
                        aria-labelledby={`tab-${sections[activeTab]?.id}`}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: sections[activeTab]?.content || "",
                            }}
                            className="prose"
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
