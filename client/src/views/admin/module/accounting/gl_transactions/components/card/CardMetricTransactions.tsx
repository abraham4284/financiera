import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GlTransaction } from "../../types/transaction.types";

type Props = {
  transactions: GlTransaction[];
  loading: boolean;
};

export function CardMetricTransactions({ transactions, loading }: Props) {
  const total = transactions.length;
  const active = transactions.filter((el) => el.status === "ACTIVE").length;
  const manual = transactions.filter((el) =>
    el.source_module?.includes("MANUAL")
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{loading ? "..." : total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{loading ? "..." : active}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Manuales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{loading ? "..." : manual}</p>
        </CardContent>
      </Card>
    </div>
  );
}