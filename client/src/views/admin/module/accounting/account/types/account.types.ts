export type Account = {
  idAccount: number;
  name: string;
  type: "CASH" | "BANK" | "WALLET" | "OTHER";
  currency: string;
  balance: number | string;
  is_active: boolean;
  create_at: string;
};

export type AccountCreateDTO = {
  idAccount: number;
  name: string;
  type: "CASH" | "BANK" | "WALLET" | "OTHER" | string;
  currency: string;
  balance: number;
  is_active: boolean;
};

export type AccountUpdateDTO = AccountCreateDTO;