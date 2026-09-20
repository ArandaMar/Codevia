import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const EMPTY_CLIENT = { name: "", cuit: "", address: "", phone: "", email: "" };

export default function ClientsModal({ open, onOpenChange, clients, onChange, initialClient = null }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_CLIENT);
    const [search, setSearch] = useState("");
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (open && initialClient) {
                setEditing(initialClient);
                setForm({ name: initialClient.name, cuit: initialClient.cuit || "", address: initialClient.address || "", email: initialClient.email || "", phone: initialClient.phone || "" });
                setFormOpen(true);
                return;
            }
            if (!open) {
                setFormOpen(false);
                setEditing(null);
                setSearch("");
            }
        }, 0);
        return () => window.clearTimeout(timer);
    }, [open, initialClient]);

    const startNew = () => { setEditing(null); setForm(EMPTY_CLIENT); setFormOpen(true); };
    const startEdit = (client) => { setEditing(client); setForm({ name: client.name, cuit: client.cuit || "", address: client.address || "", email: client.email || "", phone: client.phone || "" }); setFormOpen(true); };
    const save = (event) => {
        event.preventDefault();
        if (editing) onChange(clients.map((client) => client.id === editing.id ? { ...client, ...form } : client));
        else onChange([...clients, { ...form, id: `CLI-${String(clients.length + 1).padStart(3, "0")}` }]);
        setFormOpen(false);
    };
    const remove = () => { onChange(clients.filter((client) => client.id !== confirmation.id)); setConfirmation(null); };
    const visible = clients.filter((client) => `${client.id} ${client.name} ${client.cuit} ${client.address} ${client.email} ${client.phone}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[720px] border border-line bg-white p-0 shadow-card">
                <DialogHeader className="border-b border-line px-6 py-5"><DialogTitle className="font-barlow text-[25px] font-normal text-ink">ABM de clientes</DialogTitle><DialogDescription className="text-[12px] text-muted-ink">Administre altas, modificaciones y bajas de clientes.</DialogDescription></DialogHeader>
                {!formOpen ? <div className="p-6"><div className="mb-4 flex flex-wrap justify-between gap-3"><label className="flex items-center gap-2 rounded-md border border-line px-3 text-sm text-muted-ink"><Search size={15} /><input className="w-48 border-0 py-2 outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente" /></label><Button type="button" onClick={startNew} className="gap-1.5 bg-brand text-white hover:bg-brand-dark"><Plus size={16} /> Nuevo cliente</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b border-line text-[10px] uppercase tracking-wider text-muted-ink"><th className="px-3 py-3">Código</th><th className="px-3 py-3">Cliente / razón social</th><th className="px-3 py-3">CUIT</th><th className="px-3 py-3">Dirección</th><th className="px-3 py-3">Teléfono</th><th className="px-3 py-3">Mail</th><th className="px-3 py-3 text-right">Acciones</th></tr></thead><tbody>{visible.map((client) => <tr key={client.id} className="border-b border-line last:border-0"><td className="px-3 py-3 font-semibold text-brand">{client.id}</td><td className="px-3 py-3">{client.name}</td><td className="px-3 py-3 text-muted-ink">{client.cuit || "-"}</td><td className="px-3 py-3 text-muted-ink">{client.address || "-"}</td><td className="px-3 py-3 text-muted-ink">{client.phone || "-"}</td><td className="px-3 py-3 text-muted-ink">{client.email || "-"}</td><td className="px-3 py-3 text-right"><button className="mr-2 rounded p-2 text-brand hover:bg-brand-softer" onClick={() => startEdit(client)} aria-label={`Modificar ${client.name}`}><Pencil size={15} /></button><button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => setConfirmation(client)} aria-label={`Dar de baja ${client.name}`}><Trash2 size={15} /></button></td></tr>)}</tbody></table>{!visible.length && <p className="py-8 text-center text-sm text-muted-ink">No hay clientes que coincidan.</p>}</div></div> : <form onSubmit={save}><div className="grid gap-4 px-6 py-6"><div className="flex items-center justify-between"><div className="eyebrow text-brand">{editing ? "MODIFICAR" : "ALTA"}</div><button type="button" className="text-muted-ink" onClick={() => setFormOpen(false)} aria-label="Cancelar"><X size={18} /></button></div><label className="field">Nombre o razón social<Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Plásticos del Sur" /></label><label className="field">CUIT<Input required value={form.cuit} onChange={(event) => setForm({ ...form, cuit: event.target.value })} placeholder="30-12345678-9" /></label><label className="field">Dirección<Input required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Av. Industrial 1234" /></label><div className="grid gap-4 md:grid-cols-2"><label className="field">Teléfono<Input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="011 4444-5555" /></label><label className="field">Mail<Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="cliente@empresa.com" /></label></div></div><DialogFooter className="border-t border-line px-6 py-4"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button><Button type="submit" className="bg-brand text-white hover:bg-brand-dark">{editing ? "Guardar cambios" : "Crear cliente"}</Button></DialogFooter></form>}
                <ConfirmDialog open={Boolean(confirmation)} action="delete" onOpenChange={(isOpen) => !isOpen && setConfirmation(null)} onConfirm={remove} />
            </DialogContent>
        </Dialog>
    );
}
