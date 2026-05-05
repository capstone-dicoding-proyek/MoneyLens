export default function LayoutAuthComponent({ children }) {
  return (
    <div id="layout-auth" className="lg:pl-[10%] lg:pt-[10%] font-secondary tracking-wider w-max h-max " >
      {children}
    </div>
  );
}