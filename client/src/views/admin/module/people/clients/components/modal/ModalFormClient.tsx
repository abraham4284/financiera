import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

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

import { clientFormSchema } from "../../validation/client.schema";
import type {
  Client,
  ClientCreateDTO,
  ClientUpdateDTO,
} from "../../types/client.types";
import type { Zone } from "@/views/admin/module/zones/zones/types/zone.types";

type ActionResult = {
  status: boolean;
  message: string;
  errors?: Record<string, string>;
};

type FormState = {
  idClient: number | null;
  first_name: string;
  last_name: string;
  dni: string;
  cuil: string;
  birth_date: string;
  observations: string;
  maximum_indebtedness: string;
  idZone: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type Props = {
  openModal: boolean;
  loading: boolean;
  dataEdit: Client | null;
  zones: Zone[];
  setOpenModal: (open: boolean) => void;
  closeModal: () => void;
  addDataEdit: (client: Client | null) => void;
  createClient: (payload: ClientCreateDTO) => Promise<ActionResult>;
  updateClient: (id: number, payload: ClientUpdateDTO) => Promise<ActionResult>;
};

const initialForm: FormState = {
  idClient: null,
  first_name: "",
  last_name: "",
  dni: "",
  cuil: "",
  birth_date: "",
  observations: "",
  maximum_indebtedness: "",
  idZone: "",
};

export function ModalFormClient({
  openModal,
  loading,
  dataEdit,
  zones,
  setOpenModal,
  closeModal,
  addDataEdit,
  createClient,
  updateClient,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (
    field: keyof FormState,
    value: string,
    nextForm?: FormState,
  ) => {
    if (field === "idClient") return;

    const formToValidate = nextForm || {
      ...form,
      [field]: value,
    };

    const result = clientFormSchema.safeParse({
      first_name: formToValidate.first_name,
      last_name: formToValidate.last_name,
      dni: formToValidate.dni,
      cuil: formToValidate.cuil,
      birth_date: formToValidate.birth_date,
      observations: formToValidate.observations,
      maximum_indebtedness: formToValidate.maximum_indebtedness,
      idZone: formToValidate.idZone,
    });

    if (result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      return;
    }

    const fieldError = result.error.issues.find(
      (issue: any) => issue.path[0] === field,
    );

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError?.message,
    }));
  };

  const validateForm = (): boolean => {
    const result = clientFormSchema.safeParse({
      first_name: form.first_name,
      last_name: form.last_name,
      dni: form.dni,
      cuil: form.cuil,
      birth_date: form.birth_date,
      observations: form.observations,
      maximum_indebtedness: form.maximum_indebtedness,
      idZone: form.idZone,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};

    result.error.issues.forEach((issue: any) => {
      const field = issue.path[0] as keyof FormState;
      fieldErrors[field] = issue.message;
    });

    setErrors(fieldErrors);

    return false;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const nextForm = {
      ...form,
      [field]: value,
    };

    setForm(nextForm);
    validateField(field, value, nextForm);
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    addDataEdit(null);
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const buildPayload = (): ClientCreateDTO => {
    return {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      dni: form.dni.trim(),
      cuil: form.cuil.trim(),
      birth_date: form.birth_date.trim(),
      observations: form.observations.trim(),
      maximum_indebtedness: Number(form.maximum_indebtedness).toFixed(2),
      idZone: Number(form.idZone),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return toast.error("Revisá los campos del formulario");
    }

    const payload = buildPayload();

    const result =
      form.idClient === null
        ? await createClient(payload)
        : await updateClient(form.idClient, payload);

    if (result.status) {
      toast.success(result.message);
      handleClose();
      return;
    }

    if (result.errors) {
      setErrors(result.errors as FormErrors);
    }

    toast.error(result.message || "No se pudo guardar el cliente");
  };

  useEffect(() => {
    if (dataEdit) {
      setForm({
        idClient: dataEdit.idClient,
        first_name: dataEdit.first_name || "",
        last_name: dataEdit.last_name || "",
        dni: dataEdit.dni || "",
        cuil: dataEdit.cuil || "",
        birth_date: dataEdit.birth_date || "",
        observations: dataEdit.observations || "",
        maximum_indebtedness: String(dataEdit.maximum_indebtedness || ""),
        idZone: String(dataEdit.idZone || ""),
      });

      setErrors({});
    }
  }, [dataEdit]);

  useEffect(() => {
    if (!openModal) {
      resetForm();
    }
  }, [openModal]);

  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) return;
    const timer = setTimeout(() => {
      setErrors({});
    }, 4000);
    return () => clearTimeout(timer);
  }, [errors]);

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {form.idClient ? "Actualizar cliente" : "Nuevo cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={errors.first_name}>
              <Label>Nombre</Label>
              <Input
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="Ej: Martin"
              />
            </FormField>

            <FormField error={errors.last_name}>
              <Label>Apellido</Label>
              <Input
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="Ej: Diaz"
              />
            </FormField>

            <FormField error={errors.dni}>
              <Label>DNI</Label>
              <Input
                value={form.dni}
                onChange={(e) => handleChange("dni", e.target.value)}
                placeholder="Ej: 40123456"
              />
            </FormField>

            <FormField error={errors.cuil}>
              <Label>CUIL</Label>
              <Input
                value={form.cuil}
                onChange={(e) => handleChange("cuil", e.target.value)}
                placeholder="Ej: 20-40123456-3"
              />
            </FormField>

            <FormField error={errors.birth_date}>
              <Label>Fecha nacimiento</Label>
              <Input
                type="date"
                value={form.birth_date}
                onChange={(e) => handleChange("birth_date", e.target.value)}
              />
            </FormField>

            <FormField error={errors.maximum_indebtedness}>
              <Label>Máximo endeudamiento</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.maximum_indebtedness}
                onChange={(e) =>
                  handleChange("maximum_indebtedness", e.target.value)
                }
                placeholder="Ej: 500000.00"
              />
            </FormField>

            <FormField error={errors.idZone}>
              <Label>Zona</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.idZone}
                onChange={(e) => handleChange("idZone", e.target.value)}
              >
                <option value="">Seleccionar zona</option>
                {zones.map((zone) => (
                  <option key={zone.idZone} value={zone.idZone}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <textarea
              className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Observación opcional"
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleClose}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : form.idClient
                  ? "Actualizar cliente"
                  : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Toaster position="top-right" />
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
