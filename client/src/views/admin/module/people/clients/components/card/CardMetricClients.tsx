import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Client } from "../../types/client.types";

type Props = {
  clients: Client[];
  loading: boolean;
};

export function CardMetricClients({ clients, loading }: Props) {
  const total = clients.length;
  const active = clients.filter((client) => Boolean(client.is_active)).length;
  const inactive = total - active;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{loading ? "..." : total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{loading ? "..." : active}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{loading ? "..." : inactive}</p>
        </CardContent>
      </Card>
    </div>
  );
}