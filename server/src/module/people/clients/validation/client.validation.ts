import { z } from "zod";

const onlyNumbersOrEmpty = /^[0-9]*$/;
const cuilRegex = /^([0-9]{2}-?[0-9]{8}-?[0-9]{1})?$/;

const moneySchema = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: "El límite de endeudamiento debe ser numérico",
  })
  .refine((value) => Number(value) >= 0, {
    message: "El límite de endeudamiento no puede ser negativo",
  });

export const clientIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID de cliente inválido"),
});

export const createClientSchema = z.object({
  first_name: z.string().min(2, "El nombre es obligatorio").max(100),
  last_name: z.string().min(2, "El apellido es obligatorio").max(100),

  dni: z
    .string()
    .regex(onlyNumbersOrEmpty, "El DNI solo debe contener números")
    .max(20)
    .nullable()
    .optional(),

  cuil: z
    .string()
    .regex(cuilRegex, "El CUIL debe tener formato válido")
    .max(20)
    .nullable()
    .optional(),

  birth_date: z.string().max(45).nullable().optional(),

  maximum_indebtedness: moneySchema,

  idZone: z.number().int().positive("La zona es obligatoria"),
});

export const updateClientSchema = createClientSchema;

export const toggleClientStatusSchema = z.object({
  is_active: z.union([z.literal(0), z.literal(1)]),
});