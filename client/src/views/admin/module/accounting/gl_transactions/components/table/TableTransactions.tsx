import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import type { GlTransaction } from "../../types/transaction.types";

type Props = {
  data: GlTransaction[];
  loading: boolean;
};

export function TableTransactions({ data, loading }: Props) {
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
        No hay transacciones registradas.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Referencia</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((transaction) => (
          <TableRow key={transaction.idGlTransaction}>
            <TableCell>{transaction.idGlTransaction}</TableCell>
            <TableCell>{transaction.transaction_date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.source_module}</TableCell>
            <TableCell>{transaction.source_id ?? "-"}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>{transaction.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}