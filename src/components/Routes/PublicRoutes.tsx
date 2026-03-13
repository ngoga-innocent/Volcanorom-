import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";


const PublicRoute = () => {
  const token = useAppSelector((state) => state.auth.access);

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;