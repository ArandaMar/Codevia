import { Activity, ChevronRight, Clock3 } from "lucide-react";
import BrandMark from "@/components/common/BrandMark";
import RoleGrid from "@/components/login/RoleGrid";

export default function Login({ role, setRole, setLogged }) {
  return (
    <div className="min-h-screen bg-canvas-2 text-ink">
      <div className="relative mx-auto max-w-[980px] overflow-hidden px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-16 top-8 hidden h-[420px] w-[420px] rounded-full border-[18px] border-brand/90 lg:block" />
        <div className="pointer-events-none absolute -right-4 top-24 hidden h-[280px] w-[280px] rounded-full border-[10px] border-ink/80 lg:block" />

        <header className="relative z-10 flex items-start justify-between gap-4">
          <BrandMark />
          <p className="hidden max-w-[120px] text-right text-[9px] font-semibold uppercase leading-4 tracking-[0.16em] text-mid sm:block">
            Plástico que impulsa industria
          </p>
        </header>

        <section className="relative z-10 mt-8 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="m-0 max-w-[520px] text-[48px] font-extrabold leading-[0.92] tracking-[-1.4px] text-ink sm:text-[64px] lg:text-[72px]">
              La planta,
              <br />
              <span className="text-brand">en una sola lectura.</span>
            </h1>
            <p className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-ink-soft">
              Producción, depósito y expedición coordinados para que cada bobina encuentre su próximo destino.
            </p>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[28px] bg-canvas sm:min-h-[280px]">
            <img
              src="/brand/login-hero.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white/10 via-transparent to-canvas-2/40" />
            <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[14px] border-brand" />
            <div className="pointer-events-none absolute -bottom-20 -right-8 h-52 w-52 rounded-full border-[10px] border-ink" />
          </div>
        </section>

        <section className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3.5 rounded-[16px] border border-line bg-white px-4 py-4 shadow-card">
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-canvas text-brand">
              <Activity size={22} strokeWidth={2.1} />
            </span>
            <div>
              <strong className="block text-[28px] font-extrabold leading-none tracking-tight text-ink">98,4%</strong>
              <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-mid">
                Trazabilidad de lotes
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 rounded-[16px] border border-line bg-white px-4 py-4 shadow-card">
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-canvas text-brand">
              <Clock3 size={22} strokeWidth={2.1} />
            </span>
            <div>
              <strong className="block text-[28px] font-extrabold leading-none tracking-tight text-ink">03:42 h</strong>
              <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-mid">
                Tiempo medio de carga
              </span>
            </div>
          </div>
        </section>

        <section className="relative z-10 mt-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-brand" />
            <div className="text-[10px] font-semibold tracking-[0.18em] text-mid">ACCESO AL SISTEMA</div>
          </div>
          <h2 className="m-0 text-[34px] font-extrabold tracking-tight text-ink sm:text-[40px]">Ingresá a tu puesto</h2>
          <p className="mb-5 mt-2 text-sm text-ink-soft">Elegí un rol para explorar la vista correspondiente.</p>

          <RoleGrid role={role} setRole={setRole} />

          <button
            type="button"
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-[16px] bg-brand py-3.5 text-[13px] font-bold text-white shadow-[0_10px_20px_rgba(229,9,20,0.18)] transition-all hover:-translate-y-px hover:bg-brand-dark active:scale-[0.99] cursor-pointer"
            onClick={() => setLogged(true)}
          >
            Entrar al puesto <ChevronRight size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}
