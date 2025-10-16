interface ComingSoonProps {
    showHeader?: boolean;
}

export default function ComingSoon({ showHeader = true }: ComingSoonProps) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex">
            <div className="absolute z-5 flex h-fit w-full flex-col items-center-safe gap-1 place-self-center-safe justify-self-center-safe *:text-white">
                {showHeader && (
                    <h2 className="!text-sm leading-none font-semibold md:!text-base">
                        {today}
                    </h2>
                )}
                <p className="!text-xs leading-none font-normal md:!text-sm">
                    More details coming soon...
                </p>
            </div>
            <img
                src="/resources/coming_soon.gif"
                className="border-blue-accent/20 coming-soon-img mx-auto w-full overflow-hidden shadow-lg shadow-neutral-400 brightness-75"
            />
        </div>
    );
}
