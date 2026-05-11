import { GoHomeFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

export default function NavbarSide({ children }) {
  return (
    <div className="flex justify-center">
      <div className="w-67 h-screen bg-linear-to-bl from-[#2FA084] to-[#6FCF97] justify-center flex">
        <div className=" m-10 flex justify-center items-start pt-4">
          <div className="flex flex-col h-full space-y-10">
            {/* Dashboard Button */}
            <div className="flex gap-2 items-center  cursor-pointer hover:bg-white px-6 p-2 group rounded-md transition duration-300">
              <GoHomeFill className="text-white text-2xl group-hover:text-[#2FA084]" />
              <div className="text-white font-bold text-xl group-hover:text-[#2FA084]">
                Beranda
              </div>
            </div>
            {/* Profile Button */}
            <div className="flex gap-2 items-center  cursor-pointer hover:bg-white px-6 p-2 group rounded-md transition  duration-300">
              <FaUser className="text-white text-2xl group-hover:text-[#2FA084]" />
              <div className="text-white font-bold text-xl group-hover:text-[#2FA084]">
                Profile
              </div>
            </div>
            {/* Riwayat Button */}
            <div className="flex gap-2 items-center  cursor-pointer hover:bg-white px-6 p-2 group rounded-md transition  duration-300">
              <FaHistory className="text-white text-2xl group-hover:text-[#2FA084]" />
              <div className="text-white font-bold text-xl group-hover:text-[#2FA084]">
                Riwayat
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-auto flex gap-2 items-center  cursor-pointer hover:bg-white px-6 p-2 group rounded-md transition  duration-300">
              <MdLogout className="text-white text-2xl group-hover:text-[#2FA084]" />
              <div className="text-white font-bold text-xl group-hover:text-[#2FA084]">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-[#FAFAFA] -z-10 h-158 w-screen"></div>
      {children}
    </div>
  );
}
