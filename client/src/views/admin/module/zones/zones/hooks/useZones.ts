import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  createZoneRequest,
  getZoneByIdRequest,
  getZonesRequest,
  toggleZoneStatusRequest,
  updateZoneRequest,
} from "../api/zones.api";
import type {
  Zone,
  ZoneCreateDTO,
  ZoneToggleStatusDTO,
  ZoneUpdateDTO,
} from "../types/zone.types";

type ActionResult<T = undefined> = {
  status: boolean;
  message: string;
  data?: T;
};

function getAxiosMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;

    return (
      axErr.response?.data?.message ||
      axErr.message ||
      "Error desconocido"
    );
  }

  if (err instanceof Error) return err.message;

  return "Error desconocido";
}

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneSelected, setZoneSelected] = useState<Zone | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getZones = useCallback(
    async (onlyActive: boolean = true): Promise<ActionResult<Zone[]>> => {
      try {
        setLoading(true);

        const { data } = await getZonesRequest(onlyActive);

        if (data.status) {
          setZones(data.data);
          setError(null);

          return {
            status: true,
            message: data.message || "Zonas obtenidas correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudieron obtener las zonas";
        setError(message);

        return {
          status: false,
          message,
        };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);

        return {
          status: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getZoneById = useCallback(
    async (id: number): Promise<ActionResult<Zone>> => {
      try {
        setLoading(true);

        const { data } = await getZoneByIdRequest(id);

        if (data.status) {
          setZoneSelected(data.data);
          setError(null);

          return {
            status: true,
            message: data.message || "Zona obtenida correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo obtener la zona";
        setError(message);

        return {
          status: false,
          message,
        };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);

        return {
          status: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createZone = useCallback(
    async (payload: ZoneCreateDTO): Promise<ActionResult<Zone>> => {
      try {
        setLoading(true);

        const { data } = await createZoneRequest(payload);

        if (data.status) {
          setZones((prev) => [...prev, data.data]);
          setError(null);

          return {
            status: true,
            message: data.message || "Zona creada correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo crear la zona";
        setError(message);

        return {
          status: false,
          message,
        };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);

        return {
          status: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateZone = useCallback(
    async (
      id: number,
      payload: ZoneUpdateDTO
    ): Promise<ActionResult<Zone>> => {
      try {
        setLoading(true);

        const { data } = await updateZoneRequest(id, payload);

        if (data.status) {
          setZones((prev) =>
            prev.map((zone) => (zone.idZone === id ? data.data : zone))
          );
          setError(null);

          return {
            status: true,
            message: data.message || "Zona actualizada correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo actualizar la zona";
        setError(message);

        return {
          status: false,
          message,
        };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);

        return {
          status: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const toggleZoneStatus = useCallback(
    async (
      id: number,
      payload: ZoneToggleStatusDTO
    ): Promise<ActionResult<Zone>> => {
      try {
        setLoading(true);

        const { data } = await toggleZoneStatusRequest(id, payload);

        if (data.status) {
          setZones((prev) =>
            prev.map((zone) => (zone.idZone === id ? data.data : zone))
          );
          setError(null);

          return {
            status: true,
            message: data.message || "Estado actualizado correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo cambiar el estado";
        setError(message);

        return {
          status: false,
          message,
        };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);

        return {
          status: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetZones = useCallback(() => {
    setZones([]);
    setZoneSelected(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    zones,
    zoneSelected,
    loading,
    error,
    getZones,
    getZoneById,
    createZone,
    updateZone,
    toggleZoneStatus,
    resetZones,
  };
}