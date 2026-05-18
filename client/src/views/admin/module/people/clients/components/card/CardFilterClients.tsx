import React from "react";
import { Input } from "@/components/ui/input";

type Props = {
  handleFilterInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CardFilterClients({ handleFilterInput }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Input
        placeholder="Buscar por nombre, apellido, DNI, CUIL o zona..."
        onChange={handleFilterInput}
      />
    </div>
  );
}