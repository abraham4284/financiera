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
import { toast, Toaster } from "react-hot-toast";
import { natureTypes } from "../../data/nature";

const initialForm = {
  idGlCategorie: null,
  name: "",
  nature: "",
  is_active: "",
};

type ModalFormAccountProps = {
  openModal: boolean;
  dataEdit: any;
  loading: boolean;
  setOpenModal: (open: boolean) => void;
  createCategory: (
    payload: any,
  ) => Promise<{ status: boolean; message: string }>;
  updateCategory: (
    id: number,
    payload: any,
  ) => Promise<{ status: boolean; message: string }>;
  closeModal: () => void;
  addDataEdit: (data: any) => void;
};

export const ModalFormCategory = ({
  openModal,
  dataEdit,
  loading,
  setOpenModal,
  createCategory,
  updateCategory,
  closeModal,
  addDataEdit,
}: ModalFormAccountProps) => {
  const {
    idGlCategorie,
    name,
    nature,
    is_active,
    onInputChange,
    onResetForm,
    setFormSate,
    formSate,
  } = useForm(initialForm);

  useEffect(() => {
    if (dataEdit) {
      setFormSate({
        idGlCategorie: dataEdit.idGlCategorie,
        name: dataEdit.name ?? "",
        nature: dataEdit.nature ?? "",
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !nature || !is_active) {
      return toast.error("Todos los campos son obligatorios");
    }

    if (idGlCategorie === null) {
      const payload = {
        name,
        nature,
        is_active: is_active === "1" ? 1 : 0,
      };
      const { status, message } = await createCategory(payload);

      if (status) {
        closeModal();
        onResetForm();
        toast.success(message);
      } else {
        toast.error(message || "Error al crear la categoría.");
      }
      return;
    } else {
      // Editar

      const payload = {
        ...formSate,
        name,
        nature,
        is_active: is_active === "1" ? 1 : 0,
      };
      const { status, message } = await updateCategory(idGlCategorie, payload);

      if (status) {
        closeModal();
        onResetForm();
        toast.success(message);
      } else {
        toast.error(message || "Error al editar la categoria.");
      }
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dataEdit ? "Editar categoría" : "Nueva Categoría"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nombre */}
          <div>
            <Label>Nombre de la categoría</Label>
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
              Naturaleza <span className="text-red-500">*</span>
            </Label>
            <Select
              value={nature}
              onValueChange={(value) =>
                setFormSate({ ...formSate, nature: value ? value : "" })
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                {natureTypes.length > 0 ? (
                  natureTypes.map((el) => (
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

          {/* Saldo con NumericFormat */}

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

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetFormAndDataEdit();
                closeModal();
              }}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : dataEdit
                  ? "Actualizar Categoria"
                  : "Crear Categoria"}
            </Button>
          </DialogFooter>
        </form>
        <Toaster position="top-right" reverseOrder={false} />
      </DialogContent>
    </Dialog>
  );
};
