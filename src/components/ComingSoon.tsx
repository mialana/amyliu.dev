interface ComingSoonProps {
    showHeader?: boolean;
}

export default function ComingSoon({ showHeader = true }: ComingSoonProps) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="relative flex">
            <div className="absolute z-5 flex h-fit w-full flex-col items-center-safe gap-1 place-self-center-safe justify-self-center-safe *:text-white">
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
                src="/resources/coming_soon.gif"
                className="coming-soon-img border-neutral-primary/75 md:w-3/4; mx-auto my-2 w-full max-w-7xl overflow-hidden rounded-xl border-8 border-double shadow-md md:my-4 md:shadow-lg"
            />
        </div>
    );
}
