export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] justify-between px-[38px] pb-7 pt-[22px] text-[9px] text-mid">
      <span>BrotherPlast SRL · Prototipo exploratorio</span>

      <span>
        Última sincronización{" "}
        <strong className="text-ink-soft">hace 2 min</strong>{" "}
        ·{" "}
        <span className="ml-[5px] text-green">
          <span className="mr-[5px] inline-block h-[7px] w-[7px] rounded-full bg-green shadow-[0_0_0_3px_#e8f6ef]" />
          Sistema operativo
        </span>
      </span>
    </footer>
  );
}
