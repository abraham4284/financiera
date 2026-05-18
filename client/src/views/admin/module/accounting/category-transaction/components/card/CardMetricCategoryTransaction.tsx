import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FolderKanban, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Category } from "../../types/category.types";

type CardMetricCategoryTransactionProps = {
  loading: boolean;
  category: Category[];
};

export const CardMetricCategoryTransaction = ({
  loading,
  category,
}: CardMetricCategoryTransactionProps) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-sm text-muted-foreground">
          Cargando resumen de categorías...
        </span>
      </div>
    );
  }

  if (!category || category.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No hay categorías disponibles.
        </CardContent>
      </Card>
    );
  }

  const totalCategories = category.length;
  const activeCategories = category.filter((item) => item.is_active).length;
  const inactiveCategories = category.filter((item) => !item.is_active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-violet-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-100 rounded-xl">
              <FolderKanban className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Total categorías
              </p>
              <p className="text-lg md:text-xl font-bold text-violet-700 truncate">
                {totalCategories}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium">
                Categorías activas
              </p>
              <p className="text-lg md:text-xl font-bold text-green-700 truncate">
                {activeCategories}
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
                Categorías inactivas
              </p>
              <p className="text-lg md:text-xl font-bold text-red-700 truncate">
                {inactiveCategories}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};