import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
    id: string;
    title: string;
    content: string;
}

interface ProjectBreakdownProps {
    children: React.ReactElement;
}

export default function ProjectBreakdown({ children }: ProjectBreakdownProps) {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>("");
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse already rendered HTML content into tabs based on h2 tags
        const parseMarkdown = () => {
            if (!contentRef.current) return;

            const h2Elements = contentRef.current.querySelectorAll("h2");
            const tabs: Tab[] = [];

            h2Elements.forEach((h2, index) => {
                const title = h2.textContent || "";

                // Use the heading slug if available, otherwise generate one
                let id: string;
                id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                // Get content between this h2 and the next h2 (or end of content)
                let content = "";
                let nextElement = h2.nextElementSibling;

                while (nextElement && nextElement.tagName !== "H2") {
                    content += nextElement.outerHTML;
                    nextElement = nextElement.nextElementSibling;
                }

                tabs.push({ id, title, content: content.trim() });
            });

            setTabs(tabs);
            setActiveTabId(tabs[0].id);
        };

        parseMarkdown();
    }, [activeTabId]);

    // Listen for hash changes and sync with tab selection
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // Remove the # symbol

            if (hash && tabs.length > 0) {
                // Find the tab that matches the hash
                const tabExists = tabs.find((tab) => tab.id === hash);
                if (tabExists) {
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
    }, [tabs]);

    // Update URL hash when tab changes
    const handleTabChange = (tabId: string) => {
        setActiveTabId(tabId);
        const newHash = `#${tabId}`;
        if (window.location.hash !== newHash) {
            window.history.replaceState(null, "", newHash);
        }
    };

    if (tabs.length === 0) {
        return (
            <div ref={contentRef} className="prose prose-lg max-w-none">
                {children}
            </div>
        );
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

    return (
        <div className="mx-auto my-8 w-fit **:scroll-mt-24">
            {/* Tab Navigation */}
            <div
                className="sticky top-0 z-10 mb-6 flex scale-103 flex-wrap gap-2 border-b border-neutral-200 bg-white py-2"
                role="tablist"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        id={tab.id}
                        role="tab"
                        aria-selected={activeTabId === tab.id}
                        aria-controls={`panel-${activeTab.id}`}
                        onClick={() => handleTabChange(tab.id)}
                        className={`mt-6 rounded-t-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                            activeTabId === tab.id
                                ? "bg-blue-accent text-white"
                                : "bg-neutral-200 hover:bg-neutral-300"
                        }`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative min-h-[400px]">
                <div
                    key={activeTabId}
                    className="prose prose-lg max-w-none"
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab.id}`}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: activeTab.content || "",
                        }}
                        className="prose prose-h5:font-medium"
                    />
                </div>
            </div>

            {/* Hidden content for parsing - this won't be visible */}
            <div ref={contentRef} className="hidden">
                {children}
            </div>
        </div>
    );
}
