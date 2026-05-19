import NavbarSide from "../components/NavbarSide";

export default function ProfilePage() {
  return (
    <div>
      <NavbarSide>
        <div className="m-10 mx-24 w-148 rounded-md bg-white border-1 border-line ">
          <div className="m-4">
            <div className="bg-line h-90 rounded-md">
              {/* Untuk Logo Profile didalam box */}
              <div></div>
              {/* Untuk Logo Profile didalam box */}
            </div>
            <div className="flex mt-4 justify-between items-center">
              <div className="text-2xl  font-bold">Profileku</div>
              <div className="text-tthird">dibuat tanggal 9 mei 2090</div>
            </div>
            <div className="mt-14 m-4 space-y-10">
              {/* Username */}
              <div className="">
                <input
                  type="text"
                  className="text-lg focus:outline-none"
                  placeholder="Username"
                />
                <hr className="text-tthird" />
              </div>
              {/* Email */}
              <div className="">
                <input
                  type="email"
                  className="text-lg focus:outline-none"
                  placeholder="Email"
                />
                <hr className="text-tthird" />
              </div>
              {/* Password */}
              <div className="">
                <input
                  type="password"
                  className="text-lg focus:outline-none"
                  placeholder="Password"
                />
                <hr className="text-tthird" />
              </div>

              <button className="cursor-pointer text-2xl mt-10 font-bold bg-primary text-white p-2 items-center px-6 rounded-md hover:bg-secondary duration-300 transition">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </NavbarSide>
    </div>
  );
}
