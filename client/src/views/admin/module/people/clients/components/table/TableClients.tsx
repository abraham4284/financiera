import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "../../types/client.types";

type Props = {
  data: Client[];
  loading: boolean;
  addDataEdit: (client: Client | null) => void;
  toggleModal: () => void;
  toggleClientStatus: (
    id: number,
    payload: { is_active: boolean | 0 | 1 }
  ) => Promise<{ status: boolean; message: string }>;
};

export function TableClients({
  data,
  loading,
  addDataEdit,
  toggleModal,
  toggleClientStatus,
}: Props) {
  const handleEdit = (client: Client) => {
    addDataEdit(client);
    toggleModal();
  };

  const handleToggleStatus = async (client: Client) => {
    const newStatus = Boolean(client.is_active) ? 0 : 1;

    await toggleClientStatus(client.idClient, {
      is_active: newStatus,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-muted-foreground">
        No hay clientes registrados.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>DNI</TableHead>
          <TableHead>CUIL</TableHead>
          <TableHead>Fecha nacimiento</TableHead>
          <TableHead>Máximo endeudamiento</TableHead>
          <TableHead>Zona</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((client) => (
          <TableRow key={client.idClient}>
            <TableCell>
              {client.first_name} {client.last_name}
            </TableCell>
            <TableCell>{client.dni}</TableCell>
            <TableCell>{client.cuil}</TableCell>
            <TableCell>{client.birth_date || "-"}</TableCell>
            <TableCell>${client.maximum_indebtedness}</TableCell>
            <TableCell>{client.zone_name || client.idZone}</TableCell>
            <TableCell>
              {Boolean(client.is_active) ? "Activo" : "Inactivo"}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleEdit(client)}
              >
                Editar
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(client)}
              >
                {Boolean(client.is_active) ? "Desactivar" : "Activar"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}