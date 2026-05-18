import { Route, Routes } from "react-router-dom";
import { TransactionsPage } from "../pages/TransactionsPage";

export function TransactionsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TransactionsPage />} />
    </Routes>
  );
}
