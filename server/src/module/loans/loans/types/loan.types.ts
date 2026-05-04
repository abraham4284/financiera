export type LoanType =
  | "FIXED"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "MENSUAL_LIBRE";

export type OriginType = "ORIGINAL" | "REFINANCING" | "RESTRUCTURE";

export interface LoanGuarantorDTO {
  idClient: number;
  guarantee_type: "PERSONAL" | "SOLIDARY" | "OTHER";
  liability_percentage: string;
  notes?: string;
}

export interface LoanComissionDTO {
  idEmployee: number;
  role_in_loan: "RECOMMENDER" | "COMMISSION_AGENT" | "COLLECTOR";
  commission_type: "PERCENTAGE" | "FIXED";
  commission_rate: string;
  commission_base_amount: string;
  notes?: string;
}

export interface CreateLoanDTO {
  loan_number: string;
  origin_type: OriginType;
  loan_type: LoanType;
  principal_original: string;
  installments_count: number;
  installment_amount: string;
  disbursement_date: string;
  first_due_date: string;
  currency: string;
  notes?: string;
  idClient: number;
  idDisbursementAccount: number;
  idGlCategorie: number;
  parent_loan_id?: number | null;
  root_loan_id?: number | null;
  guarantors?: LoanGuarantorDTO[];
  comissions?: LoanComissionDTO[];
}