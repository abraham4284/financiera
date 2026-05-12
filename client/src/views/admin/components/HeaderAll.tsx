import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type HeaderAllProps = {
  handleCreate?: () => void;
  title: string;
  subTitle?: string;
  btnInfo: string;
};

export const HeaderAll = ({
  handleCreate,
  title,
  subTitle,
  btnInfo,
}: HeaderAllProps) => {
  return (
    <>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm md:text-base">{subTitle}</p>
      </div>
      <Button
        onClick={handleCreate}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{btnInfo}</span>
        <span className="sm:hidden">Nueva</span>
      </Button>
    </>
  );
};
