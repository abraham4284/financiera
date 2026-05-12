import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers";

type TableAccountProps = {
  loading: boolean;
  data: any[];
  deleteAccount?: (id: number) => Promise<void>;
  addDataEdit: (data: any) => void;
  toggleModal: () => void;
};

export const TableAccount = ({
  loading,
  data,
  // deleteAccount,
  addDataEdit,
  toggleModal,
}: TableAccountProps) => {
  return (
    <Table>
      <TableCaption>Lista de cuentas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Moneda</TableHead>
          <TableHead>Saldo</TableHead>
          <TableHead>Activa</TableHead>
          <TableHead>Creada</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center">
              <Spinner />
            </TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((el) => (
            <TableRow key={el.idAccount}>
              <TableCell className="font-medium">{el.name}</TableCell>
              <TableCell className="font-medium">{el.type}</TableCell>
              <TableCell className="font-medium">{el.currency}</TableCell>
              <TableCell>{formatCurrency(el.balance)}</TableCell>
              <TableCell className="font-medium">{el.is_active ? "Activo": "Inactivo"}</TableCell>
              <TableCell className="font-medium">{el.created_at}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    className="bg-yellow-500 cursor-pointer"
                    onClick={() => {
                      addDataEdit(el);
                      toggleModal();
                    }}
                  >
                    <Pencil color="white" strokeWidth={2.5} />
                  </Button>

                  {/* <Button
                    className="bg-red-600 cursor-pointer"
                    onClick={async () => await deleteAccount(el.idAccount)}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <Trash color="white" strokeWidth={2.5} />
                    )}
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center font-medium">
              Sin datos
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
