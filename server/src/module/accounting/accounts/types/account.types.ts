export type AccountType =
  | "CASH"
  | "BANK"
  | "WALLET"
  | "OTHER"
  | "LOAN_RECEIVABLE"
  | "EQUITY";

export interface Account {
  idAccount: number;
  name: string;
  type: AccountType;
  currency: string;
  balance: string;
  is_active: 0 | 1;
  created_at: string;
}

export interface CreateAccountDTO {
  name: string;
  type: AccountType;
  currency: string;
  balance: string;
}

export interface UpdateAccountDTO {
  name: string;
  type: AccountType;
  currency: string;
}

export interface ToggleAccountStatusDTO {
  is_active: 0 | 1;
}