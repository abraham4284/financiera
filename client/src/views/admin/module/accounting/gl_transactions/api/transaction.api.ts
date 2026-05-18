import axios from "@/api/axios.config";
import type {
  ApiMessageResponse,
  ApiResponse,
} from "@/api/axios.response.type";
import type { AxiosResponse } from "axios";
import type {
  CreateAdjustmentDTO,
  CreateExpenseDTO,
  CreateTransferDTO,
  GlTransaction,
} from "../types/transaction.types";

export const getGlTransactionsRequest = async (): Promise<
  AxiosResponse<ApiResponse<GlTransaction[]>>
> => axios.get("/transactions");

export const getGlTransactionByIdRequest = async (
  idGlTransaction: number
): Promise<AxiosResponse<ApiResponse<GlTransaction>>> =>
  axios.get(`/transactions/${idGlTransaction}`);

export const createExpenseRequest = async (
  data: CreateExpenseDTO
): Promise<AxiosResponse<ApiMessageResponse>> =>
  axios.post("/manual/expenses", data);

export const createTransferRequest = async (
  data: CreateTransferDTO
): Promise<AxiosResponse<ApiMessageResponse>> =>
  axios.post("/manual/transfers", data);

export const createAdjustmentRequest = async (
  data: CreateAdjustmentDTO
): Promise<AxiosResponse<ApiMessageResponse>> =>
  axios.post("/manual/adjustments", data);