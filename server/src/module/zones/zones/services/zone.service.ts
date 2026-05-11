import { pool } from "@db/db.js";
import {
  CreateZoneDTO,
  ToggleZoneStatusDTO,
  UpdateZoneDTO,
} from "../types/zone.types.js";

export async function createZoneService(data: CreateZoneDTO) {
  const [result]: any = await pool.query(
    "CALL sp_zones_create(?, ?, @idZone)",
    [data.name, data.description ?? null],
  );

  const [rows]: any = await pool.query("SELECT @idZone AS idZone");

  return {
    zone: result[0]?.[0] ?? null,
    idZone: rows[0]?.idZone ?? null,
  };
}

export async function getZonesService(onlyActive = true) {
  const [rows]: any = await pool.query("CALL sp_zones_get_all(?)", [
    onlyActive ? 1 : 0,
  ]);

  return rows[0];
}

export async function getZoneByIdService(idZone: number) {
  const [rows]: any = await pool.query("CALL sp_zones_get_by_id(?)", [idZone]);

  return rows[0]?.[0] ?? null;
}

export async function updateZoneService(
  idZone: number,
  data: UpdateZoneDTO,
) {
  const [rows]: any = await pool.query("CALL sp_zones_update(?, ?, ?)", [
    idZone,
    data.name,
    data.description ?? null,
  ]);

  return rows[0]?.[0] ?? null;
}

export async function toggleZoneStatusService(
  idZone: number,
  data: ToggleZoneStatusDTO,
) {
  const [rows]: any = await pool.query("CALL sp_zones_toggle_status(?, ?)", [
    idZone,
    data.is_active,
  ]);

  return rows[0]?.[0] ?? null;
}