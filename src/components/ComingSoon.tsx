interface ComingSoonProps {
    showHeader?: boolean;
}

export default function ComingSoon({ showHeader = true }: ComingSoonProps) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="relative flex">
            <div className="absolute z-5 flex h-fit w-full flex-col items-center-safe gap-1 place-self-center-safe justify-self-center-safe *:text-white">
                {showHeader && <h2 className="text-sm! leading-none font-semibold md:text-base!">{today}</h2>}
                <p className="text-xs! leading-none md:text-sm!">More details coming soon...</p>
            </div>
            <img
                src="/resources/gif/coming_soon.gif"
                className="coming-soon-img mx-auto w-full overflow-hidden shadow-md md:shadow-lg"
            />
        </div>
    );
}
