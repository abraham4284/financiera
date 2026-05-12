import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { HelmetProvider } from "react-helmet-async";

export const FinApp = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppRoutes />
      </HelmetProvider>
    </BrowserRouter>
  );
};
