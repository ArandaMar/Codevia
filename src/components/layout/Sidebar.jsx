import {
  LayoutDashboard,
  Factory,
  Package,
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  X,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import BrandMark from "@/components/common/BrandMark";

const navItems = [
  {
    id: "overview",
    label: "Vista general",
    icon: LayoutDashboard,
  },
  {
    id: "production",
    label: "Producción",
    icon: Factory,
  },
  {
    id: "warehouse",
    label: "Depósito",
    icon: Package,
    badge: "3",
  },
  {
    id: "dispatch",
    label: "Expedición",
    icon: Truck,
  },
  {
    id: "orders",
    label: "Pedidos",
    icon: ClipboardList,
  },
  {
    id: "reports",
    label: "Reportes",
    icon: BarChart3,
  },
];

export default function Sidebar({
  active,
  navigate,
  mobileOpen,
  setMobileOpen,
  role,
  setLogged,
  fakeAction,
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-62 flex-col border-r border-line bg-white px-3.75 pb-4 pt-6.25 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="relative flex items-center px-1 pb-6">
          <BrandMark compact />

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-0 top-0 grid h-7 w-7 place-items-center rounded-md border-0 bg-transparent text-ink-soft lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-2.75 rounded-[14px] border-0 px-3 py-2.75 text-left text-[14px] transition-all duration-150 cursor-pointer ${isActive
                  ? "bg-brand-soft font-semibold text-brand"
                  : "bg-transparent text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
              >
                <Icon size={16} strokeWidth={1.8} />

                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <em className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold not-italic text-brand">
                    {item.badge}
                  </em>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            type="button"
            onClick={() => fakeAction?.("Hay 3 excepciones que requieren atención")}
            className="flex w-full cursor-pointer items-center gap-2.25 rounded-[14px] border border-brand-soft bg-brand-softer px-2.5 py-2.75 text-left"
          >
            <AlertTriangle
              size={16}
              className="shrink-0 text-brand"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <strong className="text-[11px] text-brand">
                3 alertas críticas
              </strong>

              <span className="text-[10px] text-ink-soft">
                Requieren atención hoy
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("settings")}
            className="mt-2 flex w-full cursor-pointer items-center gap-2.75 rounded-[14px] border-0 bg-transparent px-3 py-2.75 text-left text-[11px] text-ink-soft hover:bg-canvas hover:text-brand"
          >
            <Settings size={16} strokeWidth={1.8} />
            <span>Configuración</span>
          </button>

          <div className="mt-3.75 flex items-center gap-2.25 border-t border-line px-2 pt-3.75">
            <div className="grid h-7.75 w-7.75 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-bold text-white">
              AL
            </div>

            <div className="min-w-0 flex-1">
              <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-ink">
                Andrés Liporace
              </strong>

              <span className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-mid">
                {role?.label || "Administrador"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLogged?.(false)}
              className="border-0 bg-transparent p-1 text-mid hover:text-brand"
              aria-label="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
