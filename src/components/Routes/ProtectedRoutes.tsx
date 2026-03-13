import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";


const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.access);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;