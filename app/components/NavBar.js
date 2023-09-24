import React from 'react'
import Image from 'next/image'
import { logo } from '@/assets'

const NavBar = () => {
  return (
    <div className='bg-[#ccffff]'>
        <nav className=" mx-8 p-4">
        <div className="flex items-center  justify-between">
            <Image src={logo} alt="Your Logo" className="w-12 h-auto" />
            <h1 className='text-2xl font-bold '>Ditty</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Connect</button>
        </div>
        </nav>
    </div>
  )
}

export default NavBar;