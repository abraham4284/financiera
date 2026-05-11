import { pool } from "@db/db.js";
import {
  CreateGlCategoryDTO,
  ToggleGlCategoryStatusDTO,
  UpdateGlCategoryDTO,
} from "../types/glCategory.types.js";

export async function createGlCategoryService(data: CreateGlCategoryDTO) {
  const [result]: any = await pool.query(
    "CALL sp_gl_categories_create(?, ?, ?, @idGlCategorie)",
    [data.name, data.description ?? null, data.nature],
  );

  const [rows]: any = await pool.query(
    "SELECT @idGlCategorie AS idGlCategorie",
  );

  return {
    category: result[0]?.[0] ?? null,
    idGlCategorie: rows[0]?.idGlCategorie ?? null,
  };
}

export async function getGlCategoriesService(onlyActive = true) {
  const [rows]: any = await pool.query("CALL sp_gl_categories_get_all(?)", [
    onlyActive ? 1 : 0,
  ]);

  return rows[0];
}

export async function getGlCategoryByIdService(idGlCategorie: number) {
  const [rows]: any = await pool.query("CALL sp_gl_categories_get_by_id(?)", [
    idGlCategorie,
  ]);

  return rows[0]?.[0] ?? null;
}

export async function updateGlCategoryService(
  idGlCategorie: number,
  data: UpdateGlCategoryDTO,
) {
  const [rows]: any = await pool.query(
    "CALL sp_gl_categories_update(?, ?, ?, ?)",
    [idGlCategorie, data.name, data.description ?? null, data.nature],
  );

  return rows[0]?.[0] ?? null;
}

export async function toggleGlCategoryStatusService(
  idGlCategorie: number,
  data: ToggleGlCategoryStatusDTO,
) {
  const [rows]: any = await pool.query(
    "CALL sp_gl_categories_toggle_status(?, ?)",
    [idGlCategorie, data.is_active],
  );

  return rows[0]?.[0] ?? null;
}