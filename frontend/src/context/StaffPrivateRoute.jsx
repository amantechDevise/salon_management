import { Navigate } from "react-router-dom";

const StaffPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("staffToken");

  if (token && token !== "undefined" && token !== "null") {
    return children;
  }

  return <Navigate to="/admin/staff-login" />;
};

export default StaffPrivateRoute;