import { Input } from "@/components/ui/input";

type Props = {
  handleFilterInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CardFilterTransactions({ handleFilterInput }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Input
        placeholder="Buscar por descripción, origen o estado..."
        onChange={handleFilterInput}
      />
    </div>
  );
}