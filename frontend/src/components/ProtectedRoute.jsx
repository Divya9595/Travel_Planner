import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false, adminRedirect = false }) {
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    if (!token) return <Navigate to="/login" replace />;
    if (adminOnly && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
    if (adminRedirect && user?.role === "admin") return <Navigate to="/dashboard/admin" replace />;

    return children;
}

export default ProtectedRoute;