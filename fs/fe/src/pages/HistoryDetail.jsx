import NavbarSide from "../components/NavbarSide";
import { IoFastFood } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { IoShareSocial } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { GiHanger } from "react-icons/gi";
import { IoGrid } from "react-icons/io5";
import React, { useState } from "react";

export default function HistoryDetail() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: "makanan", icon: IoFastFood, name: "Makanan" },
    { id: "belanja", icon: FaShoppingCart, name: "Belanja" },
    { id: "pakaian", icon: GiHanger, name: "Pakaian" },
    { id: "lainnya", icon: IoGrid, name: "Lainnya" },
  ];
  return (
    <NavbarSide>
      <div className="m-6">
        <div className="h-172 w-400 rounded-md border-1 border-line bg-white">
          <div className="flex flex-col items-center justify-center mx-10 mt-10 font-bold text-2xl space-y-2">
            <div className="bg-primary p-3 rounded-full text-white">
              <IoFastFood className="text-4xl " />
            </div>
            <div>Rp284.089</div>
            <div className="font-normal text-lg">PayLater</div>
            <hr className="border-line w-full mt-6 border-1 border-dashed" />
          </div>
          <div className="mx-10 m-2 m-4">
            <div className="text-lg font-medium">Rincian Transaksi</div>
            <div className="space-y-4">
              {/* Text */}
              <div className="flex justify-between mt-4">
                <div className="font-medium">Status</div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-primary">Selesai</div>
                  <FaCheckCircle className="text-primary" />
                </div>
              </div>
              {/* Text */}
              <div className="flex justify-between mt-4">
                <div className="font-medium">Metode Pembayaran</div>
                <div className="font-medium">Tabungan Bank Jago</div>
              </div>
              {/* Text */}
              <div className="flex justify-between mt-4">
                <div className="font-medium">Waktu</div>
                <div className="font-medium">12:20</div>
              </div>
              {/* Text */}
              <div className="flex justify-between mt-4">
                <div className="font-medium">Tanggal</div>
                <div className="font-medium">22 Mei 2022</div>
              </div>
              {/* Text */}
              <div className="flex justify-between mt-4">
                <div className="font-medium">ID Transaksi</div>
                <div className="flex items-center gap-2">
                  <div className="font-medium">A218930912DSA</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("A218930912DSA");
                      alert("ID Transaksi berhasil disalin!");
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    title="Salin ID Transaksi"
                  >
                    <IoCopy className="text-tthird hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div className="font-medium">Order ID</div>
                <div className="flex items-center gap-2">
                  <div className="font-medium">28910321</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("A218930912DSA");
                      alert("ID Transaksi berhasil disalin!");
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    title="Salin ID Transaksi"
                  >
                    <IoCopy className="text-tthird hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
              <hr className="border-line w-full  border-1 border-dashed" />
              <div className="flex justify-between">
                <div className="font-medium text-tthird">Jumlah</div>
                <div className="font-medium text-tthird">Rp284.089</div>
              </div>
              <hr className="border-line w-full  border-1 border-dashed" />

              {/* Text */}
              <div className="flex justify-between mt-4">
                <div className="font-bold">Total</div>
                <div className="font-bold">Rp284.089</div>
              </div>

              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-2 bg-primary p-2 rounded-md cursor-pointer hover:bg-opacity-80 transition-all">
                  <IoShareSocial className="text-white" />
                  <div className="font-medium text-white">Bagikan</div>
                </button>
              </div>
            </div>
          </div>

          <div className="h-56 w-400 rounded-md border-1 border-line bg-white mt-8">
            <div className="mx-10 m-4">
              <div className="text-lg font-medium">Kategori Pengeluaran</div>

              <div className="flex gap-96 mt-10">
                {/* Logo-logo di kiri */}
                <div className="flex justify-start gap-14">
                  {/* Logo Makanan */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCategory("makanan")}
                      className="bg-primary p-3 rounded-full text-white cursor-pointer hover:scale-105 transition-all"
                    >
                      <IoFastFood className="text-4xl" />
                    </button>
                    {selectedCategory === "makanan" && (
                      <FaCheckCircle className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full text-xl" />
                    )}
                  </div>
                  {/* Logo Belanja */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCategory("belanja")}
                      className="bg-primary p-3 rounded-full text-white cursor-pointer hover:scale-105 transition-all"
                    >
                      <FaShoppingCart className="text-4xl" />
                    </button>
                    {selectedCategory === "belanja" && (
                      <FaCheckCircle className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full text-xl" />
                    )}
                  </div>
                  {/* Logo Pakaian */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCategory("pakaian")}
                      className="bg-primary p-3 rounded-full text-white cursor-pointer hover:scale-105 transition-all"
                    >
                      <GiHanger className="text-4xl" />
                    </button>
                    {selectedCategory === "pakaian" && (
                      <FaCheckCircle className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full text-xl" />
                    )}
                  </div>
                  {/* Logo Lainnya */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCategory("lainnya")}
                      className="bg-primary p-3 rounded-full text-white cursor-pointer hover:scale-105 transition-all"
                    >
                      <IoGrid className="text-4xl" />
                    </button>
                    {selectedCategory === "lainnya" && (
                      <FaCheckCircle className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full text-xl" />
                    )}
                  </div>
                </div>

                {/* Teks di kanan */}
                <div className="flex-1 text-lg text-gray-600 justify-center">
                  <span className="font-bold text-primary">
                    Pilih kategori yang cocok
                  </span>{" "}
                  dengan pengeluaran Anda di transaksi ini. Dengan begitu, Anda
                  bisa melacak kebiasaan belanja, mengontrol anggaran, dan
                  membuat keputusan keuangan yang lebih baik ke depannya.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarSide>
  );
}
