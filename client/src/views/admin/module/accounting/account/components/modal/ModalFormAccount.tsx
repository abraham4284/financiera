import { useEffect, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@/hooks";
import { NumericFormat } from "react-number-format";
import { Decimal } from "decimal.js";
import { toast, Toaster } from "react-hot-toast";
import { currencies, typesOptions } from "@/views/admin/module/accounting/account/data"

const initialForm = {
  idAccount: null,
  name: "",
  type: "",
  currency: "",
  balance: "",
  is_active: "",
};

type ModalFormAccountProps = {
  openModal: boolean;
  dataEdit: any;
  loading: boolean;
  setOpenModal: (open: boolean) => void;
  createAccount: (
    payload: any,
  ) => Promise<{ status: boolean; message: string }>;
  updateAccount: (
    id: number,
    payload: any,
  ) => Promise<{ status: boolean; message: string }>;
  closeModal: () => void;
  addDataEdit: (data: any) => void;
};

export const ModalFormAccount = ({
  openModal,
  dataEdit,
  loading,
  setOpenModal,
  createAccount,
  closeModal,
  addDataEdit,
}: ModalFormAccountProps) => {
  const {
    idAccount,
    currency,
    is_active,
    type,
    name,
    balance,
    onInputChange,
    onResetForm,
    setFormSate,
    formSate,
  } = useForm(initialForm);

  useEffect(() => {
    if (dataEdit) {
      setFormSate({
        idAccount: dataEdit.idAccount,
        name: dataEdit.name ?? "",
        type: dataEdit.type ?? "",
        currency: dataEdit.currency ?? "",
        balance: String(dataEdit.balance ?? ""),
        is_active: String(dataEdit.is_active ?? ""),
      });
    } else {
      setFormSate(initialForm);
    }
  }, [dataEdit]);

  const resetFormAndDataEdit = () => {
    onResetForm();
    addDataEdit(null);
  };

  const validCurrency = currencies.some((c: any) => c.code === currency) ? currency : "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !balance) {
      return toast.error("Todos los campos son obligatorios");
    }

    const balanceNumber = new Decimal(balance);

    if (balanceNumber.isZero() || balanceNumber.isNegative()) {
      return toast.error("Ingrese un saldo válido mayor a 0");
    }

    // Crear
    if (idAccount === null) {
      const payload = {
        name,
        type,
        currency,
        balance: balanceNumber,
        is_active: is_active === "1" ? true : false,
      };
      const { status, message } = await createAccount(payload);

      if (status) {
        closeModal();
        onResetForm();
        toast.success(message);
      } else {
        toast.error(message || "Error al crear la cuenta.");
      }
      return;
    }

    // Editar
    const payloadUpdate = {
      ...formSate,
      name,
      type,
      currency,
      balance: balanceNumber,
      is_active,
    };
    console.log(payloadUpdate, "payloadUpadte");
    
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dataEdit ? "Editar cuenta" : "Nueva Cuenta"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nombre */}
          <div>
            <Label>Nombre de la cuenta</Label>
            <Input
              name="name"
              value={name}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="balance">
              Tipos <span className="text-red-500">*</span>
            </Label>
            <Select
              value={type}
              onValueChange={(value) =>
                setFormSate({ ...formSate, type: value ? value : "" })
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                {typesOptions.length > 0 ? (
                  typesOptions.map((el) => (
                    <SelectGroup key={el.id}>
                      <SelectItem value={String(el.name)}>{el.name}</SelectItem>
                    </SelectGroup>
                  ))
                ) : (
                  <SelectGroup>
                    <SelectLabel>Sin datos</SelectLabel>
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="balance">
              Tipos de moneda <span className="text-red-500">*</span>
            </Label>
            <Select
              value={validCurrency}
              onValueChange={(value) =>
                setFormSate({ ...formSate, currency: value ? value : "" })
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                {currencies.length > 0 ? (
                  currencies.map((el) => (
                    <SelectGroup key={el.code}>
                      <SelectItem value={String(el.code)}>
                        {el.name}
                      </SelectItem>
                    </SelectGroup>
                  ))
                ) : (
                  <SelectGroup>
                    <SelectLabel>Sin datos</SelectLabel>
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Saldo con NumericFormat */}
          <div>
            <Label>Saldo inicial</Label>
            <NumericFormat
              value={balance}
              inputMode="decimal"
              thousandSeparator="."
              decimalSeparator=","
              allowedDecimalSeparators={[","]}
              decimalScale={2}
              allowNegative={false}
              allowLeadingZeros={false}
              onValueChange={(values) => {
                setFormSate({
                  ...formSate,
                  balance: values.value, // ← GUARDAR SIEMPRE ESTE
                });
              }}
              className="mt-2 border rounded-md p-2 w-full"
              disabled={loading}
              placeholder="Ej: 1.372.342,28"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Activo</Label>
            <Select
              value={is_active}
              onValueChange={(value) =>
                setFormSate({ ...formSate, is_active: value ? "1" : "0" })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Seleccione una opcion</SelectLabel>
                  <SelectItem value={"1"}>Activo</SelectItem>
                  <SelectItem value={"0"}>Inactivo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className={dataEdit ? "bg-yellow-500" : "bg-blue-500"}
            >
              {loading ? <Spinner /> : dataEdit ? "Confirmar" : "Crear"}
            </Button>

            <DialogClose>
              <Button variant="outline" onClick={resetFormAndDataEdit}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
        <Toaster position="top-right" reverseOrder={false} />
      </DialogContent>
    </Dialog>
  );
};
