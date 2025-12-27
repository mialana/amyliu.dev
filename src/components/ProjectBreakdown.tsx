import "@/styles/projects.css";

import { useState, useEffect, useRef } from "react";

import ComingSoon from "./ComingSoon";

import postprocessMarkdown from "@/lib/postprocessMarkdown";

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
            setActiveTabId(tabs[tabs.length - 1].id);
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

            const manualHashEvent = new HashChangeEvent("hashchange");
            window.dispatchEvent(manualHashEvent);
        }
    };

    {
        /* just in case earlier push didn't work */
    }
    if (tabs.length === 0) {
        return (
            <div ref={contentRef} className="project-breakdown-content">
                {children}
            </div>
        );
    }

    {
        /* account for faux coming soon "tab" */
    }
    if (tabs.length === 1) {
        return (
            <div
                id={tabs[0].id}
                className="coming-soon-container-breakdown project-breakdown-content"
            >
                <ComingSoon />
            </div>
        );
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

    return (
        <div className="w-full py-8">
            {/* sticky tab topbar */}
            <ul
                className="sticky top-0 z-10 flex flex-nowrap justify-center-safe gap-1 overflow-x-scroll scroll-auto"
                role="tablist"
            >
                {/* Mapped tabs (absolute) */}
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        id={tab.id}
                        role="tab"
                        aria-selected={activeTabId === tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`text-important-text text-3xs z-20 scroll-auto rounded-md px-4 py-2 transition-colors duration-500 hover:brightness-150 ${
                            activeTabId === tab.id
                                ? "bg-blue-accent/80"
                                : "bg-inverted-neutral/20 cursor-pointer hover:brightness-150"
                        }`}
                    >
                        {tab.title}
                    </button>
                ))}
            </ul>

            {/* Tab Content */}
            <div
                id={`tabcontent`}
                className="project-breakdown-content"
                role="tabpanel"
                aria-labelledby={`tab-${activeTab.id}`}
                dangerouslySetInnerHTML={{ __html: activeTab.content || "" }}
                ref={postprocessMarkdown}
            ></div>

            {/* Hidden content for parsing - this won't be visible */}
            <div id="test-id-is-here" ref={contentRef} className="hidden">
                {children}
            </div>
        </div>
    );
}
