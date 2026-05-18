import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  createAdjustmentRequest,
  createExpenseRequest,
  createTransferRequest,
  getGlTransactionByIdRequest,
  getGlTransactionsRequest,
} from "../api/transaction.api";
import type {
  CreateAdjustmentDTO,
  CreateExpenseDTO,
  CreateTransferDTO,
  GlTransaction,
} from "../types/transaction.types";

type ActionResult<T = undefined> = {
  status: boolean;
  message: string;
  data?: T;
};

function getAxiosMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;
    return axErr.response?.data?.message || axErr.message || "Error desconocido";
  }

  if (err instanceof Error) return err.message;

  return "Error desconocido";
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<GlTransaction[]>([]);
  const [transactionSelected, setTransactionSelected] =
    useState<GlTransaction | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTransactions = useCallback(async (): Promise<
    ActionResult<GlTransaction[]>
  > => {
    try {
      setLoading(true);

      const { data } = await getGlTransactionsRequest();

      if (data.status) {
        setTransactions(data.data);
        setError(null);

        return {
          status: true,
          message: data.message || "Transacciones obtenidas correctamente",
          data: data.data,
        };
      }

      const message = data.message || "No se pudieron obtener las transacciones";
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
  }, []);

  const getTransactionById = useCallback(
    async (idGlTransaction: number): Promise<ActionResult<GlTransaction>> => {
      try {
        setLoading(true);

        const { data } = await getGlTransactionByIdRequest(idGlTransaction);

        if (data.status) {
          setTransactionSelected(data.data);
          setError(null);

          return {
            status: true,
            message: data.message || "Transacción obtenida correctamente",
            data: data.data,
          };
        }

        const message = data.message || "No se pudo obtener la transacción";
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

  const createExpense = useCallback(
    async (payload: CreateExpenseDTO): Promise<ActionResult> => {
      try {
        setLoading(true);
        const { data } = await createExpenseRequest(payload);
        if (data.status) {
          await getTransactions();
          return {
            status: true,
            message: data.message || "Gasto registrado correctamente",
          };
        }

        return {
          status: false,
          message: data.message || "No se pudo registrar el gasto",
        };
      } catch (err) {
        return {
          status: false,
          message: getAxiosMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [getTransactions]
  );

  const createTransfer = useCallback(
    async (payload: CreateTransferDTO): Promise<ActionResult> => {
      try {
        setLoading(true);
        console.log("createTansfer")
        console.log(payload,'data')
        const { data } = await createTransferRequest(payload);
        console.log(data,'data')
        if (data.status) {
          await getTransactions();

          return {
            status: true,
            message: data.message || "Transferencia registrada correctamente",
          };
        }

        return {
          status: false,
          message: data.message || "No se pudo registrar la transferencia",
        };
      } catch (err) {
        return {
          status: false,
          message: getAxiosMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [getTransactions]
  );

  const createAdjustment = useCallback(
    async (payload: CreateAdjustmentDTO): Promise<ActionResult> => {
      try {
        setLoading(true);

        const { data } = await createAdjustmentRequest(payload);

        if (data.status) {
          await getTransactions();

          return {
            status: true,
            message: data.message || "Ajuste registrado correctamente",
          };
        }

        return {
          status: false,
          message: data.message || "No se pudo registrar el ajuste",
        };
      } catch (err) {
        return {
          status: false,
          message: getAxiosMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [getTransactions]
  );

  const resetTransactions = useCallback(() => {
    setTransactions([]);
    setTransactionSelected(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    transactions,
    transactionSelected,
    loading,
    error,
    getTransactions,
    getTransactionById,
    createExpense,
    createTransfer,
    createAdjustment,
    resetTransactions,
  };
}