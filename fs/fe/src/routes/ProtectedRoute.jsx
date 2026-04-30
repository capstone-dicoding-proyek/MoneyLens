import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return (<h1>Loading.....</h1>);
  if (!user) return <Navigate to="/login" replace />;
  if (!user.verified_email) return <Navigate to="/auth/resend-verifikasi-email" replace />;

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return (<h1>Loading.....</h1>);
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}