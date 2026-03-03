import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // 🔥 WAIT until user is loaded
  if (loading) {
    return null;
  }
  console.log("ADMIN USER:", user);

  if (!user) {
    return <Navigate to="/AdminDashboard" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/AdminDashboard" />;
  }

  return children;
}

export default AdminRoute;