import IconBox from "./IconBox";

export default function Kpi({
  icon,
  label,
  value,
  trend,
  note,
  tone,
}) {
  const trendColors = {
    blue: "text-brand",
    green: "text-green",
    amber: "text-brand",
    slate: "text-ink-soft",
    red: "text-brand",
  };

  return (
    <div className="relative min-h-[143px] rounded-[16px] border border-line bg-white p-[17px] shadow-card">
      <IconBox icon={icon} tone={tone} />

      <div className="mt-[15px] text-[11px] text-ink-soft">
        {label}
      </div>

      <strong className="mt-[7px] block text-[32px] font-extrabold leading-none tracking-[-0.5px] text-ink">
        {value}
      </strong>

      <div className="mt-[7px] flex items-center gap-[6px] text-[9px] text-mid">
        <span className={`font-extrabold ${trendColors[tone] ?? trendColors.slate}`}>
          {trend}
        </span>
        <span>{note}</span>
      </div>
    </div>
  );
}
