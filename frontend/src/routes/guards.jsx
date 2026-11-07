import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute() {
  const { user, initialized } = useSelector((state) => state.auth);

  // Jab tak backend se jawab nahi aata, kuch mat dikhao
  if (!initialized) return null;

  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export function GuestRoute() {
  const { user, initialized } = useSelector((state) => state.auth);

  if (!initialized) return null;

  return user ? <Navigate to="/" replace /> : <Outlet />;
}