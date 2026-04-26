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
import LoadingHand from "../components/LoadingHand";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* <LoadingHand /> */}
      <GreenRectangle>
        <div className="p-12 ml-32 font-secondary tracking-wider w-114 max-sm:p-2 max-sm:ml-6 max-sm:mt-10  max-sm:w-96 max-sm:max-h-screen">
          <div className="flex items-center  w-92">
            <GoArrowLeft className="cursor-pointer mr-25 size-6" />
            <span className="max-sm:text-xs ">belum menjadi member? </span>
            <Link to="/register">
              <span className="text-primary transition-colors hover:text-secondary cursor-pointer max-sm:text-xs">
                daftar
              </span>
            </Link>
          </div>

          <div className="font-bold text-primary text-5xl mt-14 max-sm:text-4xl">
            Masuk
          </div>

          <div className="text-tthird font-light text-sm mt-8">
            Silakan masuk untuk mulai mengelola dan mencatat keuangan Anda.
          </div>

          {/* Form */}
          <form className="space-y-14 mt-8 max-sm:space-y-10">
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

            <div className="-space-x-4y">
              <ul className="ml-4 space-y-2 text-xs text-tthird list-disc ">
                <li>Password harus minimal 8 karakter</li>
                <li>
                  Harus mengandung huruf besar, huruf kecil, angka,
                  <br />
                  dan simbol{" "}
                </li>
                <li>Contoh simbol: !@#$%^&*</li>
              </ul>
            </div>
          </form>

          <div className="flex items-center gap-20 mt-10">
            <button
              type="submit"
              className="bg-primary text-white w-36 h-10 rounded-lg cursor-pointer text-xl font-bold tracking-wider bg-linear-to-r from-primary to-secondary transition-colors hover:bg-[#1e6b57] hover:from-[#1e6b57] hover:to-[#1e6b57] duration-300"
            >
              Masuk
            </button>
            <div className="text-lg font-normal text-tthird">or</div>
            <button className="cursor-pointer">
              <FcGoogle className="size-10" />
            </button>
          </div>

          <div className="mt-4">
            <Link to={"/forgotPassword"}>
              <span className="text-tthird text-sm mt-8 hover:text-primary transition-colors duration-300 cursor-pointer max-sm:text-xs">
                Lupa Password atau Email?
              </span>
            </Link>
          </div>
        </div>
      </GreenRectangle>
    </div>
  );
}
