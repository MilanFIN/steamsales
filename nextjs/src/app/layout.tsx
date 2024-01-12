import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Steamsales",
    description: "Steam sales and featured/discounted games lists",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="w-full min-h-screen bg-gradient-to-b from-gray-800 to-gray-900   text-gray-100">
                    <div className="w-full h-12 bg-gray-900 space-x-6 pl-4">
                        <Link className="text-2xl align-middle" href="/">
                            Home
                        </Link>
                        <Link className="text-2xl align-middle" href="/top100">
                            Top 100
                        </Link>
                        <Link
                            className="text-2xl align-middle"
                            href="/featured"
                        >
                            Featured
                        </Link>
                        <span className="text-2xl "></span>
                    </div>
                    <div className=" pt-2 ">{children}</div>
                </div>
            </body>
        </html>
    );
}
