import { useState } from "react";
import { ArrowUpRight, Plus, RefreshCw, Route } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import Table from "@/components/common/Table";
import ActionButton from "@/components/common/ActionButton";
import RouteStep from "./RouteStep";
import { dispatchRows } from "@/data/mockData";
import CreateRouteSheetModal from "./modals/CreateRouteSheetModal";

export default function Dispatch({ fakeAction, clients, incomingMaterials = [], onSendToHistory }) {
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [routes, setRoutes] = useState(dispatchRows);
  const routeRows = routes.map((row, index) => ["", ...row, index]);
  const routeStatuses = ["Cargando", "En playa", "Despachado", "Entregado"];

  const sendDeliveredToHistory = () => {
    const delivered = routes.filter((route, index) => selectedRoutes.includes(index) && route[5] === "Entregado");
    onSendToHistory?.(delivered);
    setRoutes((current) => current.filter((route, index) => !(selectedRoutes.includes(index) && route[5] === "Entregado")));
    setSelectedRoutes([]);
    if (delivered.length) fakeAction?.(`${delivered.length} entrega${delivered.length === 1 ? "" : "s"} enviada${delivered.length === 1 ? "" : "s"} al historial`);
  };

  const handleCreateRouteSheet = (routeSheet) => {
    const clientName = clients.find((client) => client.id === routeSheet.idCliente)?.name || routeSheet.idCliente;
    const newRoute = [
      routeSheet.numero,
      clientName,
      routeSheet.idCamion,
      routeSheet.idChofer,
      routeSheet.estadoPicking,
      "En playa",
    ];
    setRoutes((current) => [newRoute, ...current]);
    fakeAction?.(`${routeSheet.numero} creada correctamente`);
  };
  return (
    <>
      <SectionTitle
        eyebrow="04 · EXPEDICIÓN"
        title="Playa y hojas de ruta"
        description="Coordiná la carga de camiones y seguí cada despacho en tiempo real."
        action={
          <ActionButton onClick={() => setRouteModalOpen(true)} className="cursor-pointer">
            <Plus size={17} />
            Armar hoja de ruta
          </ActionButton>
        }
      />

      <div className="mb-3.5 flex items-center gap-8 rounded-lg bg-brand px-5.75 py-5 text-white max-[760px]:flex-wrap max-[760px]:gap-4.5">
        <div className="flex-1 max-[760px]:basis-full">
          <div className="text-[9px] tracking-[0.16em] text-[#b6d0d8]">OPERACIÓN DE HOY · MARTES 18 AGO</div>
          <h3 className="m-0 font-barlow text-[25px] font-semibold">7 camiones programados <span className="mx-1.5 text-[#76a4b0]">·</span> 4 en playa <span className="mx-1.5 text-[#76a4b0]">·</span> 2 despachados</h3>
        </div>
        <div className="border-l border-white/20 pl-6 max-[760px]:border-0 max-[760px]:pl-0">
          <strong className="block font-barlow text-[28px]">03:42 h</strong>
          <span className="mt-0.5 block text-[9px] text-[#b6d0d8]">tiempo medio de carga</span>
        </div>
        <div className="border-l border-white/20 pl-6 max-[760px]:border-0 max-[760px]:pl-0">
          <strong className="block font-barlow text-[28px] text-green">−18 min</strong>
          <span className="mt-0.5 block text-[9px] text-[#b6d0d8]">vs. objetivo diario</span>
        </div>
      </div>

      <div className="grid grid-cols-[1.45fr_0.7fr] gap-3.5 max-[1100px]:grid-cols-1">
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
          <div className="mb-4.5 flex items-start justify-between gap-3">
            <div><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">SEGUIMIENTO DE CARGAS</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Camiones en operación</h3></div>
            <div className="flex flex-wrap justify-end gap-2"><ActionButton variant="secondary" onClick={() => fakeAction("Tablero actualizado")}><RefreshCw size={15} /> Actualizar</ActionButton><ActionButton onClick={sendDeliveredToHistory} disabled={!selectedRoutes.length}>Enviar a Historial de Entregas Finalizadas{selectedRoutes.length ? ` (${selectedRoutes.length})` : ""}</ActionButton></div>
          </div>
          <Table
            headers={["", "Hoja", "Cliente", "Camión", "Chofer", "Picking", "Estado"]}
            rows={routeRows}
            renderCell={(cell, j, row) => { const routeIndex = row[row.length - 1]; return j === 0 ? <input type="checkbox" checked={selectedRoutes.includes(routeIndex)} disabled={!routes[routeIndex] || routes[routeIndex][5] !== "Entregado"} onChange={() => setSelectedRoutes((current) => current.includes(routeIndex) ? current.filter((id) => id !== routeIndex) : [...current, routeIndex])} aria-label={`Seleccionar ${row[1]}`} className="h-4 w-4 accent-brand disabled:opacity-40" /> : j === 6 ? <select value={cell} onChange={(event) => setRoutes((current) => current.map((route, index) => index === routeIndex ? [...route.slice(0, 5), event.target.value] : route))} className={`rounded-full border-0 px-2 py-1 text-[9px] font-bold outline-none ${cell === "Entregado" ? "bg-green-soft text-green" : cell === "Despachado" ? "bg-green-soft text-green" : cell === "Cargando" || cell === "Cargado" ? "bg-blue-50 text-blue-700" : "bg-brand-soft text-brand"}`} aria-label={`Estado de ${row[1]}`}>{routeStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> : cell; }}
          />
        </div>

        <div className="rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
          <div className="mb-4.5 flex items-start justify-between gap-3">
            <div><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">RUTA DESTACADA</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">EXP-00841</h3></div>
            <Route size={18} className="text-brand" />
          </div>
          <div className="relative py-1 pb-3.5 pl-0.75 before:absolute before:bottom-7.5 before:left-2.5 before:top-3.5 before:border-l before:border-dashed before:border-[#cbdde1]">
            <RouteStep label="Planta Brother Plast" detail="08:10 · Carga iniciada" done />
            <RouteStep label="Plásticos del Sur" detail="Parque Industrial · 14:00" current />
            <RouteStep label="Mayorista Centro" detail="Ruta 5 · 16:30" />
          </div>
          <ActionButton full onClick={() => fakeAction("Hoja de ruta abierta")}>Ver hoja completa <ArrowUpRight size={16} /></ActionButton>
        </div>
      </div>
      {incomingMaterials.length > 0 && <div className="mt-3.5 rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card"><div className="mb-4.5"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">PEDIDOS RECIBIDOS</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Preparación para expedición</h3></div><Table headers={["Pedido", "Cliente", "Producto", "Volumen"]} rows={incomingMaterials.map((record) => record.values ? [record.values[0], record.values[1], record.values[2], record.values[3]] : [record.numero, record.cliente, record.producto, record.volumen])} /></div>}
      <CreateRouteSheetModal
        open={routeModalOpen}
        onOpenChange={setRouteModalOpen}
        onCreate={handleCreateRouteSheet}
        clients={clients}
      />
    </>
  );
}