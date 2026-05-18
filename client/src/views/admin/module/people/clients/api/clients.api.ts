import axios from "@/api/axios.config";
import type {
//   ApiMessageResponse,
  ApiResponse,
} from "@/api/axios.response.type";
import type { AxiosResponse } from "axios";
import type {
  Client,
  ClientCreateDTO,
  ClientToggleStatusDTO,
  ClientUpdateDTO,
} from "../types/client.types";

export const getClientsRequest = async (
  onlyActive: boolean = true
): Promise<AxiosResponse<ApiResponse<Client[]>>> =>
  axios.get(`/clients?onlyActive=${onlyActive}`);

export const getClientByIdRequest = async (
  id: number
): Promise<AxiosResponse<ApiResponse<Client>>> => axios.get(`/clients/${id}`);

export const createClientRequest = async (
  data: ClientCreateDTO
): Promise<AxiosResponse<ApiResponse<Client>>> => axios.post("/clients", data);

export const updateClientRequest = async (
  id: number,
  data: ClientUpdateDTO
): Promise<AxiosResponse<ApiResponse<Client>>> =>
  axios.put(`/clients/${id}`, data);

export const toggleClientStatusRequest = async (
  id: number,
  data: ClientToggleStatusDTO
): Promise<AxiosResponse<ApiResponse<Client>>> =>
  axios.patch(`/clients/${id}/status`, data);