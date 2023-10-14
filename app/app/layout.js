import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import dynamic from 'next/dynamic';
import { StateContextProvider } from '@/context';
// import WalletConnectionProvider from '@/context/WalletConnectionProvider'
const WalletConnectionProvider=dynamic(()=>import("../context/WalletConnectionProvider"),{
  ssr:false,
});

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ditty',
  description: 'Decentralized kitty party application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <WalletConnectionProvider>
      <StateContextProvider>
        <NavBar/>
        <div className='flex gap-1'>
          <SideBar/>
          {children}
        </div>
      </StateContextProvider>
      </WalletConnectionProvider>
      </body>
    </html>
  )
}
