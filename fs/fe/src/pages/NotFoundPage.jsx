import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section class="grid h-screen place-items-center  px-6 py-24 sm:py-32 lg:px-8">
      <div class="text-center">
        <p class="text-base font-semibold text-primary">404</p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
          Page not found
        </h1>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold  shadow-xs hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/80 "
          ><span className="text-white">Go back home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
