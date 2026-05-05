export default function FormAuthComponent({ children }){
  return (
    <form  className='space-y-14 mt-8 max-sm:space-y-10 '>
      {children}
    </form>
  );
}