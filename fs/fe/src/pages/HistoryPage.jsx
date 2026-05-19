import NavbarSide from "../components/NavbarSide";
import { FaSearch } from "react-icons/fa";
import { FaSortUp } from "react-icons/fa6";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { useState, useRef } from "react";
import { IoIosPaper } from "react-icons/io";

export default function HistoryPage() {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [currentDateTitle, setCurrentDateTitle] = useState("Hari ini, 9 Mei");
  const scrollRef = useRef(null);

  const prevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? months.length - 1 : prev - 1));
  };

  const nextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === months.length - 1 ? 0 : prev + 1));
  };

  const prevMonthName =
    months[currentMonthIndex === 0 ? months.length - 1 : currentMonthIndex - 1];
  const currentMonthName = months[currentMonthIndex];
  const nextMonthName =
    months[currentMonthIndex === months.length - 1 ? 0 : currentMonthIndex + 1];

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-title]");
    let visibleTitle = "Hari ini, 9 Mei";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (
        rect.top <= containerRect.top + 100 &&
        rect.bottom >= containerRect.top + 50
      ) {
        visibleTitle = section.getAttribute("data-title");
      }
    });

    setCurrentDateTitle(visibleTitle);
  };

  const getDateLabel = (dateString) => {
    const today = new Date();
    const transactionDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    transactionDate.setHours(0, 0, 0, 0);

    const diffTime = today - transactionDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hari ini, ${dateString}`;
    } else if (diffDays === 1) {
      return `Kemarin, ${dateString}`;
    } else if (diffDays <= 3) {
      return `${diffDays} hari lalu, ${dateString}`;
    } else {
      return dateString;
    }
  };

  return (
    <div>
      <NavbarSide>
        <div className="m-2 mx-24 w-364 ">
          <div className="relative ml-auto w-fit">
            <input
              type="text"
              placeholder="Cari Riwayat.."
              className="focus:outline-none border-1 border-line p-2 ml-auto bg-tthird rounded-md pr-26 bg-white placeholder:text-primary"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
          </div>

          <div className="flex gap-32 mt-6">
            <div className="w-100 h-44 bg-white rounded-md border-1 border-line">
              <div className="m-4 space-y-4">
                <div className="text-2xl">Pemasukan</div>
                <div className="text-4xl font-bold text-primary">
                  Rp 4.547.950
                </div>
                <div className="flex justify-between">
                  <div className="text-lg text-tthird">dengan bulan lalu</div>
                  <div className="text-primary font-medium flex justify-between items-center">
                    <FaCaretUp />
                    +0.42%
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100 h-44 bg-white rounded-md border-1 border-line">
              <div className="m-4 space-y-4">
                <div className="text-2xl">Pengeluaran</div>
                <div className="text-4xl font-bold text-red-600">
                  Rp 10.547.950
                </div>
                <div className="flex justify-between">
                  <div className="text-lg text-tthird">dengan bulan lalu</div>
                  <div className="text-red-600 font-medium flex justify-between items-center">
                    <FaCaretDown />
                    +10.42%
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100 h-44 bg-white rounded-md border-1 border-line">
              <div className="m-4 space-y-4">
                <div className="text-2xl">Pemasukan</div>
                <div className="text-4xl font-bold ">Rp 4.547.950</div>
                <div className="flex justify-between">
                  <div className="text-lg text-tthird">dengan bulan lalu</div>
                  <div className="text-primary font-medium flex justify-between items-center">
                    <FaCaretUp />
                    +0.42%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-6 gap-10 text-tthird">
            <button
              onClick={prevMonth}
              className="cursor-pointer hover:text-primary"
            >
              <FaAngleLeft />
            </button>
            <div className="w-24 text-center">{prevMonthName}</div>
            <div className="w-24 text-center text-lg text-primary font-bold">
              {currentMonthName}
            </div>
            <div className="w-24 text-center">{nextMonthName}</div>
            <button
              onClick={nextMonth}
              className="cursor-pointer hover:text-primary"
            >
              <FaAngleRight />
            </button>
          </div>

          <div className="mt-16">
            <div className="bg-white h-140 rounded-md border-1 border-line overflow-hidden">
              <div className="m-6 space-y-6 h-full flex flex-col">
                <div className="text-xl sticky top-0 bg-white py-2 z-10">
                  {currentDateTitle}
                </div>

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide"
                >
                  <div data-title={getDateLabel("9 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                9 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-title={getDateLabel("9 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                9 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-title={getDateLabel("9 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                9 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div data-title={getDateLabel("8 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                8 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-title={getDateLabel("8 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                8 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-title={getDateLabel("8 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                8 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-title={getDateLabel("8 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                8 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-title={getDateLabel("8 Mei 2025")}>
                    <div className="flex justify-between">
                      <div className="bg-white w-full rounded-md border-1 border-line h-26 flex items-center hover:bg-line cursor-pointer duration-300 transition">
                        <div className="m-4 flex w-full justify-between items-center">
                          <div className="flex items-center gap-3">
                            <IoIosPaper className="text-3xl text-tthird" />
                            <div>
                              <div className="font-bold text-lg">
                                Membayar Hutang
                              </div>
                              <div className="text-sm text-tthird">
                                8 Mei 2025
                              </div>
                            </div>
                          </div>
                          <div className="text-red-700">-Rp 44.500</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavbarSide>
    </div>
  );
}
