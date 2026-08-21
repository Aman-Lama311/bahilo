import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "./hooks";

export const PublicRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
