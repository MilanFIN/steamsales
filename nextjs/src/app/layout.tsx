"use client"

import './globals.css'
import { Inter } from 'next/font/google'

import {store} from '../store/store'
import { Provider } from 'react-redux';


const inter = Inter({ subsets: ['latin'] })

/*export const metadata = {
  title: 'Steamsales',
  description: 'tbd',
}
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>

      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Provider>
  )
}
