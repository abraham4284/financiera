import { z } from "zod";

export const zoneIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID de zona inválido"),
});

export const createZoneSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  description: z
    .string()
    .max(255, "La descripción no puede superar los 255 caracteres")
    .nullable()
    .optional(),
});

export const updateZoneSchema = createZoneSchema;

export const toggleZoneStatusSchema = z.object({
  is_active: z.union([z.literal(0), z.literal(1)]),
});