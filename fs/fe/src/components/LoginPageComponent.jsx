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
      <div className="w-screen h-screen bg-linear-to-bl from-[#2FA084] to-[#6FCF97] "></div>
    </div>
  );
}
