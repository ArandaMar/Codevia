import { useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import ActionButton from "@/components/common/ActionButton";
import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const EMPTY_FORM = { codigo: "", nombre: "", id_tipo_producto: "", id_material: "", id_unidad_medida: "", es_biodegradable: false };

export default function Front() {
    const [productos, setProductos] = useState([]);
    const [tiposProducto, setTiposProducto] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    const [formulario, setFormulario] = useState(EMPTY_FORM);
    const [busqueda, setBusqueda] = useState("");
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [confirmation, setConfirmation] = useState(null);

    const cargarDatos = async () => {
        setCargando(true);
        setError("");
        try {
            const respuestas = await Promise.all([
                fetch(`${API_URL}/api/productos`),
                fetch(`${API_URL}/api/productos/tipos-producto`),
                fetch(`${API_URL}/api/productos/materiales`),
                fetch(`${API_URL}/api/productos/unidades-medida`),
            ]);
            if (respuestas.some((respuesta) => !respuesta.ok)) throw new Error("No se pudieron cargar los datos del ABM.");
            const [productosData, tipos, materialesData, unidades] = await Promise.all(respuestas.map((respuesta) => respuesta.json()));
            setProductos(productosData); setTiposProducto(tipos); setMateriales(materialesData); setUnidadesMedida(unidades);
        } catch (requestError) {
            setError(`${requestError.message} Verificá que el backend esté ejecutándose en ${API_URL}.`);
        } finally { setCargando(false); }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => cargarDatos(), 0);
        return () => window.clearTimeout(timer);
    }, []);

    const cambiarCampo = (event) => {
        const { name, value, type, checked } = event.target;
        setFormulario((actual) => ({ ...actual, [name]: type === "checkbox" ? checked : value }));
    };
    const abrirNuevo = () => { setEditando(null); setFormulario(EMPTY_FORM); setMensaje(""); setError(""); };
    const editarProducto = (producto) => {
        setEditando(producto.id_producto);
        setFormulario({ codigo: producto.codigo || "", nombre: producto.nombre || "", id_tipo_producto: String(producto.id_tipo_producto || ""), id_material: String(producto.id_material || ""), id_unidad_medida: String(producto.id_unidad_medida || ""), es_biodegradable: Boolean(producto.es_biodegradable) });
        setMensaje(""); setError(""); window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const guardarProducto = async (event) => {
        event.preventDefault();
        if (editando) {
            setConfirmation({ action: "save", payload: formulario });
            return;
        }
        await guardarProductoConfirmado(formulario);
    };
    const guardarProductoConfirmado = async (formularioActual) => {
        setGuardando(true); setMensaje(""); setError("");
        const payload = { ...formularioActual, id_tipo_producto: Number(formularioActual.id_tipo_producto), id_material: Number(formularioActual.id_material), id_unidad_medida: Number(formularioActual.id_unidad_medida), usu_alta: "BP38636078", usu_mod: "BP38636078" };
        try {
            const respuesta = await fetch(`${API_URL}/api/productos${editando ? `/${editando}` : ""}`, { method: editando ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.detalle || datos.error || "No se pudo guardar la bobina.");
            setMensaje(editando ? "Bobina actualizada correctamente." : `Bobina creada correctamente. ID: ${datos.id_producto}`); abrirNuevo(); await cargarDatos();
        } catch (requestError) { setError(requestError.message); } finally { setGuardando(false); }
    };
    const darDeBaja = async (producto) => {
        setConfirmation({ action: "delete", producto });
    };
    const eliminarProductoConfirmado = async (producto) => {
        try {
            const respuesta = await fetch(`${API_URL}/api/productos/${producto.id_producto}`, { method: "DELETE" });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.detalle || datos.error || "No se pudo dar de baja la bobina.");
            setMensaje("Bobina dada de baja correctamente."); await cargarDatos();
        } catch (requestError) { setError(requestError.message); }
    };
    const visibles = productos.filter((producto) => `${producto.codigo} ${producto.nombre}`.toLowerCase().includes(busqueda.toLowerCase()));

    return (
        <main className="min-h-screen bg-canvas px-5 py-8 text-ink"><div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-start justify-between gap-4"><div><div className="eyebrow text-brand">ABM · BOBINAS</div><h1 className="m-0 font-barlow text-3xl font-bold text-ink">Bobinas y productos</h1><p className="mt-2 text-sm text-muted-ink">Alta, modificación y baja de productos para producción.</p></div><ActionButton onClick={abrirNuevo}><Plus size={16} /> Nueva bobina</ActionButton></div>
            {(error || mensaje) && <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>{error || mensaje}</div>}
            <section className="mb-5 rounded-lg border border-red-100 border-t-4 border-t-brand bg-white p-5 shadow-card"><div className="mb-4 flex items-center justify-between"><div><div className="eyebrow text-brand">{editando ? "MODIFICAR" : "ALTA"}</div><h2 className="m-0 font-barlow text-xl text-ink">{editando ? "Editar bobina" : "Registrar bobina"}</h2></div>{editando && <button className="text-muted-ink" onClick={abrirNuevo} aria-label="Cancelar edición"><X size={18} /></button>}</div>
                <form onSubmit={guardarProducto} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><label className="field">Código<input name="codigo" value={formulario.codigo} onChange={cambiarCampo} required maxLength={20} placeholder="BOPP-001" /></label><label className="field">Nombre<input name="nombre" value={formulario.nombre} onChange={cambiarCampo} required maxLength={100} placeholder="Bobina BOPP transparente" /></label><label className="field">Tipo<select name="id_tipo_producto" value={formulario.id_tipo_producto} onChange={cambiarCampo} required><option value="">Seleccionar tipo</option>{tiposProducto.map((tipo) => <option key={tipo.id_tipo_producto} value={tipo.id_tipo_producto}>{tipo.descripcion}</option>)}</select></label><label className="field">Material<select name="id_material" value={formulario.id_material} onChange={cambiarCampo} required><option value="">Seleccionar material</option>{materiales.map((material) => <option key={material.id_material} value={material.id_material}>{material.descripcion}</option>)}</select></label><label className="field">Unidad de medida<select name="id_unidad_medida" value={formulario.id_unidad_medida} onChange={cambiarCampo} required><option value="">Seleccionar unidad</option>{unidadesMedida.map((unidad) => <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>{unidad.codigo} - {unidad.descripcion}</option>)}</select></label><label className="flex items-center gap-2 self-end pb-2 text-sm text-ink-soft"><input type="checkbox" name="es_biodegradable" checked={formulario.es_biodegradable} onChange={cambiarCampo} /> Biodegradable</label><div className="flex gap-2 lg:col-span-3"><ActionButton type="submit" disabled={guardando}>{guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear bobina"}</ActionButton>{editando && <ActionButton type="button" variant="secondary" onClick={abrirNuevo}>Cancelar</ActionButton>}</div></form>
            </section>
            <section className="rounded-lg border border-line bg-white p-5 shadow-card"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><div className="eyebrow">REGISTROS</div><h2 className="m-0 font-barlow text-xl text-ink">Bobinas activas</h2></div><div className="flex gap-2"><label className="flex items-center gap-2 rounded-md border border-line px-3 text-sm text-muted-ink"><Search size={15} /><input className="w-40 border-0 py-2 outline-none" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar" /></label><button className="rounded-md border border-line px-3 text-muted-ink" onClick={cargarDatos} aria-label="Actualizar listado"><RefreshCw size={15} /></button></div></div>{cargando ? <p className="py-8 text-center text-sm text-muted-ink">Cargando bobinas...</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-line text-xs uppercase tracking-wider text-muted-ink"><th className="px-3 py-3">Código</th><th className="px-3 py-3">Nombre</th><th className="px-3 py-3">Tipo</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3 text-right">Acciones</th></tr></thead><tbody>{visibles.map((producto) => <tr key={producto.id_producto} className="border-b border-line last:border-0"><td className="px-3 py-3 font-semibold text-brand">{producto.codigo}</td><td className="px-3 py-3">{producto.nombre}</td><td className="px-3 py-3 text-muted-ink">{tiposProducto.find((tipo) => tipo.id_tipo_producto === producto.id_tipo_producto)?.descripcion || "-"}</td><td className="px-3 py-3"><Badge tone="green">Activo</Badge></td><td className="px-3 py-3 text-right"><button className="mr-2 rounded p-2 text-brand hover:bg-brand-softer" onClick={() => editarProducto(producto)} aria-label={`Editar ${producto.codigo}`}><Pencil size={15} /></button><button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => darDeBaja(producto)} aria-label={`Dar de baja ${producto.codigo}`}><Trash2 size={15} /></button></td></tr>)}</tbody></table>{!visibles.length && <p className="py-8 text-center text-sm text-muted-ink">No hay bobinas que coincidan con la búsqueda.</p>}</div>}</section>
            <ConfirmDialog open={Boolean(confirmation)} action={confirmation?.action} onOpenChange={(open) => !open && setConfirmation(null)} onConfirm={async () => { const current = confirmation; setConfirmation(null); if (current.action === "delete") await eliminarProductoConfirmado(current.producto); else await guardarProductoConfirmado(current.payload); }} />
        </div></main>
    );
}
