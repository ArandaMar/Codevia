export default function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-[18px] max-md:flex-col max-md:items-start">
      <div className="min-w-0">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-mid">
          {eyebrow}
        </div>

        <h1 className="m-0 text-[34px] font-extrabold leading-[0.95] tracking-[-0.8px] text-ink max-md:text-[30px]">
          {title}
        </h1>

        {description && (
          <p className="mt-[9px] mb-0 text-[13px] text-ink-soft max-md:max-w-[520px] max-md:text-[12px]">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 max-md:w-full">
          {action}
        </div>
      )}
    </div>
  );
}
