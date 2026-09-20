import { useState } from "react";
import { Pencil, Search, Trash2, UsersRound } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import ActionButton from "@/components/common/ActionButton";
import ClientsModal from "./modals/ClientsModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function Clients({ clients, setClients }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [search, setSearch] = useState("");
    const visible = clients.filter((client) => `${client.name} ${client.cuit} ${client.address} ${client.phone} ${client.email}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <SectionTitle eyebrow="06 · CLIENTES" title="Clientes" description="Administre la información comercial y de contacto de sus clientes." action={<div className="flex flex-wrap gap-2"><ActionButton variant="secondary" onClick={() => setSearchOpen((current) => !current)}><Search size={16} /> Buscar</ActionButton><ActionButton onClick={() => { setSelectedClient(null); setModalOpen(true); }}><UsersRound size={16} /> Dar de alta cliente</ActionButton></div>} />
            <div className="rounded-lg border border-line bg-white p-5 shadow-card">
                <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3"><div><div className="eyebrow">REGISTRO COMERCIAL</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Clientes activos</h3></div>{searchOpen && <label className="flex items-center gap-2 rounded-[14px] border border-line px-3 text-sm text-muted-ink"><Search size={15} /><input autoFocus className="w-56 border-0 py-2 outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, CUIT o contacto" /></label>}</div>
                {visible.length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-line text-[9px] uppercase tracking-[0.09em] text-mid"><th className="px-3 py-3">Cliente / razón social</th><th className="px-3 py-3">CUIT</th><th className="px-3 py-3">Dirección</th><th className="px-3 py-3">Teléfono</th><th className="px-3 py-3">Mail</th><th className="px-3 py-3 text-right">Acciones</th></tr></thead><tbody>{visible.map((client) => <tr key={client.id} className="border-b border-line last:border-0"><td className="px-3 py-4 font-semibold text-ink">{client.name}</td><td className="px-3 py-4 text-ink-soft">{client.cuit || "-"}</td><td className="px-3 py-4 text-ink-soft">{client.address || "-"}</td><td className="px-3 py-4 text-ink-soft">{client.phone || "-"}</td><td className="px-3 py-4 text-ink-soft">{client.email || "-"}</td><td className="px-3 py-4 text-right"><button className="mr-2 rounded p-2 text-brand hover:bg-brand-softer" onClick={() => { setSelectedClient(client); setModalOpen(true); }} aria-label={`Modificar ${client.name}`}><Pencil size={15} /></button><button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => setConfirmation(client)} aria-label={`Dar de baja ${client.name}`}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div> : <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-ink"><UsersRound size={24} className="text-brand" /><p className="m-0 text-sm">No hay clientes que coincidan con la búsqueda.</p></div>}
            </div>
            <ClientsModal open={modalOpen} onOpenChange={setModalOpen} clients={clients} onChange={setClients} initialClient={selectedClient} />
            <ConfirmDialog open={Boolean(confirmation)} action="delete" onOpenChange={(open) => !open && setConfirmation(null)} onConfirm={() => { setClients(clients.filter((client) => client.id !== confirmation.id)); setConfirmation(null); }} />
        </>
    );
}
