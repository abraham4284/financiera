import axios from "@/api/axios.config";
import type {
//   ApiMessageResponse,
  ApiResponse,
} from "@/api/axios.response.type";
import type { AxiosResponse } from "axios";
import type {
  Zone,
  ZoneCreateDTO,
  ZoneToggleStatusDTO,
  ZoneUpdateDTO,
} from "../types/zone.types";

export const getZonesRequest = async (
  onlyActive: boolean = true
): Promise<AxiosResponse<ApiResponse<Zone[]>>> =>
  axios.get(`/zones?onlyActive=${onlyActive}`);

export const getZoneByIdRequest = async (
  id: number
): Promise<AxiosResponse<ApiResponse<Zone>>> =>
  axios.get(`/zones/${id}`);

export const createZoneRequest = async (
  data: ZoneCreateDTO
): Promise<AxiosResponse<ApiResponse<Zone>>> =>
  axios.post("/zones", data);

export const updateZoneRequest = async (
  id: number,
  data: ZoneUpdateDTO
): Promise<AxiosResponse<ApiResponse<Zone>>> =>
  axios.put(`/zones/${id}`, data);

export const toggleZoneStatusRequest = async (
  id: number,
  data: ZoneToggleStatusDTO
): Promise<AxiosResponse<ApiResponse<Zone>>> =>
  axios.patch(`/zones/${id}/status`, data);