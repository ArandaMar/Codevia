import { ChevronRight } from "lucide-react";

export default function RoleCard({ roleItem, selected, onSelect }) {
  const Icon = roleItem.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3.5 rounded-[16px] border bg-white px-4 py-3.5 text-left transition-all duration-180 cursor-pointer ${
        selected
          ? "border-brand bg-brand-softer shadow-card"
          : "border-line shadow-[0_6px_18px_rgba(17,24,39,0.03)] hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-card-hover"
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] ${
          selected ? "bg-brand-soft text-brand" : "bg-canvas text-ink-soft"
        }`}
      >
        {Icon ? <Icon size={20} strokeWidth={2} /> : null}
      </span>

      <span className="min-w-0 flex-1">
        <strong className="block text-[14px] font-bold text-ink">{roleItem.label}</strong>
        <small className="mt-0.5 block text-[12px] text-ink-soft">{roleItem.note}</small>
      </span>

      <ChevronRight
        size={18}
        className={selected ? "shrink-0 text-brand" : "shrink-0 text-mid"}
      />
    </button>
  );
}
