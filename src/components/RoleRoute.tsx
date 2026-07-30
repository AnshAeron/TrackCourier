import { Navigate } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: ("ADMIN" | "STAFF")[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.role) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
