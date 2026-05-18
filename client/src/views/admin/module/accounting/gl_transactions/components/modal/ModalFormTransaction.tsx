import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Decimal } from "decimal.js";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/helpers";

type TransactionType = "EXPENSE" | "TRANSFER" | "ADJUSTMENT";
type EntryType = "CREDIT" | "DEBIT";

type ActionResult = {
  status: boolean;
  message: string;
};

type AccountOption = {
  idAccount: number;
  name: string;
  balance: number;
};

type CategoryOption = {
  idGlCategorie: number;
  name: string;
};

type FormState = {
  operationType: TransactionType;
  transaction_date: string;
  description: string;
  idAccount: string;
  idAccountFrom: string;
  idAccountTo: string;
  idGlCategorie: string;
  entry_type: EntryType;
  amount: string;
  note: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type Props = {
  openModal: boolean;
  loading: boolean;
  accounts: AccountOption[];
  categories: CategoryOption[];
  setOpenModal: (open: boolean) => void;
  closeModal: () => void;
  createExpense: (payload: any) => Promise<ActionResult>;
  createTransfer: (payload: any) => Promise<ActionResult>;
  createAdjustment: (payload: any) => Promise<ActionResult>;
};

const initialForm: FormState = {
  operationType: "EXPENSE",
  transaction_date: new Date().toISOString().split("T")[0],
  description: "",
  idAccount: "",
  idAccountFrom: "",
  idAccountTo: "",
  idGlCategorie: "",
  entry_type: "DEBIT",
  amount: "",
  note: "",
};

export function ModalFormTransaction({
  openModal,
  loading,
  accounts,
  categories,
  setOpenModal,
  closeModal,
  createExpense,
  createTransfer,
  createAdjustment,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.transaction_date) {
      newErrors.transaction_date = "La fecha es obligatoria";
    }

    if (!form.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    // if (!form.idGlCategorie) {
    //   newErrors.idGlCategorie = "La categoría es obligatoria";
    // }

    if (!form.amount) {
      newErrors.amount = "El monto es obligatorio";
    } else {
      try {
        const amountDecimal = new Decimal(form.amount);

        if (amountDecimal.lte(0)) {
          newErrors.amount = "El monto debe ser mayor a cero";
        }
      } catch {
        newErrors.amount = "Ingrese un monto válido";
      }
    }

    if (form.operationType === "EXPENSE") {
      if (!form.idAccount) {
        newErrors.idAccount = "La cuenta es obligatoria";
      }
      if (!form.idGlCategorie) {
        newErrors.idGlCategorie = "La categoría es obligatoria";
      }
    }

    if (form.operationType === "TRANSFER") {
      if (!form.idAccountFrom) {
        newErrors.idAccountFrom = "La cuenta origen es obligatoria";
      }

      if (!form.idAccountTo) {
        newErrors.idAccountTo = "La cuenta destino es obligatoria";
      }

      if (
        form.idAccountFrom &&
        form.idAccountTo &&
        form.idAccountFrom === form.idAccountTo
      ) {
        newErrors.idAccountTo =
          "La cuenta destino no puede ser igual a la cuenta origen";
      }
    }

    if (form.operationType === "ADJUSTMENT") {
      if (!form.idAccount) {
        newErrors.idAccount = "La cuenta es obligatoria";
      }

      if (!form.entry_type) {
        newErrors.entry_type = "El tipo de asiento es obligatorio";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const basePayload = {
      transaction_date: form.transaction_date,
      description: form.description.trim(),
      idGlCategorie: Number(form.idGlCategorie),
      amount: new Decimal(form.amount).toFixed(2),
      note: form.note.trim(),
    };

    if (form.operationType === "EXPENSE") {
      return {
        ...basePayload,
        idAccount: Number(form.idAccount),
      };
    }

    if (form.operationType === "TRANSFER") {
      const dataTransfer = {
        transaction_date: form.transaction_date,
        description: form.description.trim(),
        amount: new Decimal(form.amount).toFixed(2),
        note: form.note.trim(),
        idAccountFrom: Number(form.idAccountFrom),
        idAccountTo: Number(form.idAccountTo),
      };
      return dataTransfer;
    }

    const dataAdjustment = {
      transaction_date: form.transaction_date,
      description: form.description.trim(),
      amount: new Decimal(form.amount).toFixed(2),
      note: form.note.trim(),
      idAccount: Number(form.idAccount),
      entry_type: form.entry_type,
    };

    return dataAdjustment;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return toast.error("Revisá los campos del formulario");
    }

    const payload = buildPayload();
    let result: ActionResult;

    if (form.operationType === "EXPENSE") {
      result = await createExpense(payload);
    } else if (form.operationType === "TRANSFER") {
      result = await createTransfer(payload);
    } else {
      result = await createAdjustment(payload);
    }

    if (result.status) {
      console.log("Ingreso al status");
      toast.success(result.message);
      handleClose();
      return;
    }

    toast.error(result.message || "No se pudo registrar la operación");
  };

  useEffect(() => {
    if (!openModal) {
      resetForm();
    }
  }, [openModal]);

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva operación financiera</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={form.operationType === "EXPENSE" ? "default" : "outline"}
              onClick={() => handleChange("operationType", "EXPENSE")}
            >
              Gasto
            </Button>

            <Button
              type="button"
              variant={
                form.operationType === "TRANSFER" ? "default" : "outline"
              }
              onClick={() => handleChange("operationType", "TRANSFER")}
            >
              Transferencia
            </Button>

            <Button
              type="button"
              variant={
                form.operationType === "ADJUSTMENT" ? "default" : "outline"
              }
              onClick={() => handleChange("operationType", "ADJUSTMENT")}
            >
              Ajuste
            </Button>
          </div>

          <div
            className={
              form.operationType === "ADJUSTMENT" ||
              form.operationType === "TRANSFER"
                ? "grid grid-cols-1 md:grid-cols-1 gap-4"
                : "grid grid-cols-1 md:grid-cols-2 gap-4"
            }
          >
            <FormField error={errors.transaction_date}>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={form.transaction_date}
                onChange={(e) =>
                  handleChange("transaction_date", e.target.value)
                }
              />
            </FormField>

            {form.operationType === "ADJUSTMENT" ||
            form.operationType === "TRANSFER" ? (
              ""
            ) : (
              <FormField error={errors.idGlCategorie}>
                <Label>Categoría</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.idGlCategorie}
                  onChange={(e) =>
                    handleChange("idGlCategorie", e.target.value)
                  }
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option
                      key={category.idGlCategorie}
                      value={category.idGlCategorie}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
          </div>

          {form.operationType === "EXPENSE" && (
            <FormField error={errors.idAccount}>
              <Label>Cuenta</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.idAccount}
                onChange={(e) => handleChange("idAccount", e.target.value)}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.map((account) => (
                  <option key={account.idAccount} value={account.idAccount}>
                    {account.name} - {formatCurrency(account.balance)}{" "}
                    disponible
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {form.operationType === "TRANSFER" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField error={errors.idAccountFrom}>
                <Label>Cuenta origen</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.idAccountFrom}
                  onChange={(e) =>
                    handleChange("idAccountFrom", e.target.value)
                  }
                >
                  <option value="">Seleccionar cuenta origen</option>
                  {accounts.map((account) => (
                    <option key={account.idAccount} value={account.idAccount}>
                      {account.name} - {formatCurrency(account.balance)}{" "}
                      disponible
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField error={errors.idAccountTo}>
                <Label>Cuenta destino</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.idAccountTo}
                  onChange={(e) => handleChange("idAccountTo", e.target.value)}
                >
                  <option value="">Seleccionar cuenta destino</option>
                  {accounts.map((account) => (
                    <option key={account.idAccount} value={account.idAccount}>
                      {account.name} - {formatCurrency(account.balance)}{" "}
                      disponible
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          )}

          {form.operationType === "ADJUSTMENT" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField error={errors.idAccount}>
                <Label>Cuenta</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.idAccount}
                  onChange={(e) => handleChange("idAccount", e.target.value)}
                >
                  <option value="">Seleccionar cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.idAccount} value={account.idAccount}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField error={errors.entry_type}>
                <Label>Tipo de asiento</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.entry_type}
                  onChange={(e) =>
                    handleChange("entry_type", e.target.value as EntryType)
                  }
                >
                  <option value="DEBIT">DEBIT</option>
                  <option value="CREDIT">CREDIT</option>
                </select>
              </FormField>
            </div>
          )}

          <FormField error={errors.amount}>
            <Label>Monto</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 50000.00"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </FormField>

          <FormField error={errors.description}>
            <Label>Descripción</Label>
            <Input
              placeholder="Ej: Pago de alquiler oficina"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormField>

          <div className="space-y-2">
            <Label>Nota</Label>
            <textarea
              className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Observación opcional"
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Registrar operación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Dialog>
  );
}

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
};

function FormField({ children, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
