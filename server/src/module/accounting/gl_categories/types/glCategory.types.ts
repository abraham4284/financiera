export type GlCategoryNature = "INCOME" | "EXPENSE";

export interface GlCategory {
  idGlCategorie: number;
  name: string;
  description: string | null;
  nature: GlCategoryNature;
  is_system: 0 | 1;
  is_active: 0 | 1;
  created_at: string;
}

export interface CreateGlCategoryDTO {
  name: string;
  description?: string | null;
  nature: GlCategoryNature;
}

export interface UpdateGlCategoryDTO {
  name: string;
  description?: string | null;
  nature: GlCategoryNature;
}

export interface ToggleGlCategoryStatusDTO {
  is_active: 0 | 1;
}