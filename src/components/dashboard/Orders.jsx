import { useState } from "react";
import { Pencil, Plus, Search, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";

import SectionTitle from "@/components/common/SectionTitle";
import Table from "@/components/common/Table";
import ActionButton from "@/components/common/ActionButton";
import CreateOrderModal from "./modals/CreateOrderModal";
import ClientsModal from "./modals/ClientsModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const orderStatuses = ["Pendiente de crédito", "Confirmado", "En preparación", "Listo para picking", "Listo para producción", "Enviado a depósito", "Enviado a producción"];

export default function Orders({ query, clients, setClients, orders, setOrders, onSendToProduction }) {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [clientsModalOpen, setClientsModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const rows = orders.filter((r) => {
    const term = orderSearch || query;
    return !term || Object.values(r).join(" ").toLowerCase().includes(term.toLowerCase());
  });

  const handleCreateOrder = (order) => {
    const clientName = clients.find((client) => client.id === order.idCliente)?.name || order.idCliente;
    const newOrder = { numero: order.numero, cliente: clientName, producto: order.producto, volumen: `${order.volumen} ${order.unidad}`, entrega: order.fechaEntrega || "Sin fecha", estado: "Pendiente" };
    if (editing) {
      setConfirmation({ action: "save", order: newOrder, previous: editing });
    } else {
      setOrders((current) => [newOrder, ...current]);
      toast.success(`${order.numero} creado correctamente`);
    }
  };

  const editOrder = (order) => {
    const [volumen, unidad] = order.volumen.split(" ");
    const client = clients.find((item) => item.name === order.cliente);
    setEditing({ ...order, form: { numero: order.numero, clientId: client?.id || "", producto: order.producto, volume: volumen, unit: unidad, deliveryDate: "" } });
    setOrderModalOpen(true);
  };

  const deleteOrder = (order) => setConfirmation({ action: "delete", order });
  const changeStatus = (order, estado) => {
    setOrders((current) => current.map((item) => item.numero === order.numero ? { ...item, estado } : item));
  };

  const toggleOrder = (order) => {
    if (order.estado !== "Listo para producción") return;
    setSelectedOrders((current) => current.includes(order.numero) ? current.filter((numero) => numero !== order.numero) : [...current, order.numero]);
  };

  const sendSelectedToProduction = () => {
    const readyOrders = orders.filter((order) => selectedOrders.includes(order.numero) && order.estado === "Listo para producción");
    readyOrders.forEach((order) => onSendToProduction(order));
    setOrders((current) => current.map((order) => readyOrders.some((item) => item.numero === order.numero) ? { ...order, estado: "Enviado a producción" } : order));
    setSelectedOrders([]);
    if (readyOrders.length) toast.success(`${readyOrders.length} pedido${readyOrders.length === 1 ? "" : "s"} enviado${readyOrders.length === 1 ? "" : "s"} a producción`);
  };
  const canSendToProduction = orders.some((order) => selectedOrders.includes(order.numero) && order.estado === "Listo para producción");
  const confirmOrderChange = () => {
    if (confirmation.action === "delete") setOrders((current) => current.filter((order) => order.numero !== confirmation.order.numero));
    else setOrders((current) => current.map((order) => order.numero === confirmation.previous.numero ? confirmation.order : order));
    setConfirmation(null); setEditing(null);
  };

  const tableRows = rows.map((order) => ["", order.numero, order.cliente, order.producto, order.volumen, order.entrega, order.estado, order]);

  const statusClass = (status) => ({
    "Listo para picking": "bg-green-soft text-green",
    "Listo para producción": "bg-green-soft text-green",
    "Pendiente de crédito": "bg-red-50 text-red-600",
    "En preparación": "bg-brand-soft text-brand",
    Confirmado: "bg-brand-softer text-brand",
    "Enviado a depósito": "bg-blue-50 text-blue-700",
    "Enviado a producción": "bg-blue-50 text-blue-700",
  }[status] || "bg-canvas text-ink-soft");

  return (
    <>
      <SectionTitle
        eyebrow="05 · PEDIDOS"
        title="Pedidos y clientes"
        description="Seguimiento de punta a punta para cada pedido comercial."
        action={
          <ActionButton onClick={() => { setEditing(null); setOrderModalOpen(true); }}>
            <Plus size={17} />
            Nuevo pedido
          </ActionButton>
        }
      />

      <div className="mb-3.5 grid grid-cols-3 gap-3.5 max-[760px]:grid-cols-1">
        <div className="rounded-lg border border-[#e1e8ea] bg-white p-[17px] shadow-card">
          <span className="block text-[10px] text-[#819298]">
            Pedidos del mes
          </span>

          <strong className="my-1 block font-barlow text-[33px] text-[#174354]">
            184
          </strong>

          <small className="block text-[9px] text-green">
            +12,6% vs. mes anterior
          </small>
        </div>

        <div className="rounded-lg border border-[#e1e8ea] bg-white p-[17px] shadow-card">
          <span className="block text-[10px] text-[#819298]">
            Tiempo medio de confirmación
          </span>

          <strong className="my-1 block font-barlow text-[33px] text-[#174354]">
            02:18 h
          </strong>

          <small className="block text-[9px] text-[#819298]">
            Objetivo: 04:00 h
          </small>
        </div>

        <div className="rounded-lg border border-[#e1e8ea] bg-white p-[17px] shadow-card">
          <span className="block text-[10px] text-[#819298]">
            Clientes activos
          </span>

          <strong className="my-1 block font-barlow text-[33px] text-[#174354]">
            42
          </strong>

          <small className="block text-[9px] text-green">
            6 con entrega esta semana
          </small>
        </div>
      </div>

      <div className="rounded-lg border border-[#e1e8ea] bg-white p-5 shadow-card">
        <div className="mb-[18px] flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#82979e]">
              CARTERA ACTIVA
            </div>

            <h3 className="m-0 font-barlow text-[21px] text-[#214451]">
              Pedidos recientes
            </h3>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {searchOpen && <input autoFocus value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Buscar pedido o cliente" className="h-10 rounded-[14px] border border-line px-3 text-[11px] outline-none focus:border-brand" />}
            <ActionButton variant="secondary" onClick={() => { setSearchOpen((current) => !current); if (searchOpen) setOrderSearch(""); }}>
              <Search size={15} />
              Buscar
            </ActionButton>

            <ActionButton variant="secondary" onClick={() => setClientsModalOpen(true)}>
              <UsersRound size={15} />
              Clientes
            </ActionButton>
            <ActionButton onClick={sendSelectedToProduction} disabled={!canSendToProduction}>
              Enviar a producción{selectedOrders.length ? ` (${selectedOrders.length})` : ""}
            </ActionButton>
          </div>
        </div>

        <Table
          headers={["", "Pedido", "Cliente", "Producto", "Volumen", "Entrega", "Estado", "Acciones"]}
          rows={tableRows}
          renderCell={(cell, j, row) =>
            j === 0 ? (
              <input type="checkbox" checked={selectedOrders.includes(row[7].numero)} disabled={row[7].estado !== "Listo para producción"} onChange={() => toggleOrder(row[7])} aria-label={`Seleccionar ${row[1]}`} className="h-4 w-4 accent-brand disabled:opacity-40" />
            ) : j === 6 ? (
              <select value={cell} onChange={(event) => changeStatus(row[7], event.target.value)} className={`rounded-full border-0 px-2 py-1 text-[9px] font-bold outline-none ${statusClass(cell)}`} aria-label={`Estado de ${row[1]}`}>
                {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            ) : j === 7 ? (
              <div className="flex gap-1"><button className="rounded p-1.5 text-brand hover:bg-brand-softer" onClick={() => editOrder(row[7])} aria-label={`Modificar ${row[1]}`}><Pencil size={14} /></button><button className="rounded p-1.5 text-red-600 hover:bg-red-50" onClick={() => deleteOrder(row[7])} aria-label={`Dar de baja ${row[1]}`}><Trash2 size={14} /></button></div>
            ) : (
              cell
            )
          }
        />
      </div>

      <CreateOrderModal
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        onCreate={handleCreateOrder}
        clients={clients}
        initialData={editing?.form}
      />
      <ClientsModal open={clientsModalOpen} onOpenChange={setClientsModalOpen} clients={clients} onChange={setClients} />
      <ConfirmDialog open={Boolean(confirmation)} action={confirmation?.action === "delete" ? "delete" : "save"} onOpenChange={(open) => !open && setConfirmation(null)} onConfirm={confirmOrderChange} />
    </>
  );
}