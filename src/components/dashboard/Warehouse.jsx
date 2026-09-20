import { AlertTriangle, Clock3, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import Table from "@/components/common/Table";
import Badge from "@/components/common/Badge";
import IconBox from "@/components/common/IconBox";
import ActionButton from "@/components/common/ActionButton";
import { stockRows } from "@/data/mockData";
import { useState } from "react";
import CreateMovModal from "./modals/CreateMovModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const pickingStatuses = ["Pendiente de armado", "En armado de entrega", "Listo para picking"];

export default function Warehouse({ fakeAction, incomingOrders = [], onSendToDispatch }) {
  const [movModalOpen, setMovModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rows, setRows] = useState(() => stockRows.map((values, index) => ({ id: `initial-${index}`, values })));
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPickingOrders, setSelectedPickingOrders] = useState([]);
  const [pickingStates, setPickingStates] = useState({});

  const handleMovModal = (movement) => {
    const values = [
      editing?.values[0] || `MP-${Date.now().toString().slice(-6)}`,
      movement.material,
      movement.ubicacion,
      `${movement.volumen} ${movement.unidad}`,
      movement.fecha,
      movement.nivel,
    ];
    if (editing) {
      setConfirmation({ action: "save", record: editing, values });
    } else {
      setRows((current) => [{ id: `stock-${Date.now()}`, values }, ...current]);
      fakeAction?.(`${values[0]} dado de alta correctamente`);
    }
  };

  const editMovement = (record) => {
    const [, material, ubicacion, stock, fecha, nivel] = record.values;
    const [volumen, unidad] = stock.split(" ");
    setEditing({
      ...record,
      form: { material, ubicacion, volumen: volumen.replace(".", ""), unidad, nivel, fecha: fecha === "—" ? "" : fecha },
    });
    setMovModalOpen(true);
  };

  const deleteMovement = (record) => setConfirmation({ action: "delete", record });
  const confirmChange = () => {
    if (confirmation.action === "delete") {
      setRows((current) => current.filter((item) => item.id !== confirmation.record.id));
      fakeAction?.(`${confirmation.record.values[0]} dado de baja correctamente`);
    } else {
      setRows((current) => current.map((item) => item.id === confirmation.record.id ? { ...item, values: confirmation.values } : item));
      fakeAction?.(`${confirmation.values[0]} modificado correctamente`);
    }
    setConfirmation(null);
    setEditing(null);
  };

  const tableRows = rows.map((record) => [...record.values, record]);
  const getInventoryState = (record) => pickingStates[record.id] || "Pendiente de armado";
  const toggleMaterial = (record) => {
    if (getInventoryState(record) !== "Listo para picking") return;
    setSelectedMaterials((current) => current.includes(record.id) ? current.filter((id) => id !== record.id) : [...current, record.id]);
  };
  const getPickingState = (order) => pickingStates[order.numero] || "Pendiente de armado";
  const updatePickingState = (order, estado) => setPickingStates((current) => ({ ...current, [order.numero]: estado }));
  const sendPickingToDispatch = () => {
    const selected = rows.filter((record) => selectedMaterials.includes(record.id) && getInventoryState(record) === "Listo para picking");
    onSendToDispatch?.(selected);
    setSelectedPickingOrders([]);
    if (selected.length) fakeAction?.(`${selected.length} pedido${selected.length === 1 ? "" : "s"} enviado${selected.length === 1 ? "" : "s"} a expedición`);
  };
  return (
    <>
      <SectionTitle
        eyebrow="03 · DEPÓSITO"
        title="Stock por sector"
        description="Ubicaciones físicas, mínimos operativos y vencimientos próximos."
        action={<ActionButton onClick={() => setMovModalOpen(true)} className="cursor-pointer"><Plus size={17} /> Registrar movimiento</ActionButton>}
      />

      <div className="mb-3.5 grid grid-cols-[1.4fr_repeat(3,1fr)] gap-3 max-[760px]:grid-cols-1">
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-4 shadow-card">
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">OCUPACIÓN TOTAL</div>
          <strong className="font-barlow text-[42px] leading-none text-brand">74<span className="text-xl">%</span></strong>
          <div className="mt-3.25 h-1.5 overflow-hidden rounded-full bg-slate-soft"><i className="block h-full rounded-full bg-brand" style={{ width: "74%" }} /></div>
          <small className="mt-2 block text-[9px] text-[#8b9a9f]">3 de 4 sectores en operación normal</small>
        </div>
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-4 shadow-card">
          <span className="text-[9px] tracking-widest text-[#8c9ca0]">SECTOR A</span>
          <strong className="mt-2.5 block font-barlow text-[32px] text-[#214451]">82%</strong>
          <small className="mt-2 block text-[9px] text-[#8b9a9f]">Materia prima</small>
        </div>
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-4 shadow-card">
          <span className="text-[9px] tracking-widest text-[#8c9ca0]">SECTOR B</span>
          <strong className="mt-2.5 block font-barlow text-[32px] text-amber">91%</strong>
          <small className="mt-2 block text-[9px] text-[#8b9a9f]">Biodegradables</small>
        </div>
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-4 shadow-card">
          <span className="text-[9px] tracking-widest text-[#8c9ca0]">SECTOR C</span>
          <strong className="mt-2.5 block font-barlow text-[32px] text-[#214451]">48%</strong>
          <small className="mt-2 block text-[9px] text-[#8b9a9f]">Insumos</small>
        </div>
      </div>

      <div className="rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
        <div className="mb-4.5 flex items-start justify-between gap-3">
          <div><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">UBICACIONES Y ALERTAS</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Inventario crítico</h3></div>
          <div className="flex flex-wrap justify-end gap-2"><ActionButton variant="secondary"><MapPin size={15} /> Mapa de sectores</ActionButton><ActionButton onClick={sendPickingToDispatch} disabled={!selectedMaterials.length}>Enviar a expedición{selectedMaterials.length ? ` (${selectedMaterials.length})` : ""}</ActionButton></div>
        </div>
        <Table
          headers={["", "Código", "Material", "Ubicación física", "Stock", "Vencimiento", "Estado", "Acciones"]}
          rows={tableRows.map((row) => ["", ...row])}
          renderCell={(cell, j, row) =>
            j === 0 ? <input type="checkbox" checked={selectedMaterials.includes(row[7].id)} disabled={getInventoryState(row[7]) !== "Listo para picking"} onChange={() => toggleMaterial(row[7])} aria-label={`Seleccionar ${row[1]}`} className="h-4 w-4 accent-brand disabled:opacity-40" /> :
              j === 6 ? <select value={getInventoryState(row[7])} onChange={(event) => setPickingStates((current) => ({ ...current, [row[7].id]: event.target.value }))} className={`rounded-full border-0 px-2 py-1 text-[9px] font-bold outline-none ${getInventoryState(row[7]) === "Listo para picking" ? "bg-green-soft text-green" : getInventoryState(row[7]) === "En armado de entrega" ? "bg-brand-soft text-brand" : "bg-canvas text-ink-soft"}`} aria-label={`Estado de ${row[1]}`}>{pickingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> :
                j === 5 && cell !== "—" ? <span className={cell === "12 sep 2026" ? "font-bold text-red" : ""}>{cell}</span> :
                  j === 7 ? <div className="flex gap-1"><button className="rounded p-1.5 text-brand hover:bg-brand-softer" onClick={() => editMovement(row[7])} aria-label={`Modificar ${row[1]}`}><Pencil size={14} /></button><button className="rounded p-1.5 text-red-600 hover:bg-red-50" onClick={() => deleteMovement(row[7])} aria-label={`Dar de baja ${row[1]}`}><Trash2 size={14} /></button></div> : cell
          }
        />
      </div>

      <div className="mt-3.5 rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
        <div className="mb-[18px] flex items-start justify-between gap-3"><div><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">PEDIDOS RECIBIDOS</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Preparación en depósito</h3></div><Badge tone="red">{incomingOrders.length} pedidos</Badge></div>
        {incomingOrders.length ? <Table headers={["", "Pedido", "Cliente", "Producto", "Volumen", "Entrega", "Estado"]} rows={incomingOrders.map((order) => ["", order.numero, order.cliente, order.producto, order.volumen, order.entrega, order])} renderCell={(cell, index, row) => index === 0 ? <input type="checkbox" disabled={getPickingState(row[6]) !== "Listo para picking"} checked={selectedPickingOrders.includes(row[6].numero)} onChange={() => setSelectedPickingOrders((current) => current.includes(row[6].numero) ? current.filter((numero) => numero !== row[6].numero) : [...current, row[6].numero])} aria-label={`Seleccionar ${row[1]}`} className="h-4 w-4 accent-brand disabled:opacity-40" /> : index === 6 ? <select value={getPickingState(cell)} onChange={(event) => updatePickingState(cell, event.target.value)} className={`rounded-full border-0 px-2 py-1 text-[9px] font-bold outline-none ${getPickingState(cell) === "Listo para picking" ? "bg-green-soft text-green" : getPickingState(cell) === "En armado de entrega" ? "bg-brand-soft text-brand" : "bg-canvas text-ink-soft"}`} aria-label={`Estado de ${row[1]}`}>{pickingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> : cell} /> : <p className="m-0 py-5 text-sm text-muted-ink">Los pedidos enviados a Depósito aparecerán aquí.</p>}
      </div>

      <div className="mt-3.5 grid grid-cols-[1.25fr_0.75fr] gap-3.5 max-[1100px]:grid-cols-1">
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
          <div className="mb-4.5 flex items-start justify-between gap-3">
            <div><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">ALERTAS DE VENCIMIENTO</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Acciones sugeridas</h3></div>
            <AlertTriangle size={18} className="text-amber" />
          </div>
          <div className="flex items-center gap-2.5 py-2.75">
            <IconBox icon={AlertTriangle} tone="amber" />
            <div className="flex-1"><strong className="block text-[11px] text-[#49656e]">PLA-014 · vence en 25 días</strong><span className="mt-1 block text-[9px] text-[#91a0a4]">1.280 kg · sugerido priorizar en producción</span></div>
            <button className="rounded border border-[#e1e8ea] px-1.75 py-1.25 text-[9px] font-bold text-brand" onClick={() => fakeAction("Prioridad aplicada al lote PLA-014")}>Priorizar</button>
          </div>
          <div className="flex items-center gap-2.5 border-t border-slate-soft py-2.75">
            <IconBox icon={Clock3} tone="slate" />
            <div className="flex-1"><strong className="block text-[11px] text-[#49656e]">TINT-NEG-041 · vence en 104 días</strong><span className="mt-1 block text-[9px] text-[#91a0a4]">180 kg · revisar rotación FEFO</span></div>
            <button className="rounded border border-[#e1e8ea] px-1.75 py-1.25 text-[9px] font-bold text-brand" onClick={() => fakeAction("Rotación FEFO marcada")}>Revisar</button>
          </div>
        </div>

        <div className="rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">REFERENCIA DE UBICACIÓN</div>
          <h3 className="mb-0 mt-1 font-barlow text-[21px] text-[#214451]">Mapa operativo</h3>
          <div className="mt-3.5 grid grid-cols-2 gap-1.75">
            <span className="min-h-14 rounded-[5px] bg-[#4d8190] p-2.5 font-barlow text-[23px] text-white">A <small className="block font-sans text-[8px] text-white/80">82%</small></span>
            <span className="min-h-14 rounded-[5px] bg-[#d49a43] p-2.5 font-barlow text-[23px] text-white">B <small className="block font-sans text-[8px] text-white/80">91%</small></span>
            <span className="min-h-14 rounded-[5px] bg-[#8ba8ad] p-2.5 font-barlow text-[23px] text-white">C <small className="block font-sans text-[8px] text-white/80">48%</small></span>
            <span className="min-h-14 rounded-[5px] bg-[#426876] p-2.5 font-barlow text-[23px] text-white">D <small className="block font-sans text-[8px] text-white/80">Exp.</small></span>
          </div>
        </div>
      </div>
      <CreateMovModal
        open={movModalOpen}
        onOpenChange={(open) => { setMovModalOpen(open); if (!open) setEditing(null); }}
        onCreate={handleMovModal}
        initialData={editing?.form}
      />
      <ConfirmDialog open={Boolean(confirmation)} action={confirmation?.action === "delete" ? "delete" : "save"} onOpenChange={(open) => !open && setConfirmation(null)} onConfirm={confirmChange} />
    </>
  );
}