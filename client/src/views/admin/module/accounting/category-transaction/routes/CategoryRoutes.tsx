import { Routes, Route } from "react-router-dom";
import { CategoryPage } from "../page/CategoryPage";

export const CategoryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoryPage />} />
    </Routes>
  );
};
