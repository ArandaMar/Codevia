import RoleCard from "./RoleCard";
import { roleOptions } from "@/data/mockData";

const roleOrder = ["production", "admin", "operator", "warehouse", "forklift", "it"];

export default function RoleGrid({ role, setRole }) {
  return (
    <div className="mb-4 grid gap-2.5">
      {roleOrder.map((roleId) => roleOptions.find((r) => r.id === roleId)).map((r) => (
        <RoleCard
          key={r.id}
          roleItem={r}
          selected={role.id === r.id}
          onSelect={() => setRole(r)}
        />
      ))}
    </div>
  );
}
