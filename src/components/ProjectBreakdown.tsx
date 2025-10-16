import { useState, useEffect, useRef } from "react";

import ComingSoon from "./ComingSoon";

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

            // Fallback if no h2 elements are found
            if (tabs.length === 0) {
                const today = new Date().toISOString().split("T")[0];
                tabs.push({
                    id: `updated-${today}`,
                    title: `Updated: ${today}`,
                    content: "More details coming soon...",
                });
            }

            setTabs(tabs);
            setActiveTabId(tabs[0].id);
        };

        parseMarkdown();
    }, []);

    // Listen for hash changes and sync with tab selection
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);

            if (hash && tabs.length > 0) {
                const tabExists = tabs.find((tab) => tab.id === hash);
                let section = document.getElementById(hash);
                if (tabExists) {
                    setActiveTabId(hash);

                    section?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                } else {
                    setActiveTabId("method");

                    if (timer) clearTimeout(timer); // clear previous
                    timer = setTimeout(() => {
                        section = document.getElementById(hash);
                        section?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }, 300);
                }
            }
        };

        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);

        return () => {
            if (timer) clearTimeout(timer);
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
            <div
                ref={contentRef}
                className="prose prose-lg xl:prose-xl max-w-none"
            >
                {children}
            </div>
        );
    }
    if (tabs.length === 1) {
        return (
            <div
                id={tabs[0].id}
                className="coming-soon-container-breakdown mt-4 h-fit w-full py-4"
            >
                <ComingSoon />
            </div>
        );
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

    return (
        <div className="prose xl:prose-lg mx-auto mt-4 w-full max-w-[1024px] **:scroll-mt-20 lg:mt-8 lg:**:scroll-mt-22">
            {/* Tab Navigation */}
            <div
                className="sticky top-0 z-10 flex w-full flex-nowrap justify-center-safe gap-1 overflow-x-scroll scroll-auto lg:gap-2"
                role="tablist"
            >
                <div className="bg-light-base dark:bg-dark-base absolute top-0 h-2 w-full"></div>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        id={tab.id}
                        role="tab"
                        aria-selected={activeTabId === tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`z-20 scroll-auto rounded-md px-2 py-1 text-[0.55rem] font-medium transition-colors duration-500 lg:px-4 lg:py-2 lg:text-sm ${
                            activeTabId === tab.id
                                ? "bg-blue-accent/90 hover:bg-blue-accent-light text-white"
                                : "cursor-pointer bg-neutral-200/90 text-neutral-600 hover:bg-neutral-400"
                        }`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div
                id={`tabcontent`}
                className="prose prose-sm lg:prose-base prose-h5:font-medium relative mx-auto mt-4 min-w-full **:mx-auto *:last:!my-0"
                role="tabpanel"
                aria-labelledby={`tab-${activeTab.id}`}
                dangerouslySetInnerHTML={{ __html: activeTab.content || "" }}
                ref={(el) => {
                    if (el) {
                        // set all links to open to new tab
                        el.querySelectorAll("a").forEach((link) => {
                            link.setAttribute("target", "_blank");
                            link.setAttribute("rel", "noopener noreferrer");
                        });

                        el.querySelectorAll("img").forEach((img) => {
                            img.addEventListener("load", () => {
                                img.classList.add("bg-none");
                            });
                        });
                    }
                }}
            ></div>

            {/* Hidden content for parsing - this won't be visible */}
            <div ref={contentRef} className="hidden">
                {children}
            </div>
        </div>
    );
}
