import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { GuestRoute, PrivateRoute } from './routes/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import VerifikasiEmailPage from './pages/VerifikasiEmail';
import ResendVerifikasiEmailPage from './pages/ResendVerifikasiEmail';
import NewPasswordPage from './pages/NewPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';

import HistoryPage from './pages/HistoryPage';
import TransactionModal from './components/InputTransactionComponent';
import TransactionDetailModal from './components/TransactionItemModal';
import InputTransactionComponent from './components/InputTransactionComponent';
import LineChartComponent from './components/LineChartComponent';


function App() {
  return (
    <Routes>
      {/* Guest only */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route
        path="/auth/resend-verifikasi-email"
        element={<ResendVerifikasiEmailPage />}
      />

      <Route path="/auth/verify-email" element={<VerifikasiEmailPage />} />

      <Route path="/auth/verif-reset-token" element={<NewPasswordPage />} />

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
      <Route path="/inputTes" element={<InputTransactionComponent />} />
      <Route path="/modal" element={<TransactionDetailModal />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
