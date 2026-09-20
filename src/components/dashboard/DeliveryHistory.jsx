import { History } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import Table from "@/components/common/Table";
import Badge from "@/components/common/Badge";

export default function DeliveryHistory({ completedDeliveries = [] }) {
    return (
        <>
            <SectionTitle eyebrow="06 · EXPEDICIÓN" title="Historial de Entregas Finalizadas" description="Registro de hojas de ruta entregadas y cerradas." />
            <div className="rounded-lg border border-line bg-white p-5 shadow-card">
                <div className="mb-[18px] flex items-center justify-between gap-3"><div><div className="eyebrow">ENTREGAS CERRADAS</div><h3 className="m-0 font-barlow text-[21px] text-[#214451]">Historial</h3></div><History size={20} className="text-brand" /></div>
                {completedDeliveries.length ? <Table headers={["Hoja", "Cliente", "Camión", "Chofer", "Picking", "Estado"]} rows={completedDeliveries.map((route) => [...route])} renderCell={(cell, index) => index === 5 ? <Badge tone="green">Entregado</Badge> : cell} /> : <p className="m-0 py-10 text-center text-sm text-muted-ink">Las hojas marcadas como entregadas aparecerán aquí.</p>}
            </div>
        </>
    );
}
