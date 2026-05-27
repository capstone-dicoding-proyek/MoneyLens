import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoIosClose } from 'react-icons/io';

export default function ModalTypeComponent({
  setIsOpen,
  isOpen,
  buttons,
  activeType,
  icon = true
}) {
  return (
    <>
      <div className="relative ml-auto">
        <button
          type="button"
          onClick={setIsOpen}
        >
          <HiOutlineDotsVertical className="text-xl text-tthird active:opacity-75" />
        </button>
        <div
          className={`${isOpen ? 'block' : 'hidden'} absolute right-0 top-8 z-50 w-38 rounded-xl border border-line bg-white shadow-lg p-2 flex flex-col gap-1`}
        >
          {buttons.map((b) => (
            <button
              key={b.type}
              onClick={b.onHandle}
              type="button"
              className={`w-full flex justify-between items-center text-tthird text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition ${
                activeType === b.type ? 'bg-gray-100' : ''
              }`}
            >
              <span>{b.title}</span>
              {activeType === b.type && <IoIosClose className={`text-xl ${icon ? 'block' : 'hidden'}`} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
