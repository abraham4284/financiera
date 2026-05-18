export type GlSourceModule =
  | "LOAN"
  | "LOAN_PAYMENT"
  | "TRANSFER"
  | "MANUAL"
  | "ADJUSTMENT"
  | "OTHER";

export type GlEntryType = "DEBIT" | "CREDIT";

export type GlTransactionStatus = "POSTED" | "CANCELLED";

export interface CreateExpenseDTO {
  transaction_date: string;
  description: string;
  idAccount: number;
  idGlCategorie: number;
  amount: string;
  note?: string;
}

export interface CreateTransferDTO {
  transaction_date: string;
  description: string;
  idAccountFrom: number;
  idAccountTo: number;
  idGlCategorie?: number;
  amount: string;
  note?: string;
}

export interface CreateAdjustmentDTO {
  transaction_date: string;
  description: string;
  idAccount: number;
  idGlCategorie?: number;
  entry_type: GlEntryType;
  amount: string;
  note?: string;
}

export interface GlTransaction {
  idGlTransaction: number;
  transaction_date: string;
  description: string;
  source_module: GlSourceModule;
  source_id: number | null;
  status: GlTransactionStatus;
  created_at: string;
}