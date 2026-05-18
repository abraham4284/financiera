import { useCallback, useState } from "react";
import axios from "axios";

import {
  createClientRequest,
  getClientByIdRequest,
  getClientsRequest,
  toggleClientStatusRequest,
  updateClientRequest,
} from "../api/clients.api";

import type {
  Client,
  ClientCreateDTO,
  ClientToggleStatusDTO,
  ClientUpdateDTO,
} from "../types/client.types";

type FieldErrors = Record<string, string>;

type ActionResult<T = undefined> = {
  status: boolean;
  message: string;
  data?: T;
  errors?: FieldErrors;
};

type AxiosBackendError = {
  status: boolean;
  message?: string;
  errors?: FieldErrors;
};

function getAxiosError(err: unknown): {
  message: string;
  errors?: FieldErrors;
} {
  if (axios.isAxiosError<AxiosBackendError>(err)) {
    return {
      message:
        err.response?.data?.message || err.message || "Error desconocido",

      errors: err.response?.data?.errors,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
    };
  }

  return {
    message: "Error desconocido",
  };
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSelected, setClientSelected] = useState<Client | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getClients = useCallback(
    async (onlyActive: boolean = true): Promise<ActionResult<Client[]>> => {
      try {
        setLoading(true);

        const { data } = await getClientsRequest(onlyActive);

        if (data.status) {
          setClients(data.data);
          setError(null);

          return {
            status: true,
            message: data.message || "Clientes obtenidos correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudieron obtener los clientes";

        setError(message);

        return {
          status: false,
          message,
          errors: data.errors,
        };
      } catch (err) {
        const { message, errors } = getAxiosError(err);

        setError(message);

        return {
          status: false,
          message,
          errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getClientById = useCallback(
    async (id: number): Promise<ActionResult<Client>> => {
      try {
        setLoading(true);

        const { data } = await getClientByIdRequest(id);

        if (data.status) {
          setClientSelected(data.data);
          setError(null);

          return {
            status: true,
            message: data.message || "Cliente obtenido correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo obtener el cliente";

        setError(message);

        return {
          status: false,
          message,
          errors: data.errors,
        };
      } catch (err) {
        const { message, errors } = getAxiosError(err);

        setError(message);

        return {
          status: false,
          message,
          errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createClient = useCallback(
    async (payload: ClientCreateDTO): Promise<ActionResult<Client>> => {
      try {
        setLoading(true);

        const { data } = await createClientRequest(payload);
        console.log(data,'data')

        if (data.status) {
          setClients((prev) => [...prev, data.data]);
          setError(null);

          return {
            status: true,
            message: data.message || "Cliente creado correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo crear el cliente";

        setError(message);

        return {
          status: false,
          message,
          errors: data.errors,
        };
      } catch (err) {
        const { message, errors } = getAxiosError(err);
        setError(message);

        return {
          status: false,
          message,
          errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateClient = useCallback(
    async (
      id: number,
      payload: ClientUpdateDTO,
    ): Promise<ActionResult<Client>> => {
      try {
        setLoading(true);

        const { data } = await updateClientRequest(id, payload);

        if (data.status) {
          setClients((prev) =>
            prev.map((client) => (client.idClient === id ? data.data : client)),
          );

          setError(null);

          return {
            status: true,
            message: data.message || "Cliente actualizado correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo actualizar el cliente";

        setError(message);

        return {
          status: false,
          message,
          errors: data.errors,
        };
      } catch (err) {
        const { message, errors } = getAxiosError(err);

        setError(message);

        return {
          status: false,
          message,
          errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleClientStatus = useCallback(
    async (
      id: number,
      payload: ClientToggleStatusDTO,
    ): Promise<ActionResult<Client>> => {
      try {
        setLoading(true);

        const { data } = await toggleClientStatusRequest(id, payload);

        if (data.status) {
          setClients((prev) =>
            prev.map((client) => (client.idClient === id ? data.data : client)),
          );

          setError(null);

          return {
            status: true,
            message:
              data.message || "Estado del cliente actualizado correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo actualizar el estado";

        setError(message);

        return {
          status: false,
          message,
          errors: data.errors,
        };
      } catch (err) {
        const { message, errors } = getAxiosError(err);

        setError(message);

        return {
          status: false,
          message,
          errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetClients = useCallback(() => {
    setClients([]);
    setClientSelected(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    clients,
    clientSelected,
    loading,
    error,

    getClients,
    getClientById,

    createClient,
    updateClient,
    toggleClientStatus,

    resetClients,
  };
}
