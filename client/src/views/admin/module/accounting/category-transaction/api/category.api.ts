import axios from "@/api/axios.config";
import type {
//   ApiMessageResponse,
  ApiResponse,
} from "@/api/axios.response.type";
import type {
  Category,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "@/views/admin/module/accounting/category-transaction/types/category.types";
import type { AxiosResponse } from "axios";

export const getCategoryRequest = async (): Promise<
  AxiosResponse<ApiResponse<Category[]>>
> => axios.get("/gl-categories");

export const createCategoryRequest = async (
  data: CategoryCreateDTO,
): Promise<AxiosResponse<ApiResponse<Category>>> =>
  axios.post("/gl-categories", data);

export const updateCategoryRequest = async (
  id: number,
  data: CategoryUpdateDTO,
): Promise<AxiosResponse<ApiResponse<Category>>> =>
  axios.put(`/gl-categories/${id}`, data);

export const updateIsActiveCategoryRequest = async (
  id: number,
  data: CategoryUpdateDTO,
): Promise<AxiosResponse<ApiResponse<Category>>> =>
  axios.put(`/gl-categories/${id}/status`, data);
