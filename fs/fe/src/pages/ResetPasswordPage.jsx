import { useCallback, useEffect, useRef, useState } from "react";
import { sendResetPassword } from "../api/auth";
import InputComponent from "../components/InputComponent";
import useInputs from "../hooks/useInput";
import { getRemainingCooldown, startCooldown } from "../utils/resend-cooldown";
import { useToast } from "../hooks/useToast";
import { formatTime } from "../utils/format-time";
import { useNavigate } from "react-router-dom";

const RESEND_KEY = "resend_reset_password_end_time";
const RESEND_COOLDOWN = 180;

export default function ResetPasswordPage() {
  const [email, onChangeEmail] = useInputs();
  const [count, setCount] = useState(() => getRemainingCooldown(RESEND_KEY));
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          localStorage.removeItem(RESEND_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const remaining = getRemainingCooldown(RESEND_KEY);
    if (remaining > 0) {
      setCount(remaining);
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSend = async () => {
    if (count > 0 || isResending) return;

    setIsResending(true);
    try {
      await sendResetPassword(email);
      addToast("Email verifikasi telah dikirim", { type: "success" });
      startCooldown({
        key: RESEND_KEY,
        duration: RESEND_COOLDOWN,
        setState: setCount,
      });
      startTimer();
      navigate("/reset-password");
    } catch (err) {
      addToast(err?.response?.data?.message || "Gagal mengirim ulang email", {
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section>
      <InputComponent
        label="Email"
        type="email"
        placeholder="Masukkan email anda..."
        value={email}
        onChangeValue={onChangeEmail}
      />
      <button
        onClick={handleSend}
        disabled={count > 0 || isResending}
        style={{
          opacity: count > 0 || isResending ? 0.5 : 1,
          cursor: count > 0 || isResending ? "not-allowed" : "pointer",
        }}
      >
        {isResending
          ? "Mengirim..."
          : count > 0
            ? `Kirim ulang dalam ${formatTime(count)}`
            : "Kirim"}
      </button>
    </section>
  );
}
