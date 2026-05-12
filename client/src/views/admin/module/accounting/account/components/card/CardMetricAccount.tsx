import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Wallet, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Account } from "../../types/account.types";
import { formatCurrency } from "@/helpers";

type CardMetricAccountProps = {
  loading: boolean;
  accounts: Account[];
};

export const CardMetricAccount = ({
  loading,
  accounts,
}: CardMetricAccountProps) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-sm text-muted-foreground">
          Cargando resumen de cuentas...
        </span>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No hay cuentas disponibles.
        </CardContent>
      </Card>
    );
  }

  const activeAccounts = accounts.filter((account) => account.is_active).length;
  const inactiveAccounts = accounts.filter(
    (account) => !account.is_active,
  ).length;

  const totalBalance = accounts.reduce((sum, account) => {
    return sum + Number(account.balance);
  }, 0);

 

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Cuentas activas
              </p>
              <p className="text-lg md:text-xl font-bold text-green-700 truncate">
                {activeAccounts}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Cuentas inactivas
              </p>
              <p className="text-lg md:text-xl font-bold text-red-700 truncate">
                {inactiveAccounts}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Saldo total
              </p>
              <p className="text-lg md:text-xl font-bold text-blue-700 truncate">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
