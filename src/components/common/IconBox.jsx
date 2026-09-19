export default function IconBox({ icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-brand-softer text-brand",
    green: "bg-green-soft text-green",
    amber: "bg-brand-soft text-brand",
    slate: "bg-canvas text-ink-soft",
    red: "bg-brand-soft text-brand",
  };

  return (
    <span
      className={`grid h-[36px] w-[36px] place-items-center rounded-[12px] ${tones[tone] ?? tones.blue}`}
    >
      <Icon size={17} strokeWidth={2.1} />
    </span>
  );
}
