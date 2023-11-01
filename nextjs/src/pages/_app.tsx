import type { AppProps } from "next/app";

import Link from "next/link";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100">
      <Link className="border-2" href="/">
        Home
      </Link>
      <Link className="border-2" href="/top100">
        Top 100
      </Link>{" "}
      <Link className="border-2" href="/featured">
        Featured
      </Link>
      <Component {...pageProps} />
    </main>
  );
}
