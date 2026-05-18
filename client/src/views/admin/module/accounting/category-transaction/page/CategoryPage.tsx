import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderAll } from "@/views/admin/components/HeaderAll";
import { useCategory } from "../hooks/useCategory.method";
import { useUtilsState } from "@/hooks/useUtilsState";
import {
  CardFilterCategory,
  CardMetricCategoryTransaction,
  ModalFormCategory,
  TableCategory,
} from "../components";
import type { Category } from "../types/category.types";
import { Meta } from "@/components";

export const CategoryPage = () => {
  const {
    category,
    createCategory,
    // deleteCategory,
    // error,
    getCategory,
    loading,
    resetCategories,
    updateCategory,
  } = useCategory();

  const {
    isOpen,
    dataEdit,
    addDataEdit,
    toggleModal,
    closeModal,
    setIsOpen,
    // toggleModalAndSetDataEdit,
  } = useUtilsState();
  const [categoryFilter, setCategoryFilter] = useState<Category[]>([]);

  const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const searchInput = e.target.value.toLocaleLowerCase();
    if (searchInput === "") {
      setCategoryFilter([]);
    } else {
      const filterCategory = category.filter((el) => {
        return el.name.toLocaleLowerCase().includes(searchInput);
      });
      setCategoryFilter(filterCategory);
    }
  };

  const handleCreate = () => {
    addDataEdit(null);
    toggleModal();
  };

  useEffect(() => {
    getCategory();
    return () => {
      resetCategories();
    };
  }, []);

  const categoryDef = categoryFilter.length === 0 ? category : categoryFilter;

  return (
    <>
      <Meta
        title="Categorias"
        description="Gestiona categorias"
      />
      <section className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <HeaderAll
            title={"Gestión de categorías"}
            subTitle={"Gestiona el control de tus categorías"}
            handleCreate={handleCreate}
            btnInfo="Nueva Categoría"
          />
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* <CardMetricAccount metric={metric} loading ={loading} /> */}
        </div>
        <CardMetricCategoryTransaction loading={loading} category={category} />

        {/* Filtros y búsqueda */}
        <div>
          <CardFilterCategory handleFilterInput={handleFilterInput} />
        </div>

        {/* Tabla de categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <TableCategory
                loading={loading}
                data={categoryDef}
                // deleteAccount={deleteAccount}
                addDataEdit={addDataEdit}
                toggleModal={toggleModal}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modal para crear/editar */}
        <ModalFormCategory
          openModal={isOpen}
          loading={loading}
          dataEdit={dataEdit}
          setOpenModal={setIsOpen}
          createCategory={createCategory}
          updateCategory={updateCategory}
          closeModal={closeModal}
          addDataEdit={addDataEdit}
        />
      </section>
    </>
  );
};
