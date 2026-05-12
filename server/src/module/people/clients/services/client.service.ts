import { pool } from "@db/db.js";
import {
  CreateClientDTO,
  ToggleClientStatusDTO,
  UpdateClientDTO,
} from "../types/client.types.js";

export async function createClientService(data: CreateClientDTO) {
  const [result]: any = await pool.query(
    "CALL sp_clients_create(?, ?, ?, ?, ?, ?, ?, @idClient)",
    [
      data.first_name,
      data.last_name,
      data.dni ?? null,
      data.cuil ?? null,
      data.birth_date ?? null,
      data.maximum_indebtedness,
      data.idZone,
    ],
  );

  const [rows]: any = await pool.query("SELECT @idClient AS idClient");

  return {
    client: result[0]?.[0] ?? null,
    idClient: rows[0]?.idClient ?? null,
  };
}

export async function getClientsService(onlyActive = true, idZone?: number) {
  const [rows]: any = await pool.query("CALL sp_clients_get_all(?, ?)", [
    onlyActive ? 1 : 0,
    idZone ?? null,
  ]);

  return rows[0];
}

export async function getClientByIdService(idClient: number) {
  const [rows]: any = await pool.query("CALL sp_clients_get_by_id(?)", [
    idClient,
  ]);

  return rows[0]?.[0] ?? null;
}

export async function updateClientService(
  idClient: number,
  data: UpdateClientDTO,
) {
  const [rows]: any = await pool.query(
    "CALL sp_clients_update(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      idClient,
      data.first_name,
      data.last_name,
      data.dni ?? null,
      data.cuil ?? null,
      data.birth_date ?? null,
      data.maximum_indebtedness,
      data.idZone,
    ],
  );

  return rows[0]?.[0] ?? null;
}

export async function toggleClientStatusService(
  idClient: number,
  data: ToggleClientStatusDTO,
) {
  const [rows]: any = await pool.query("CALL sp_clients_toggle_status(?, ?)", [
    idClient,
    data.is_active,
  ]);

  return rows[0]?.[0] ?? null;
}