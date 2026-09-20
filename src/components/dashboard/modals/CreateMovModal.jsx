import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const locations = ["Sector A · Rack 01 · P03", "Sector A · Rack 02 · P07", "Sector B · Rack 04 · P02", "Sector C · Armario 02"];
const units = ["kg", "TN", "un.", "m2"];
const levels = ["Crítico", "Normal", "Atención"];
const EMPTY_FORM = { material: "", ubicacion: "", volumen: "", unidad: "kg", nivel: "Normal", fecha: "" };

export default function CreateMovModal({ open, onOpenChange, onCreate, initialData = null }) {
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
        onCreate?.({ ...form, volumen: Number(form.volumen), fecha: form.fecha || "—" });
        setForm(EMPTY_FORM);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-125 border border-[#e1e8ea] bg-white p-0 shadow-card">
                <DialogHeader className="border-b border-slate-soft bg-white px-6 py-5">
                    <DialogTitle className="font-barlow text-[25px] font-normal text-ink">{editing ? "Modificar inventario" : "Alta de inventario"}</DialogTitle>
                    <DialogDescription className="text-[12px] text-muted-ink">Cargá los datos del material y su ubicación.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-5 bg-white px-6 py-5">
                        <div className="space-y-2"><Label htmlFor="stock-material" className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Material</Label><Input id="stock-material" required value={form.material} onChange={(event) => update("material", event.target.value)} placeholder="Ej. Resina biodegradable PLA" className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft" /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Ubicación física</Label><Select value={form.ubicacion} onValueChange={(value) => update("ubicacion", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue placeholder="Seleccionar ubicación" /></SelectTrigger><SelectContent>{locations.map((location) => <SelectItem key={location} value={location} className="text-[11px]">{location}</SelectItem>)}</SelectContent></Select></div>
                        <div className="grid grid-cols-[1fr_150px] gap-3"><div className="space-y-2"><Label htmlFor="stock-volume" className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Stock</Label><Input id="stock-volume" type="number" min="0.01" step="0.01" required value={form.volumen} onChange={(event) => update("volumen", event.target.value)} placeholder="Ej. 1280" className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft" /></div><div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Unidad</Label><Select value={form.unidad} onValueChange={(value) => update("unidad", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue /></SelectTrigger><SelectContent>{units.map((unit) => <SelectItem key={unit} value={unit} className="text-[11px]">{unit}</SelectItem>)}</SelectContent></Select></div></div>
                        <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Nivel</Label><Select value={form.nivel} onValueChange={(value) => update("nivel", value)} required><SelectTrigger className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft"><SelectValue /></SelectTrigger><SelectContent>{levels.map((level) => <SelectItem key={level} value={level} className="text-[11px]">{level}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="stock-date" className="text-[10px] font-bold uppercase tracking-widest text-muted-ink">Vencimiento</Label><Input id="stock-date" type="date" value={form.fecha} onChange={(event) => update("fecha", event.target.value)} className="h-9 border-[#dfe7e9] bg-white text-[11px] text-ink-soft" /></div></div>
                    </div>
                    <DialogFooter className="border-t border-slate-soft bg-white px-6 py-4"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 border-[#dce5e8] bg-white text-[11px] text-ink-soft">Cancelar</Button><Button type="submit" className="h-9 bg-brand text-[11px] text-white hover:bg-brand-dark">{editing ? "Guardar cambios" : "Dar de alta"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
