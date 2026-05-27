import NavbarSide from './NavbarSide';

export default function LayoutMainContent({ children, isOpen, onChangeIsOpen }) {
  return (
    <section className="flex h-screen overflow-hidden ">
      <NavbarSide isOpen={isOpen} onChangeIsOpen={onChangeIsOpen} />
      {children}
      {isOpen &&
    (<div onClick={onChangeIsOpen} className="absolute z-40 w-screen h-screen bg-black/75"></div>)
      }
    </section>
  );
}
