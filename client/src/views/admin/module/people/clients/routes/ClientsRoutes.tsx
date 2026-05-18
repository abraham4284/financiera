import { Route, Routes } from "react-router-dom";
import { ClientsPage } from "../page/ClientsPage";

export function ClientsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientsPage />} />
    </Routes>
  );
}