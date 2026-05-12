import axios from "@/api/axios.config";
import type { ApiMessageResponse,ApiResponse} from "@/api/axios.response.type"
import type { Account,AccountUpdateDTO,AccountCreateDTO} from "../types/account.types"
import type { AxiosResponse } from "axios";


export const getAccountsRequest = async (): Promise<AxiosResponse<ApiResponse<Account[]>>> => axios.get("/account");
export const createAccountRequest = async (data: AccountCreateDTO): Promise<AxiosResponse<ApiResponse<Account>>> => axios.post("/account",data);
export const updateAccountRequest = async (id: number, data:AccountUpdateDTO): Promise<AxiosResponse<ApiResponse<Account>>>=> axios.put(`/account/${id}`,data);
export const deleteAccountRequest = async (id: number): Promise<AxiosResponse<ApiMessageResponse>> => axios.delete(`/account/${id}`);