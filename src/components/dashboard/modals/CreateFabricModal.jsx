import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productGroups } from "@/data/productOptions";

const lines = ["Extrusora 01", "Extrusora 02", "Línea bolsas 01", "Línea bolsas 02"];
const shifts = ["Turno mañana", "Turno tarde", "Turno noche"];
const levels = ["En proceso", "Control de calidad", "Liberado", "Pendiente"];
const units = ["Kg", "Tonelada", "Unidad", "m2"];
const EMPTY_FORM = { tipoProducto: "", producto: "", linea: "", turno: "", estado: "En proceso", volumen: "", unidad: "Kg" };

export default function CreateFabricModal({ open, onOpenChange, onCreate, initialData = null }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const editing = Boolean(initialData);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (open) setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
        }, 0);
        return () => window.clearTimeout(timer);
    }, [open, initialData]);

    const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));
    const submit = (event) => {
        event.preventDefault();
        onCreate?.({ ...form, volumen: Number(form.volumen) });
        setForm(EMPTY_FORM);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-125 border border-[#e1e8ea] bg-white p-0 shadow-card">
                <DialogHeader className="border-b border-slate-soft bg-white px-6 py-5">
                    <DialogTitle className="font-barlow text-[25px] font-normal text-ink">{editing ? "Modificar fabricación" : "Registrar fabricación"}</DialogTitle>
                    <DialogDescription className="text-[12px] text-muted-ink">Completá los datos del lote de producción.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-5 bg-white px-6 py-5">
                        <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Producto</Label><Select value={form.producto} onValueChange={(value) => update("producto", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue placeholder="Seleccionar producto y tamaño" /></SelectTrigger><SelectContent>{productGroups.map((group) => <SelectGroup key={group.label}><SelectLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">{group.label}</SelectLabel>{group.options.map((product) => <SelectItem key={product} value={product} className="text-[11px]">{product}</SelectItem>)}</SelectGroup>)}</SelectContent></Select></div>
                        <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Línea</Label><Select value={form.linea} onValueChange={(value) => update("linea", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue placeholder="Seleccionar línea" /></SelectTrigger><SelectContent>{lines.map((line) => <SelectItem key={line} value={line} className="text-[11px]">{line}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Turno</Label><Select value={form.turno} onValueChange={(value) => update("turno", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue placeholder="Seleccionar turno" /></SelectTrigger><SelectContent>{shifts.map((shift) => <SelectItem key={shift} value={shift} className="text-[11px]">{shift}</SelectItem>)}</SelectContent></Select></div></div>
                        <div className="grid grid-cols-[1fr_150px] gap-3"><div className="space-y-2"><Label htmlFor="fabric-volume" className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Cantidad</Label><Input id="fabric-volume" type="number" min="0.01" step="0.01" required value={form.volumen} onChange={(event) => update("volumen", event.target.value)} placeholder="Ej. 1200" className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft" /></div><div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Unidad</Label><Select value={form.unidad} onValueChange={(value) => update("unidad", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue placeholder="Unidad" /></SelectTrigger><SelectContent>{units.map((unit) => <SelectItem key={unit} value={unit} className="text-[11px]">{unit}</SelectItem>)}</SelectContent></Select></div></div>
                        <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Estado</Label><Select value={form.estado} onValueChange={(value) => update("estado", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue /></SelectTrigger><SelectContent>{levels.map((level) => <SelectItem key={level} value={level} className="text-[11px]">{level}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <DialogFooter className="border-t border-slate-soft bg-white px-6 py-4"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 border-[#dce5e8] bg-white text-[11px] text-ink-soft">Cancelar</Button><Button type="submit" className="h-9 bg-brand text-[11px] text-white hover:bg-brand-dark">{editing ? "Guardar cambios" : "Registrar fabricación"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
