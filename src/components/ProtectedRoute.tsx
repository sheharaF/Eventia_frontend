import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  role?: "Admin" | "Vendor" | "User";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const parsedUser = JSON.parse(user);

  if (role && parsedUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
