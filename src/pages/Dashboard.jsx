import { useState } from "react";
import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import Overview from "@/components/dashboard/Overview";
import Production from "@/components/dashboard/Production";
import Warehouse from "@/components/dashboard/Warehouse";
import Dispatch from "@/components/dashboard/Dispatch";
import Orders from "@/components/dashboard/Orders";
import Reports from "@/components/dashboard/Reports";
import ITAdmin from "@/components/dashboard/itadmin/ITAdmin";
import { clients as initialClients } from "@/data/mockData";
import Clients from "@/components/dashboard/Clients";
import DeliveryHistory from "@/components/dashboard/DeliveryHistory";

const initialOrders = [
  { numero: "PED-10492", cliente: "Plásticos del Sur", producto: "Bolsa con manija 40x50 cm", volumen: "18 bultos", entrega: "Hoy · 14:00", estado: "Listo para producción" },
  { numero: "PED-10488", cliente: "Mayorista Centro", producto: "Bobina BOPP transparente", volumen: "42 bultos", entrega: "Hoy · 16:30", estado: "En preparación" },
  { numero: "PED-10476", cliente: "Distribuidora Norte", producto: "Bolsa adhesiva 20x30 cm", volumen: "26 bultos", entrega: "Mañana · 08:00", estado: "Confirmado" },
  { numero: "PED-10471", cliente: "Envases del Litoral", producto: "Bolsa consorcio 90 L", volumen: "12 bultos", entrega: "Mañana · 10:30", estado: "Pendiente de crédito" },
];

export default function Dashboard({ role, setRole, setLogged }) {
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState(() => initialClients.map((client) => ({ ...client, email: "", phone: "" })));
  const [orders, setOrders] = useState(initialOrders);
  const [warehouseOrders, setWarehouseOrders] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [productionMaterials] = useState([]);
  const [dispatchMaterials, setDispatchMaterials] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);

  const navigate = (id) => {
    setActive(id);
  };

  const fakeAction = (message) => {
    toast.success(message);
  };

  const renderContent = () => {
    switch (active) {
      case "overview":
        return (
          <Overview
            navigate={navigate}
            fakeAction={fakeAction}
          />
        );

      case "production":
        return <Production fakeAction={fakeAction} incomingOrders={productionOrders} incomingMaterials={productionMaterials} onSendToWarehouse={(rows) => setWarehouseOrders((current) => [...current, ...rows.filter((row) => !current.some((item) => item.id === row.id))])} />;

      case "warehouse":
        return <Warehouse fakeAction={fakeAction} incomingOrders={warehouseOrders} onSendToDispatch={(rows) => setDispatchMaterials((current) => [...current, ...rows.filter((row) => !current.some((item) => item.id === row.id))])} />;

      case "dispatch":
        return <Dispatch fakeAction={fakeAction} clients={clients} incomingMaterials={dispatchMaterials} onSendToHistory={(routes) => setCompletedDeliveries((current) => [...current, ...routes.filter((route) => !current.some((item) => item[0] === route[0]))])} />;
        case "history":
          return <DeliveryHistory completedDeliveries={completedDeliveries} />;

      case "orders":
        return (
          <Orders
            fakeAction={fakeAction}
            query={query}
            clients={clients}
            setClients={setClients}
            orders={orders}
            setOrders={setOrders}
            onSendToProduction={(order) => setProductionOrders((current) => current.some((item) => item.numero === order.numero) ? current : [...current, order])}
          />
        );

      case "clients":
        return <Clients clients={clients} setClients={setClients} />;

      case "reports":
        return <Reports />;

      case "itadmin":
        return <ITAdmin />;

      default:
        return (
          <Overview
            navigate={navigate}
            fakeAction={fakeAction}
          />
        );
    }
  };

  return (
    <AppShell
      active={active}
      navigate={navigate}
      role={role}
      setRole={setRole}
      setLogged={setLogged}
      fakeAction={fakeAction}
      setQuery={setQuery}
    >
      {renderContent()}
    </AppShell>
  );
}