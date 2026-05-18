export type GlSourceModule =
  | "MANUAL_EXPENSE"
  | "MANUAL_TRANSFER"
  | "MANUAL_ADJUSTMENT"
  | "LOAN"
  | "LOAN_PAYMENT"
  | "VOID_LOAN"
  | string;

export type GlTransactionStatus = "ACTIVE" | "VOIDED" | "CANCELLED" | string;

export interface GlTransaction {
  idGlTransaction: number;
  transaction_date: string;
  description: string;
  source_module: GlSourceModule;
  source_id: number | null;
  status: GlTransactionStatus;
  created_at: string;
}

export interface CreateExpenseDTO {
  transaction_date: string;
  description: string;
  idAccount: number;
  idGlCategorie: number;
  amount: number;
}

export interface CreateTransferDTO {
  transaction_date: string;
  description: string;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

export interface CreateAdjustmentDTO {
  transaction_date: string;
  description: string;
  idAccount: number;
  adjustment_type: "INCREASE" | "DECREASE";
  amount: number;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface ApiMessageResponse {
  status: boolean;
  message: string;
}