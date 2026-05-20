import CurveBgComponent from './CurveBgComponent';

export default function GreenRectangle({ children }) {
  return (
    <div className="relative">
      <div
        className="absolute w-360 md:w-324  h-screen bg-white max-sm:w-screen max-sm:clip-circle-responsive max-sm:[clip-path:circle(95%_at_5%_10%)]
      [clip-path:circle(100%_at_5%_50%)] md:[clip-path:circle(95%_at_5%_10%)]
      [clip-path:circle(100%_at_5%_50%)]"
      >
        {children}
      </div>
      <div className='overflow-hidden  lg:top-0 lg:right-0 lg:h-screen -z-10 absolute  max-lg:transform max-lg:rotate-90  max-lg:hidden  '>
        <CurveBgComponent />
      </div>

    </div>
  );
}
