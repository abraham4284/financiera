import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderAll } from "@/views/admin/components/HeaderAll";
import { Meta } from "@/components";
import { useTransactions } from "../hooks/useTransactions";
import {
  CardFilterTransactions,
  CardMetricTransactions,
  ModalFormTransaction,
  TableTransactions,
} from "../components";
import type { GlTransaction } from "../types/transaction.types";
import { useUtilsState } from "@/hooks";
import { useAccount } from "../../account/hooks/useAccount.method";
import { useCategory } from "../../category-transaction/hooks/useCategory.method";

export function TransactionsPage() {
  const { transactions, loading, getTransactions, resetTransactions } =
    useTransactions();

  const [transactionFilter, setTransactionFilter] = useState<GlTransaction[]>(
    [],
  );

  const {
    accounts,
    // deleteAccount,
    // error,
    getAccounts,
    resetAccounts,
    loading: loadingAccounts,
  } = useAccount();

  const {
    isOpen,
    closeModal,
    setIsOpen,
    toggleModal,
    // toggleModalAndSetDataEdit,
  } = useUtilsState();

  const { category, getCategory, resetCategories } = useCategory();
  const { createAdjustment, createExpense, createTransfer } = useTransactions();

  const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value.toLowerCase().trim();

    if (!searchInput) {
      setTransactionFilter([]);
      return;
    }

    const filteredTransactions = transactions.filter((transaction) => {
      return (
        transaction.description?.toLowerCase().includes(searchInput) ||
        transaction.source_module?.toLowerCase().includes(searchInput) ||
        transaction.status?.toLowerCase().includes(searchInput)
      );
    });

    setTransactionFilter(filteredTransactions);
  };

  useEffect(() => {
    getTransactions();

    return () => {
      resetTransactions();
    };
  }, [getTransactions, resetTransactions]);

  useEffect(() => {
    getAccounts();
    getCategory();
    return () => {
      resetAccounts();
      resetCategories();
    };
  }, [isOpen]);

  const transactionsDef = useMemo(() => {
    return transactionFilter.length === 0 ? transactions : transactionFilter;
  }, [transactionFilter, transactions]);

  return (
    <>
      <Meta
        title="Transacciones"
        description="Consulta los movimientos contables del sistema"
      />

      <section className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <HeaderAll
            title="Transacciones"
            subTitle="Consulta los movimientos contables generados por el sistema"
            btnInfo="Nueva operación"
            handleCreate={toggleModal}
          />
        </div>

        <CardMetricTransactions loading={loading} transactions={transactions} />

        <CardFilterTransactions handleFilterInput={handleFilterInput} />

        <Card>
          <CardHeader>
            <CardTitle>Listado de transacciones</CardTitle>
          </CardHeader>

          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <TableTransactions loading={loading} data={transactionsDef} />
            </div>
          </CardContent>
        </Card>
        <ModalFormTransaction
          openModal={isOpen}
          loading={loadingAccounts}
          accounts={accounts}
          categories={category}
          setOpenModal={setIsOpen}
          closeModal={closeModal}
          createExpense={createExpense}
          createTransfer={createTransfer}
          createAdjustment={createAdjustment}
        />
      </section>
    </>
  );
}
