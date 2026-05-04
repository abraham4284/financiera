import { z } from "zod";

const moneySchema = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: "El monto debe ser numérico",
  })
  .refine((value) => Number(value) > 0, {
    message: "El monto debe ser mayor a 0",
  });

export const createLoanSchema = z.object({
  loan_number: z.string().min(3).max(30),
  origin_type: z.enum(["ORIGINAL", "REFINANCING", "RESTRUCTURE"]),
  loan_type: z.enum(["FIXED", "WEEKLY", "BIWEEKLY", "MONTHLY", "MENSUAL_LIBRE"]),
  principal_original: moneySchema,
  installments_count: z.number().int().positive(),
  installment_amount: moneySchema,
  disbursement_date: z.string().min(1),
  first_due_date: z.string().min(1),
  currency: z.string().length(3).default("ARS"),
  notes: z.string().optional(),
  idClient: z.number().int().positive(),
  idDisbursementAccount: z.number().int().positive(),
  idGlCategorie: z.number().int().positive(),
  parent_loan_id: z.number().int().positive().nullable().optional(),
  root_loan_id: z.number().int().positive().nullable().optional(),

  guarantors: z
    .array(
      z.object({
        idClient: z.number().int().positive(),
        guarantee_type: z.enum(["PERSONAL", "SOLIDARY", "OTHER"]),
        liability_percentage: moneySchema,
        notes: z.string().optional(),
      })
    )
    .optional(),

  comissions: z
    .array(
      z.object({
        idEmployee: z.number().int().positive(),
        role_in_loan: z.enum(["RECOMMENDER", "COMMISSION_AGENT", "COLLECTOR"]),
        commission_type: z.enum(["PERCENTAGE", "FIXED"]),
        commission_rate: moneySchema,
        commission_base_amount: moneySchema,
        notes: z.string().optional(),
      })
    )
    .optional(),
});