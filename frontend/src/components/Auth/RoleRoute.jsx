import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;

