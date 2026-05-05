export default function ButtonComponent({ disabled = false, title, onClick }) {
  return (
    <button disabled={disabled}
      onClick={onClick}
      type="button"
      className="bg-primary text-white px-8 py-2 rounded-lg cursor-pointer text-xl font-bold tracking-wider bg-linear-to-r from-primary to-secondary transition-colors hover:bg-[#1e6b57] hover:from-[#1e6b57] hover:to-[#1e6b57] duration-300"
    >
      {title}
    </button>
  );
}