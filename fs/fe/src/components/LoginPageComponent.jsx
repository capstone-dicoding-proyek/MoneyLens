export default function GreenRectangle({ children }) {
  return (
    <div className="auth-page-container">
      {/* Decorative ambient background */}
      <div className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 rounded-full bg-teal-300/15 blur-3xl" />

      <div className="w-full max-w-md relative z-10 my-auto py-6">
        {children}
      </div>
    </div>
  );
}