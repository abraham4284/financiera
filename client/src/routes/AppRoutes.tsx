import { Routes, Route } from "react-router-dom";
import { HomeRoutes } from "@/views/home";
// import { PrivateRoute } from "@/views/admin/middlewares/PrivateRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<HomeRoutes />} />
      {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
    </Routes>
  );
};
