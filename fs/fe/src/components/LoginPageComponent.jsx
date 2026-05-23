import CurveBgComponent from './CurveBgComponent';

export default function GreenRectangle({ children }) {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className=" max-lg:flex max-lg:justify-center max-lg:items-center h-full w-full max-lg:p-[4%] relative z-10">
        {children}
      </div>
      <div className='overflow-hidden  lg:top-0 lg:right-0 lg:h-screen -z-10 absolute  max-lg:transform max-lg:rotate-90  max-lg:hidden  '>
        <CurveBgComponent />
      </div>

    </div>
  );
}