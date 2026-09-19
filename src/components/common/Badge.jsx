export default function Badge({ children, tone = "slate" }) {
  const tones = {
    blue: "bg-brand-softer text-brand",
    green: "bg-green-soft text-green",
    amber: "bg-brand-soft text-brand",
    red: "bg-brand-soft text-brand",
    slate: "bg-canvas text-ink-soft",
  };

  return (
    <span
      className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-[7px] py-[5px] text-[9px] font-bold ${tones[tone] ?? tones.slate}`}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {children}
    </span>
  );
}
