export type Category = {
  idGlCategorie: number;
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER";
  is_active: boolean;
  is_system: boolean;
  create_at: string;
};

export type CategoryCreateDTO = {
  idGlCategorie: number;
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER";
  is_active: boolean;
};

export type CategoryUpdateDTO = CategoryCreateDTO;
