import type { AppProps } from "next/app";

import Link from "next/link";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100">
      <div className="w-full h-12 bg-gray-900 space-x-6 pl-4">
        <Link className="text-2xl align-middle" href="/">
          Home
        </Link>
        <Link className="text-2xl align-middle" href="/top100">
          Top 100
        </Link>
        <Link className="text-2xl align-middle" href="/featured">
          Featured
        </Link>
        <span className="text-2xl "></span>
      </div>
      <Component {...pageProps} />
    </main>
  );
}
