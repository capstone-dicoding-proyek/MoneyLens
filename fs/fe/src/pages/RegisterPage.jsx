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

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleMasuk = () => {
    navigate("/login");
  };

  return (
    <GreenRectangle>
      <div className="p-12 ml-32 font-secondary tracking-wider w-114 max-sm:p-2 max-sm:ml-6 max-sm:mt-10 border max-sm:w-96 max-sm:max-h-screen">
        <div className="flex items-center w-92 ">
          <GoArrowLeft
            className="cursor-pointer mr-24 size-6"
            onClick={() => navigate(-1)}
          />
          <span>sudah menjadi member? </span>
          <Link to={"/login"}>
            <span className="text-primary transition-colors hover:text-secondary cursor-pointer">
              masuk
            </span>
          </Link>
        </div>

        <div className="font-bold text-primary text-5xl mt-14 max-sm:text-4xl max-sm:mt-10">
          Daftar
        </div>

        <div className="text-tthird font-light text-sm mt-8 max-sm:mt-4">
          Silakan daftar untuk mulai mengelola dan mencatat keuangan Anda.
        </div>

        {/* Form */}
        <form className="space-y-14 mt-8 max-sm:space-y-10">
          <div className="flex items-center">
            <div className="flex items-center border-b-1 border-tthird pb-2 w-90">
              <FaUser className="ml-2 mr-4 size text-tthird" />
              <input
                type="text"
                placeholder="Username"
                className="focus:outline-none"
              />
            </div>
          </div>

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

          <div className="flex items-center">
            <div className="flex items-center border-b-1 border-tthird pb-2 w-90">
              <FaLock className="ml-2 mr-4 size text-tthird" />
              <input
                type="email"
                placeholder="Password"
                className="focus:outline-none"
              />
            </div>
          </div>

          <div className="-space-x-4 ">
            <ul className="ml-4 space-y-2 text-xs text-tthird list-disc">
              <li>Password harus minimal 8 karakter</li>
              <li>
                Harus mengandung huruf besar, huruf kecil, angka,
                <br />
                dan simbol{" "}
              </li>
              <li>Contoh simbol: !@#$%^&*</li>
            </ul>
          </div>

          {/* Konfirmasi Password */}
          <div className="flex items-center ">
            <div className="flex items-center border-b-1 border-tthird pb-2 w-90">
              <FaKeyboard className="ml-2 mr-4 size text-tthird" />
              <input
                type="password"
                placeholder="Konfirmasi Password"
                className="focus:outline-none"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center gap-20 mt-10 max-sm:mt-6">
          <button
            type="submit"
            className="bg-primary text-white w-36 h-10 rounded-lg cursor-pointer text-xl font-bold tracking-wider bg-linear-to-r from-primary to-secondary transition-colors hover:bg-[#1e6b57] hover:from-[#1e6b57] hover:to-[#1e6b57] duration-300"
          >
            Daftar
          </button>
          <div className="text-lg font-normal text-tthird">or</div>
          <button className="cursor-pointer">
            <FcGoogle className="size-10" />
          </button>
        </div>
      </div>
    </GreenRectangle>
  );
}
