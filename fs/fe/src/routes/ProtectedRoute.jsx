import { Navigate, Outlet } from '@tanstack/react-router';
import useAuth from '../hooks/useAuth';


export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Outlet />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.verified_email) {
    return (
      <Navigate
        to="/auth/resend-verifikasi-email"
        replace
      />
    );
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Outlet />;
  }

  if (user) {
    return (
      <Navigate
        to={
          user.verified_email
            ? '/'
            : '/auth/resend-verifikasi-email'
        }
        replace
      />
    );
  }

  return <Outlet />;
}