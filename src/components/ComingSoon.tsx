interface ComingSoonProps {
    showHeader?: boolean;
}

export default function ComingSoon({ showHeader = true }: ComingSoonProps) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div
            id="coming-soon-container"
            className="relative flex w-full max-w-4xl"
        >
            <div className="text-inverted-important-text absolute z-5 flex h-fit w-full flex-col items-center-safe gap-1 place-self-center-safe justify-self-center-safe">
                {showHeader && (
                    <h2 className="text-sm! leading-none font-semibold md:text-base!">
                        {today}
                    </h2>
                )}
                <p className="text-xs! leading-none md:text-sm!">
                    More details coming soon...
                </p>
            </div>
            <img
                id="coming-soon-img"
                src="/resources/coming_soon.gif"
                className="shadow-md md:shadow-lg"
            />
        </div>
    );
}
