import { Pencil, Plus, Search, FileText, Trash2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import Table from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import ActionButton from "@/components/common/ActionButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { productionRows } from "@/data/mockData";
import { useState } from "react";
import { useEffect } from "react";
import CreateFabricModal from "./modals/CreateFabricModal";


const productionStatuses = ["En proceso", "Control de calidad", "Liberado", "Pendiente"];

export default function Production({ fakeAction, incomingOrders = [], incomingMaterials = [], onSendToWarehouse }) {
  const [now, setNow] = useState(() => new Date());
  const [registFab, setRegistFab] = useState(false)
  const [editing, setEditing] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rows, setRows] = useState(() => productionRows.map((values, index) => ({ id: `initial-${index}`, values })));
  const [selectedRows, setSelectedRows] = useState([]);

  const changeFabricStatus = (record, estado) => {
    setRows((current) => current.map((item) => item.id === record.id ? { ...item, values: item.values.map((value, index) => index === 4 ? estado : value) } : item));
  };

  const sendSelectedToWarehouse = () => {
    const selected = rows.filter((record) => selectedRows.includes(record.id));
    const released = selected.filter((record) => record.values[4] === "Liberado");
    const blocked = selected.length - released.length;
    onSendToWarehouse?.(released);
    setSelectedRows([]);
    if (released.length) fakeAction?.(`${released.length} lote${released.length === 1 ? "" : "s"} enviado${released.length === 1 ? "" : "s"} a depósito`);
    if (blocked) fakeAction?.(`${blocked} lote${blocked === 1 ? "" : "s"} no liberado${blocked === 1 ? "" : "s"}; no se envió a depósito`);
  };
  const canSendToWarehouse = rows.some((record) => selectedRows.includes(record.id) && record.values[4] === "Liberado");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = now.getHours() + now.getMinutes() / 60;
  const currentShift = hour >= 6 && hour < 14 ? "morning" : hour >= 14 && hour < 22 ? "afternoon" : "night";
  const shiftOrder = ["morning", "afternoon", "night"];
  const shiftState = (shift) => {
    const currentIndex = shiftOrder.indexOf(currentShift);
    const shiftIndex = shiftOrder.indexOf(shift);
    const distance = (shiftIndex - currentIndex + shiftOrder.length) % shiftOrder.length;
    return distance === 0 ? "En curso" : distance === 1 ? "Planificado" : "Finalizado";
  };
  const shiftLineClass = (shift) => ({
    "En curso": "border-t-brand",
    Planificado: "border-t-blue-400",
    Finalizado: "border-t-green",
  }[shiftState(shift)]);
  const shiftTone = (shift) => ({
    "En curso": "green",
    Planificado: "blue",
    Finalizado: "green",
  }[shiftState(shift)]);
  const percentageClass = (shift) => ({
    "En curso": "text-brand",
    Planificado: "text-blue-600",
    Finalizado: "text-green",
  }[shiftState(shift)]);
  const progressClass = (shift, percentage) => shiftState(shift) === "En curso"
    ? "bg-brand"
    : shiftState(shift) === "Planificado"
      ? "bg-blue-400"
      : percentage === 100
        ? "bg-green"
        : "bg-slate-400";
  const shiftProgress = (shift) => {
    const state = shiftState(shift);
    if (state === "Finalizado") return 100;
    if (state === "Planificado") return 0;
    const start = shift === "morning" ? 6 : shift === "afternoon" ? 14 : 22;
    const elapsed = shift === "night" && hour < 6 ? hour + 2 : hour - start;
    return Math.max(1, Math.min(99, Math.round((elapsed / 8) * 100)));
  };

  const handleFabric = (fabric) => {
    if (editing) {
      setConfirmation({ action: "save", fabric });
      return;
    }
    applyFabric(fabric);
  };

  const applyFabric = (fabric) => {
    const values = [
      editing?.values[0] || `EXT-${Date.now().toString().slice(-6)}`,
      fabric.producto,
      fabric.linea,
      fabric.turno,
      fabric.estado,
      `${fabric.volumen} ${fabric.unidad}`,
    ];
    if (editing) {
      setRows((current) => current.map((record) => record.id === editing.id ? { ...record, values } : record));
      fakeAction?.(`${values[0]} modificada correctamente`);
    } else {
      setRows((current) => [{ id: `fabric-${Date.now()}`, values }, ...current]);
      fakeAction?.(`${values[0]} creada correctamente`);
    }
    setEditing(null);
  };

  const editFabric = (record) => {
    const [, producto, linea, turno, estado, cantidad] = record.values;
    const [volumen, unidad] = cantidad.split(" ");
    setEditing({ ...record, form: { tipoProducto: producto.startsWith("Bobina") ? "Bobina" : producto.startsWith("Bolsa") ? "Bolsa" : producto.startsWith("Film") ? "Film" : "Otro", producto, linea, turno, estado, volumen, unidad } });
    setRegistFab(true);
  };

  const deleteFabric = (record) => {
    setConfirmation({ action: "delete", record });
  };

  const deleteFabricConfirmed = (record) => {
    setRows((current) => current.filter((item) => item.id !== record.id));
    fakeAction?.(`${record.values[0]} dado de baja correctamente`);
  };

  const tableRows = rows.map((record) => ["", ...record.values, record]);

  return (
    <>
      <SectionTitle
        eyebrow="02 · PRODUCCIÓN"
        title="Turnos y fabricación"
        description="Planificación de extrusión, lotes activos y controles de calidad."
        action={
          <ActionButton onClick={() => setRegistFab(true)}
            className="cursor-pointer">
            <Plus size={17} /> Registrar fabricación
          </ActionButton>
        }
      />

      <div className="mb-[18px] mt-[-4px] flex gap-5 border-b border-[#dce5e7]">
        <button className="relative pb-3 text-[11px] font-semibold text-brand after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-brand">
          Turnos y lotes
        </button>
        <button className="pb-3 text-[11px] font-semibold text-[#82949a]" onClick={() => fakeAction("Vista de calidad en preparación")}>
          Control de calidad <span className="ml-1 rounded-full bg-[#fff0d7] px-1.5 py-0.5 text-[9px] text-[#b87318]">3</span>
        </button>
        <button className="pb-3 text-[11px] font-semibold text-[#82949a]" onClick={() => fakeAction("Calendario en preparación")}>
          Calendario
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3.5 max-[760px]:grid-cols-1">
        <div className={`rounded-lg border border-[#e1e8ea] border-t-[3px] ${shiftLineClass("morning")} bg-white p-[17px] shadow-card`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a8d93]">06:00 — 14:00</span>
            <Badge tone={shiftTone("morning")}>{shiftState("morning")}</Badge>
          </div>
          <h3 className="my-[17px] mb-1 font-barlow text-[22px] text-[#214451]">Turno mañana</h3>
          <p className="mb-[21px] text-[10px] text-[#84959a]">Jefe: Martín Acosta · 4 líneas activas</p>
          <div className="grid grid-cols-[64px_1fr] items-center gap-x-3 gap-y-1.5">
            <strong className={`whitespace-nowrap font-barlow text-[22px] ${percentageClass("morning")}`}>{shiftProgress("morning")}%</strong>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-soft"><i className={`block h-full rounded-full ${progressClass("morning", shiftProgress("morning"))}`} style={{ width: `${shiftProgress("morning")}%` }} /></div>
            <span className="col-span-2 text-[9px] text-[#9aa7aa]">12.480 kg / 18.200 kg</span>
          </div>
        </div>

        <div className={`rounded-lg border border-[#e1e8ea] border-t-[3px] ${shiftLineClass("afternoon")} bg-white p-[17px] shadow-card`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a8d93]">14:00 — 22:00</span>
            <Badge tone={shiftTone("afternoon")}>{shiftState("afternoon")}</Badge>
          </div>
          <h3 className="my-[17px] mb-1 font-barlow text-[22px] text-[#214451]">Turno tarde</h3>
          <p className="mb-[21px] text-[10px] text-[#84959a]">Jefe: Laura Giménez · 3 líneas planificadas</p>
          <div className="grid grid-cols-[64px_1fr] items-center gap-x-3 gap-y-1.5">
            <strong className={`whitespace-nowrap font-barlow text-[22px] ${percentageClass("afternoon")}`}>{shiftProgress("afternoon")}%</strong>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-soft"><i className={`block h-full rounded-full ${progressClass("afternoon", shiftProgress("afternoon"))}`} style={{ width: `${shiftProgress("afternoon")}%` }} /></div>
            <span className="col-span-2 text-[9px] text-[#9aa7aa]">Comienza en 4 h 12 min</span>
          </div>
        </div>

        <div className={`rounded-lg border border-[#e1e8ea] border-t-[3px] ${shiftLineClass("night")} bg-white p-[17px] shadow-card`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7a8d93]">22:00 — 06:00</span>
            <Badge tone={shiftTone("night")}>{shiftState("night")}</Badge>
          </div>
          <h3 className="my-[17px] mb-1 font-barlow text-[22px] text-[#214451]">Turno noche</h3>
          <p className="mb-[21px] text-[10px] text-[#84959a]">Jefe: Pablo Suárez · 4 líneas completadas</p>
          <div className="grid grid-cols-[64px_1fr] items-center gap-x-3 gap-y-1.5">
            <strong className={`whitespace-nowrap font-barlow text-[22px] ${percentageClass("night")}`}>{shiftProgress("night")}%</strong>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-soft"><i className={`block h-full rounded-full ${progressClass("night", shiftProgress("night"))}`} style={{ width: `${shiftProgress("night")}%` }} /></div>
            <span className="col-span-2 text-[9px] text-[#9aa7aa]">18.940 kg producidos</span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
        <div className="mb-[18px] flex items-start justify-between gap-3">
          <div><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">TRAZABILIDAD DE LOTES</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Fabricación reciente</h3></div>
          <div className="flex flex-wrap justify-end gap-2">
            <ActionButton variant="secondary"><Search size={15} /> Filtrar</ActionButton>
            <ActionButton variant="secondary"><FileText size={15} /> Exportar</ActionButton>
            <ActionButton onClick={sendSelectedToWarehouse} disabled={!canSendToWarehouse}>Enviar a depósito{selectedRows.length ? ` (${selectedRows.length})` : ""}</ActionButton>
          </div>
        </div>
        {(incomingOrders.length > 0 || incomingMaterials.length > 0) && <div className="mb-5 grid gap-3 md:grid-cols-2"><div className="rounded-lg border border-brand-soft bg-brand-softer p-4"><div className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-brand">PEDIDOS RECIBIDOS</div><Table headers={["Pedido", "Cliente", "Producto", "Estado"]} rows={incomingOrders.map((order) => [order.numero, order.cliente, order.producto, order.estado])} /></div><div className="rounded-lg border border-brand-soft bg-brand-softer p-4"><div className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-brand">MATERIALES RECIBIDOS</div><Table headers={["Código", "Material", "Ubicación", "Stock"]} rows={incomingMaterials.map((record) => [record.values[0], record.values[1], record.values[2], record.values[3]])} /></div></div>}
        <Table
          headers={["", "Lote", "Producto", "Línea", "Turno", "Estado", "Cantidad", "Acciones"]}
          rows={tableRows}
          renderCell={(cell, j, row) =>
            j === 0 ? <input type="checkbox" checked={selectedRows.includes(row[7].id)} disabled={row[7].values[4] !== "Liberado"} onChange={() => setSelectedRows((current) => current.includes(row[7].id) ? current.filter((id) => id !== row[7].id) : [...current, row[7].id])} aria-label={`Seleccionar ${row[1]}`} className="h-4 w-4 accent-brand disabled:opacity-40" /> :
            j === 5 ? <select value={cell} onChange={(event) => changeFabricStatus(row[7], event.target.value)} className={`rounded-full border-0 px-2 py-1 text-[9px] font-bold outline-none ${cell === "Liberado" ? "bg-green-soft text-green" : cell === "En proceso" ? "bg-brand-softer text-brand" : cell === "Control de calidad" ? "bg-brand-soft text-brand" : "bg-canvas text-ink-soft"}`} aria-label={`Estado de ${row[1]}`}>{productionStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> :
            j === 7 ? <div className="flex gap-1"><button className="rounded p-1.5 text-brand hover:bg-brand-softer" onClick={() => editFabric(row[7])} aria-label={`Modificar ${row[1]}`}><Pencil size={14} /></button><button className="rounded p-1.5 text-red-600 hover:bg-red-50" onClick={() => deleteFabric(row[7])} aria-label={`Dar de baja ${row[1]}`}><Trash2 size={14} /></button></div> : cell
          }
        />
        <CreateFabricModal
          open={registFab}
          onOpenChange={(open) => { setRegistFab(open); if (!open) setEditing(null); }}
          onCreate={handleFabric}
          initialData={editing?.form}
        />
        <ConfirmDialog open={Boolean(confirmation)} action={confirmation?.action} onOpenChange={(open) => !open && setConfirmation(null)} onConfirm={() => { const current = confirmation; setConfirmation(null); if (current.action === "delete") deleteFabricConfirmed(current.record); else applyFabric(current.fabric); }} />
      </div>
    </>
  );
}