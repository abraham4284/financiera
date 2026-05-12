import { Routes, Route } from "react-router-dom";
import { AccountPage } from "../pages/AccountPage";

export const AccountRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AccountPage />} />
    </Routes>
  );
};
