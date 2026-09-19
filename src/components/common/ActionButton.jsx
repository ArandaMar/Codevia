const variants = {
    primary: "text-white bg-brand shadow-[0_8px_18px_rgba(229,9,20,0.18)] hover:bg-brand-dark hover:-translate-y-px",
    secondary: "text-ink-soft bg-white border border-line hover:text-brand hover:border-brand hover:shadow-card",
    link: "bg-transparent text-brand font-bold",
};

export default function ActionButton({ variant = "primary", full = false, className = "", children, ...props }) {
    return (
        <button
            className={`inline-flex cursor-pointer items-center justify-center gap-1.75 rounded-[14px] text-[11px] font-bold transition-all duration-150 active:scale-[0.98] ${variant === "link" ? "" : "px-[14px] py-[10px]"
                } ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
