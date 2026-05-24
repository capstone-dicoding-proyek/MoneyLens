import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GreenRectangle from "./components/LoginPageComponent";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryDetail from "./pages/HistoryDetail";

function App() {
  return (
    <main className="absolute">
      <div className="">
        <Routes>
          <Route path="*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/historydetail" element={<HistoryDetail />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
