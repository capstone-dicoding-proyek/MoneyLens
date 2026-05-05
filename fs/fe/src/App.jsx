import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { GuestRoute, PrivateRoute } from './routes/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import VerifikasiEmailPage from './pages/VerifikasiEmail';
import ResendVerifikasiEmailPage from './pages/ResendVerifikasiEmail';
import NewPasswordPage from './pages/NewPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


function App() {
  return (
    <Routes>
      {/* Belum Login */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/resend-verifikasi-email" element={<ResendVerifikasiEmailPage />} />
        <Route path="/auth/verify-email" element={<VerifikasiEmailPage />} />
        <Route path="/auth/verif-reset-token" element={<NewPasswordPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Sudah Login */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
