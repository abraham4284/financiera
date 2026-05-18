import { z } from "zod";

const onlyNumbersOrEmpty = /^[0-9]*$/;
const cuilRegex = /^\d{2}-\d{8}-\d{1}$/;

export const clientFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  last_name: z
    .string()
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede superar los 100 caracteres"),

  dni: z
    .string()
    .trim()
    .regex(onlyNumbersOrEmpty, "El DNI solo debe contener números")
    .max(20, "El DNI no puede superar los 20 caracteres")
    .optional(),

  cuil: z
    .string()
    .trim()
    .regex(cuilRegex, "El CUIL debe tener formato válido. Ej: 20-40123456-3")
    .max(20, "El CUIL no puede superar los 20 caracteres")
    .optional(),

  birth_date: z
    .string()
    .trim()
    .max(45, "La fecha de nacimiento no puede superar los 45 caracteres")
    .optional(),

  observations: z.string().optional(),

  maximum_indebtedness: z
    .string()
    .trim()
    .min(1, "El máximo de endeudamiento es obligatorio")
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Ingrese un monto válido",
    })
    .refine((value) => Number(value) >= 0, {
      message: "El máximo de endeudamiento no puede ser negativo",
    }),

  idZone: z
    .string()
    .min(1, "La zona es obligatoria")
    .refine((value) => Number(value) > 0, {
      message: "Seleccione una zona válida",
    }),
});

export type ClientFormSchema = z.infer<typeof clientFormSchema>;