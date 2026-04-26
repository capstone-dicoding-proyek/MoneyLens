import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../utils/api/user";
import GreenRectangle from "../components/LoginPageComponent";
import { GoArrowLeft } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaKeyboard } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleMasuk = () => {
    navigate("/login");
  };

  return (
    <GreenRectangle>
      <div className="p-12 ml-32 font-secondary tracking-wider w-114 max-sm:p-2 max-sm:ml-6 max-sm:mt-10 border max-sm:w-96 max-sm:max-h-screen">
        <div className="flex items-center  w-92">
          <GoArrowLeft
            className="cursor-pointer mr-25 size-6"
            onClick={() => navigate(-1)}
          />
          <span>belum menjadi member? </span>
          <Link to={"/login"}>
            <span className="text-primary transition-colors hover:text-secondary cursor-pointer">
              daftar
            </span>
          </Link>
        </div>

        <div className="font-bold text-primary text-5xl mt-14">
          Lupa Password?
        </div>

        <div className="text-tthird font-light text-sm mt-8">
          Masukkan email anda untuk mendapatkan tautan <br />
          reset password.
        </div>

        {/* Form */}
        <form className="space-y-4 mt-8  w-max">
          <div className="flex items-center">
            <div className="flex items-center border-b-1 border-tthird pb-2 w-90">
              <MdEmail className="ml-2 mr-4 size text-tthird" />
              <input
                type="email"
                placeholder="Email"
                className="focus:outline-none"
              />
            </div>
          </div>

          <div className=" items-center  flex justify-center">
            <button
              type="submit"
              className="bg-primary text-white w-36 h-10 rounded-lg cursor-pointer text-xl font-bold tracking-wider bg-linear-to-r from-primary to-secondary transition-colors hover:bg-[#1e6b57] hover:from-[#1e6b57] hover:to-[#1e6b57] duration-300"
            >
              Kirim Email
            </button>
          </div>
        </form>
      </div>
    </GreenRectangle>
  );
}
