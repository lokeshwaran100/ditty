"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { logo } from '@/assets'
import dynamic from 'next/dynamic';
import {AiOutlineMenu,AiOutlineClose} from "react-icons/ai";
import { MenuItems } from './SideBar';
import { NavLinks } from '@/constants';
import { useRouter } from 'next/navigation';
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const NavBar = () => {
  // // to handle the navabr for mobile 
  const [navMenu,setNavMenu]=useState(false);
  const router=useRouter();
  const [isActive, setIsActive] = useState("dashboard")

  // to open the navmenu
  const handleOpen=()=>{
    setNavMenu(true);
  }
  const handleClose=()=>{
    setNavMenu(false);
  }

  return (
    <div className=''>
        <nav className=" lg:mx-8 p-4">
        <div className='flex justify-between'>
        <div className=" w-full flex flex-1 items-center justify-start lg:justify-between">
            <Image src={logo} alt="Your Logo" className="w-12 h-auto" />
            <h1 className='text-2xl font-bold '>Ditty</h1>
            {/* <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Connect</button> */}
            <div className='hidden lg:block'>
            <WalletMultiButtonDynamic startIcon={<button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"/>}/>
            </div>
        </div>
        <div className='lg:hidden  md:block sm:block flex justify-end items-center'>
        {
            (!navMenu)?
            <button onClick={handleOpen}><AiOutlineMenu className='w-8 h-8'/></button>
            :
            <button onClick={handleClose}><AiOutlineClose className='w-8 h-8'/></button>
        }
        </div>
        </div>
        <div className={`lg:hidden ${navMenu?`h-[100vh] w-[100vw]`:'hidden'}`}>
        <div className='ml-3 h-[100vh] my-4 px-2 py-3 lg:flex w-full justify-between flex-col'>
        {
            NavLinks.map((link)=>{
                return (
                    <MenuItems
                        key={link.name}
                        name={link.name}
                        icon={link.svg}
                        active={isActive}
                        handleClick={()=>{
                            setIsActive(link.name);
                            router.push(link.link);
                            setNavMenu(false);
                        }}
                    />
                )
            })
        }
        <div className=' mx-3 my-5 hover:bg-blue-500 hover:opacity-[90%] bg-blue-500 w-[152px] rounded cursor-pointer'>
          <WalletMultiButtonDynamic startIcon={<button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"/>}/>
        </div>
    </div>
        </div>
        </nav>
        {/* navbar for mobile  */}

    </div>
  )
}

export default NavBar;