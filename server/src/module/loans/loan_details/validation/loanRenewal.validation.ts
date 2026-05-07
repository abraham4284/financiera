import { z } from "zod";

const moneySchema = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: "Debe ser un número válido",
  })
  .refine((value) => Number(value) >= 0, {
    message: "No puede ser negativo",
  });

export const createLoanRenewalSchema = z.object({
  loan_id: z.number().int().positive(),
  current_loan_detail_id: z.number().int().positive(),

  new_principal: moneySchema.refine((value) => Number(value) > 0, {
    message: "El nuevo capital debe ser mayor a 0",
  }),

  new_interest_rate: moneySchema,
  new_total_due: moneySchema.refine((value) => Number(value) > 0, {
    message: "El nuevo total debe ser mayor a 0",
  }),

  new_due_date: z.string().min(1, "La nueva fecha de vencimiento es obligatoria"),
  notes: z.string().max(255).optional(),
  allow_principal_increase: z.boolean().optional().default(false),
});