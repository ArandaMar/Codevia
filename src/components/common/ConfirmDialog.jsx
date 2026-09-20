import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, onOpenChange, action = "save", onConfirm }) {
    const deleting = action === "delete";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[380px] border border-line bg-white p-0 shadow-card">
                <DialogHeader className="gap-2 border-b border-line px-5 py-4">
                    <DialogTitle className="font-barlow text-[21px] font-normal text-ink">
                        {deleting ? "¿Está seguro de que desea eliminar este registro?" : "¿Está seguro de que desea guardar los cambios?"}
                    </DialogTitle>
                    <DialogDescription className="text-[12px] leading-relaxed text-muted-ink">
                        {deleting ? "El registro dejará de estar disponible en el listado activo." : "Se actualizará la información con los valores ingresados."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="border-0 bg-white px-5 py-3">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 border-line bg-white text-[11px] text-ink-soft">Cancelar</Button>
                    <Button type="button" onClick={onConfirm} className={`h-9 text-[11px] text-white ${deleting ? "bg-red-600 hover:bg-red-700" : "bg-brand hover:bg-brand-dark"}`}>
                        {deleting ? "Eliminar" : "Guardar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
