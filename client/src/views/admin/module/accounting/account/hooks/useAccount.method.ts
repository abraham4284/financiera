import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  getAccountsRequest,
  createAccountRequest,
  updateAccountRequest,
  deleteAccountRequest,
} from "../api/account.api";
import type { Account, AccountCreateDTO, AccountUpdateDTO } from "../types/account.types";

type ActionResult<T = undefined> = {
  status: boolean;
  message: string;
  data?: T;
};

// Ajustá esto a tu ApiResponse real
// type ApiResponse<T> = {
//   status: "OK" | "ERROR" | string;
//   message: string;
//   data: T;
// };

// type ApiMessageResponse = {
//   status: "OK" | "ERROR" | string;
//   message: string;
// };

function getAxiosMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;
    return axErr.response?.data?.message || axErr.message || "Error desconocido";
  }
  if (err instanceof Error) return err.message;
  return "Error desconocido";
}

export const useAccount = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAccounts = useCallback(async (): Promise<ActionResult<Account[]>> => {
    try {
      setLoading(true);
      const { data } = await getAccountsRequest();

      if (data.status) {
        setAccounts(data.data);
        setError(null);
        return { status: true, message: data.message, data: data.data };
      }

      setError(data.message || "Ocurrió un error inesperado");
      return { status: false, message: data.message || "Error" };
    } catch (err) {
      const message = getAxiosMessage(err);
      setError(message);
      return { status: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(
    async (payload: AccountCreateDTO): Promise<ActionResult<Account>> => {
      try {
        setLoading(true);
        const { data } = await createAccountRequest(payload); // ApiResponse<Account>
        console.log(data,'data')
        if (data.status) {
          // si el backend devuelve la cuenta creada
          setAccounts((prev) => [...prev, data.data]);
          setError(null);
          getAccounts(); // Refrescar la lista después de crear
          return { status: true, message: data.message, data: data.data };
        }

        setError(data.message || "Ocurrió un error inesperado");
        return { status: false, message: data.message || "Error" };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);
        return { status: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAccount = useCallback(
    async (id: number, payload: AccountUpdateDTO): Promise<ActionResult<Account>> => {
      try {
        setLoading(true);
        const { data } = await updateAccountRequest(id, payload); // ApiResponse<Account>

        if (data.status) {
          setAccounts((prev) =>
            prev.map((acc) => (acc.idAccount === id ? data.data : acc))
          );
          setError(null);
          return { status: true, message: data.message, data: data.data };
        }

        setError(data.message || "Ocurrió un error inesperado");
        return { status: false, message: data.message || "Error" };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);
        return { status: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAccount = useCallback(
    async (id: number): Promise<ActionResult> => {
      try {
        setLoading(true);
        const { data } = await deleteAccountRequest(id); // ApiMessageResponse

        if (data.status) {
          setAccounts((prev) => prev.filter((acc) => acc.idAccount !== id));
          setError(null);
          return { status: true, message: data.message };
        }

        setError(data.message || "Ocurrió un error inesperado");
        return { status: false, message: data.message || "Error" };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);
        return { status: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetAccounts = useCallback(() => {
    setAccounts([]);
    setLoading(true);
    setError(null);
  }, []);

  return {
    accounts,
    loading,
    error,
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    resetAccounts,
  };
};