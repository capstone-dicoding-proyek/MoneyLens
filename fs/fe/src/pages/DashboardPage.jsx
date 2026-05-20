import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getTransactionChart, getTransactionDashboard } from '../api/transaction';
import NavbarSide from '../components/NavbarSide';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import { MdFastfood } from 'react-icons/md';
import { FaBox } from 'react-icons/fa';
import { IoIosPaper } from 'react-icons/io';

export default function DashboardPage() {
  const { user } = useAuth();

  const [transactionChart, setTransactionChart] =
    useState([]);
  const [transactionDashboard, setTransactionDashboard
  ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chart = await getTransactionChart();
        const dashboard =
          await getTransactionDashboard();

        setTransactionChart(chart.data);
        setTransactionDashboard(dashboard.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <NavbarSide>
        <div className="m-10 mx-24 w-364">
          <div className="flex items-center justify-between">
            <div className="font-bold text-2xl">
              Money<span className="font-extralight">Lens</span>
            </div>
            <IoIosNotificationsOutline className="cursor-pointer text-3xl text-tthird hover:text-amber-300 duration-300 transition" />
          </div>
          <div className="space-y-6 md:space-y-2">
            <div className="text-tthird text-lg mt-12 md:text-md">
              Pengeluaran Bulan Ini
            </div>
            <div className="items-center flex justify-between">
              <div className="text-4xl md:text-3xl">
                Rp <span className="font-bold">502.095</span>
              </div>
              <button className="bg-primary md:text-md hover:bg-secondary duration-300 transition rounded-md p-2 px-4 text-white font-bold text-lg cursor-pointer flex items-center gap-2">
                <IoMdAdd />
                Catat
              </button>
            </div>

            <div className="items-center flex justify-between">
              <div className="text-tthird">
                Selamat Anda Hemat{' '}
                <span className="text-primary">Rp 900.000</span> Bulan Ini!
              </div>
              <div className="text-primary">+0.42%</div>
            </div>
          </div>

          <div className="flex gap-4 mt-24 ">
            {/* Box Pengeluaran */}
            <div className="bg-white  w-218 h-86 rounded-md border-1 border-line">
              <div className="m-4 space-y-6">
                <div className="text-xl">Pengeluaran Saya</div>

                {/* Box */}
                <div
                  className="flex gap-4 overflow-x-auto scrollbar-hide active:cursor-grabbing"
                  onWheel={(e) => {
                    if (e.deltaY !== 0) {
                      e.currentTarget.scrollLeft += e.deltaY;
                      e.preventDefault();
                    }
                  }}
                >
                  {/* In Container */}
                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <MdFastfood className=" text-3xl" />
                      </div>
                      <div className="text-md">Makanan & Minuman</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <FaBox className=" text-3xl" />
                      </div>
                      <div className="text-md">Barang Elektronik</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <MdFastfood className=" text-3xl" />
                      </div>
                      <div className="text-md">Makanan & Minuman</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <MdFastfood className=" text-3xl" />
                      </div>
                      <div className="text-md">Makanan & Minuman</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <MdFastfood className=" text-3xl" />
                      </div>
                      <div className="text-md">Makanan & Minuman</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <MdFastfood className=" text-3xl" />
                      </div>
                      <div className="text-md">Makanan & Minuman</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  <div className="bg-white w-58 h-64 rounded-md cursor-pointer border-1 border-line hover:bg-line transition duration-300 flex-shrink-0">
                    <div className="p-4 pt-10 space-y-2">
                      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-md">
                        <MdFastfood className=" text-3xl" />
                      </div>
                      <div className="text-md">Makanan & Minuman</div>
                      <div className="font-bold text-2xl">Rp209.300</div>
                      <div className="text-sm text-tthird">
                        Pengeluaran ini sebesar{' '}
                        <span className="text-primary font-bold">22%</span> dari
                        total seluruh pengeluaran Anda
                      </div>
                    </div>
                  </div>

                  {/* End In Container */}
                </div>
                {/* Box End */}
              </div>
            </div>
            {/* Box Pengeluaran End */}

            {/* Graph */}
            <div className="bg-white w-143 rounded-md border-1 border-line"></div>
          </div>

          <div className="bg-white mt-4 h-48 rounded-md border-1 border-line">
            <div className="m-5  space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl">Aktivitas Terbaru</div>
                <div className="text-tthird hover:text-primary cursor-pointer">
                  Selengkapnya...
                </div>
              </div>

              <div
                className="flex overflow-x-auto gap-4 scrollbar-hide"
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                    e.preventDefault();
                  }
                }}
              >
                {/* Box Aktivitas Terbaru */}
                <div className="flex justify-between">
                  <div className="bg-white w-100 rounded-md border-1 border-line h-26 flex  items-center hover:bg-line cursor-pointer duration-300 transition">
                    <div className="m-4 flex w-full justify-between items-center">
                      <div className="flex items-center gap-3">
                        <IoIosPaper className="text-3xl text-tthird" />
                        <div>
                          <div className="font-bold text-lg">
                            Membayar Hutang
                          </div>
                          <div className="text-sm text-tthird">8 Mei 2025</div>
                        </div>
                      </div>
                      <div className="text-red-700">-Rp 44.500</div>
                    </div>
                  </div>
                </div>
                {/* End Box Aktivitas Terbaru */}
                {/* Box Aktivitas Terbaru */}
                <div className="flex justify-between">
                  <div className="bg-white w-100 rounded-md border-1 border-line h-26 flex  items-center hover:bg-line cursor-pointer duration-300 transition">
                    <div className="m-4 flex w-full justify-between items-center">
                      <div className="flex items-center gap-3">
                        <IoIosPaper className="text-3xl text-tthird" />
                        <div>
                          <div className="font-bold text-lg">
                            Membayar Hutang
                          </div>
                          <div className="text-sm text-tthird">8 Mei 2025</div>
                        </div>
                      </div>
                      <div className="text-red-700">-Rp 44.500</div>
                    </div>
                  </div>
                </div>
                {/* End Box Aktivitas Terbaru */}
                {/* Box Aktivitas Terbaru */}
                <div className="flex justify-between">
                  <div className="bg-white w-100 rounded-md border-1 border-line h-26 flex  items-center hover:bg-line cursor-pointer duration-300 transition">
                    <div className="m-4 flex w-full justify-between items-center">
                      <div className="flex items-center gap-3">
                        <IoIosPaper className="text-3xl text-tthird" />
                        <div>
                          <div className="font-bold text-lg">
                            Membayar Hutang
                          </div>
                          <div className="text-sm text-tthird">8 Mei 2025</div>
                        </div>
                      </div>
                      <div className="text-red-700">-Rp 44.500</div>
                    </div>
                  </div>
                </div>
                {/* End Box Aktivitas Terbaru */}
                {/* Box Aktivitas Terbaru */}
                <div className="flex justify-between">
                  <div className="bg-white w-100 rounded-md border-1 border-line h-26 flex  items-center hover:bg-line cursor-pointer duration-300 transition">
                    <div className="m-4 flex w-full justify-between items-center">
                      <div className="flex items-center gap-3">
                        <IoIosPaper className="text-3xl text-tthird" />
                        <div>
                          <div className="font-bold text-lg">
                            Membayar Hutang
                          </div>
                          <div className="text-sm text-tthird">8 Mei 2025</div>
                        </div>
                      </div>
                      <div className="text-red-700">-Rp 44.500</div>
                    </div>
                  </div>
                </div>
                {/* End Box Aktivitas Terbaru */}
              </div>
            </div>
          </div>
        </div>
      </NavbarSide>
    </div>
  );
}

