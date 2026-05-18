import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderAll } from "@/views/admin/components/HeaderAll";
import { Meta } from "@/components";

import { useClients } from "../hooks/useClients";
import {
  CardFilterClients,
  CardMetricClients,
  ModalFormClient,
  TableClients,
} from "../components";
import type { Client } from "../types/client.types";

import { useZones } from "@/views/admin/module/zones/zones/hooks/useZones";
import { useUtilsState } from "@/hooks";

export function ClientsPage() {
  const {
    clients,
    loading,
    // error,
    getClients,
    resetClients,
    createClient,
    updateClient,
    toggleClientStatus,
  } = useClients();

  const { zones, getZones, resetZones } = useZones();

  const {
    isOpen,
    dataEdit,
    addDataEdit,
    toggleModal,
    closeModal,
    setIsOpen,
  } = useUtilsState<Client>();

  const [clientFilter, setClientFilter] = useState<Client[]>([]);

  const handleCreate = () => {
    addDataEdit(null);
    setIsOpen(true);
  };


  const handleFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value.toLowerCase().trim();

    if (!searchInput) {
      setClientFilter([]);
      return;
    }

    const filteredClients = clients.filter((client) => {
      const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();

      return (
        fullName.includes(searchInput) ||
        client.first_name?.toLowerCase().includes(searchInput) ||
        client.last_name?.toLowerCase().includes(searchInput) ||
        client.dni?.toLowerCase().includes(searchInput) ||
        client.cuil?.toLowerCase().includes(searchInput) ||
        client.zone_name?.toLowerCase().includes(searchInput)
      );
    });

    setClientFilter(filteredClients);
  };

  const handleToggleClientStatus = async (
    id: number,
    payload: { is_active: boolean | 0 | 1 },
  ) => {
    const result = await toggleClientStatus(id, payload);

    if (result.status) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    return result;
  };

  useEffect(() => {
    getClients(false);
    getZones(true);

    return () => {
      resetClients();
      resetZones();
    };
  }, [getClients, getZones, resetClients, resetZones]);

  const clientsDef = useMemo(() => {
    return clientFilter.length === 0 ? clients : clientFilter;
  }, [clientFilter, clients]);

  return (
    <>
      <Meta
        title="Clientes"
        description="Gestión de clientes del sistema financiero"
      />

      <section className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <HeaderAll
            title="Clientes"
            subTitle="Gestiona clientes, zonas y límites de endeudamiento"
            btnInfo="Nuevo cliente"
            handleCreate={handleCreate}
          />
        </div>

        <CardMetricClients loading={loading} clients={clients} />

        <CardFilterClients handleFilterInput={handleFilterInput} />

        <Card>
          <CardHeader>
            <CardTitle>Listado de clientes</CardTitle>
          </CardHeader>

          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <TableClients
                loading={loading}
                data={clientsDef}
                addDataEdit={addDataEdit}
                toggleModal={toggleModal}
                toggleClientStatus={handleToggleClientStatus}
              />
            </div>
          </CardContent>
        </Card>

        <ModalFormClient
          openModal={isOpen}
          loading={loading}
          dataEdit={dataEdit}
          zones={zones}
          // error= {error}
          setOpenModal={setIsOpen}
          closeModal={closeModal}
          addDataEdit={addDataEdit}
          createClient={createClient}
          updateClient={updateClient}
        />
      </section>
    </>
  );
}
