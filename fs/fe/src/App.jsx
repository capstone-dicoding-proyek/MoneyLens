import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GreenRectangle from "./components/LoginPageComponent";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <main className="absolute">
      <div className="">
        <Routes>
          <Route path="*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
