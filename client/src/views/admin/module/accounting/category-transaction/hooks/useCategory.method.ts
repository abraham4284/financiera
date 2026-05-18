import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  createCategoryRequest,
  getCategoryRequest,
  updateCategoryRequest,
} from "../api/category.api";

import type {
  Category,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../types/category.types";

type ActionResult<T = undefined> = {
  status: boolean;
  message: string;
  data?: T;
};

function getAxiosMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;
    return (
      axErr.response?.data?.message || axErr.message || "Error desconocido"
    );
  }
  if (err instanceof Error) return err.message;
  return "Error desconocido";
}

export const useCategory = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCategory = useCallback(async (): Promise<
    ActionResult<Category[]>
  > => {
    try {
      setLoading(true);
      const { data } = await getCategoryRequest();

      if (data.status) {
        setCategory(data.data);
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

  const createCategory = useCallback(
    async (payload: CategoryCreateDTO): Promise<ActionResult<Category>> => {
      try {
        setLoading(true);
        const { data } = await createCategoryRequest(payload); // ApiResponse<Category>
        if (data.status) {
          // si el backend devuelve la categoria creada
          setCategory((prev) => [...prev, data.data]);
          setError(null);
          getCategory(); // Refrescar la lista después de crear
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
    [],
  );

  const updateCategory = useCallback(
    async (
      id: number,
      payload: CategoryUpdateDTO,
    ): Promise<ActionResult<Category>> => {
      try {
        setLoading(true);
        const { data } = await updateCategoryRequest(id, payload); // ApiResponse<Category>

        if (data.status) {
          setCategory((prev) =>
            prev.map((cat) => (cat.idGlCategorie === id ? data.data : cat)),
          );
          setError(null);
          getCategory(); // Refrescar la lista después de actualizar
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
    [],
  );

  const resetCategories = useCallback(() => {
    setCategory([]);
    setLoading(true);
    setError(null);
  }, []);

  return {
    category,
    loading,
    error,
    getCategory,
    createCategory,
    updateCategory,
    resetCategories,
  };
};
