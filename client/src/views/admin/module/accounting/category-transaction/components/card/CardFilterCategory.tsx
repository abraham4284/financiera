import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";

type CardFilterAccountProps = {
  handleFilterInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CardFilterCategory = ({
  handleFilterInput,
}: CardFilterAccountProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre o efecto..."
                  onChange={handleFilterInput}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
