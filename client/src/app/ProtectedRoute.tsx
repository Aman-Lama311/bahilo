import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks';

export const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};