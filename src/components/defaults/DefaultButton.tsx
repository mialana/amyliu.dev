interface DefaultButtonProps {
    identifier: string;
    callback: Function;
    children: any;
}

export default function DefaultButton({
    identifier,
    callback,
    children,
}: DefaultButtonProps) {
    return (
        <button
            id={`${identifier}-button`}
            onClick={() => callback()}
            className="bg-inverted-tertiary/50 text-inverted-important-text cursor-pointer rounded-md border text-sm hover:brightness-150"
        >
            {children}
        </button>
    );
}
