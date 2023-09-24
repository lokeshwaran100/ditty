import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import dynamic from 'next/dynamic';
// import WalletConnectionProvider from '@/context/WalletConnectionProvider'
const WalletConnectionProvider=dynamic(()=>import("../context/WalletConnectionProvider"),{
  ssr:false,
});

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <WalletConnectionProvider>
      <NavBar/>
      <div className='flex gap-1'>
        <SideBar/>
        {children}
      </div>
      </WalletConnectionProvider>
      </body>
    </html>
  )
}
