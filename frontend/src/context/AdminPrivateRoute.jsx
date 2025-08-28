import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (token && token !== "undefined" && token !== "null") {
    return children;
  }

  return <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
