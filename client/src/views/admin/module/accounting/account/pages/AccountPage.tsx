import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderAll } from "@/views/admin/components/HeaderAll";
import { useAccount } from "../hooks/useAccount.method";
import { useUtilsState } from "@/hooks/useUtilsState";
import {
  ModalFormAccount,
  TableAccount,
  CardFilterAccount,
  CardMetricAccount,
} from "../components";
import type { Account } from "../types/account.types";
import { Meta } from "@/components";

export const AccountPage = () => {
  const {
    accounts,
    createAccount,
    // deleteAccount,
    // error,
    getAccounts,
    loading,
    resetAccounts,
    updateAccount,
  } = useAccount();

  const {
    isOpen,
    dataEdit,
    addDataEdit,
    toggleModal,
    closeModal,
    setIsOpen,
    // toggleModalAndSetDataEdit,
  } = useUtilsState();
  const [accountFilter, setAccountFilter] = useState<Account[]>([]);

  const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const searchInput = e.target.value.toLocaleLowerCase();
    if (searchInput === "") {
      setAccountFilter([]);
    } else {
      const filterAccount = accounts.filter((el) => {
        return el.name.toLocaleLowerCase().includes(searchInput);
      });
      setAccountFilter(filterAccount ? filterAccount : []);
    }
  };

  const handleCreate = () => {
    addDataEdit(null);
    toggleModal();
  };

  useEffect(() => {
    getAccounts();
    return () => {
      resetAccounts();
    };
  }, []);

  const acountDef = accountFilter.length === 0 ? accounts : accountFilter;

  return (
    <>
      <Meta title="Cuentas" description="Gestiona tus cuentas" />
      <section className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <HeaderAll
            title={"Gestión de cuentas"}
            subTitle={"Gestiona el control de tus cuentas"}
            handleCreate={handleCreate}
            btnInfo="Nueva Cuenta"
          />
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* <CardMetricAccount metric={metric} loading ={loading} /> */}
        </div>
        <CardMetricAccount loading={loading} accounts={accounts} />
        {/* Filtros y búsqueda */}
        <div>
          <CardFilterAccount handleFilterInput={handleFilterInput} />
        </div>

        {/* Tabla de categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <TableAccount
                loading={loading}
                data={acountDef}
                // deleteAccount={deleteAccount}
                addDataEdit={addDataEdit}
                toggleModal={toggleModal}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modal para crear/editar */}
        <ModalFormAccount
          openModal={isOpen}
          loading={loading}
          dataEdit={dataEdit}
          setOpenModal={setIsOpen}
          createAccount={createAccount}
          updateAccount={updateAccount}
          closeModal={closeModal}
          addDataEdit={addDataEdit}
        />
      </section>
    </>
  );
};
