import { cn } from "@/lib/utils";

export function Panel({ children, className, padded = true }) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-line bg-white shadow-card",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }) {
  return (
    <div className={cn("mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-mid", className)}>
      {children}
    </div>
  );
}

export function PanelTitle({ children, className }) {
  return (
    <h3 className={cn("m-0 text-[21px] font-bold tracking-tight text-ink", className)}>
      {children}
    </h3>
  );
}

export function PanelHeading({ eyebrow, title, action, className }) {
  return (
    <div className={cn("mb-[18px] flex items-start justify-between gap-3", className)}>
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <PanelTitle>{title}</PanelTitle>
      </div>
      {action}
    </div>
  );
}
