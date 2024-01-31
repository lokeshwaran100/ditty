"use client"
import React from 'react'
import { NavContainer } from '@/components/custom/Container'
import { SiHiveBlockchain } from "react-icons/si";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { CreateDialog } from '@/components/custom/Dialog';
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
import { useWallet } from "@solana/wallet-adapter-react";

const Navbar = () => {
    const {publicKey}=useWallet();
  return (
    <NavContainer>
        <div className="flex items-center">
            <Link href="/" className=' flex items-center'>
            <SiHiveBlockchain className="text-2xl mr-2" />
            <h1 className="text-2xl font-semibold">BlockFund</h1>
            </Link>
        </div>
        <div className=' flex items-center gap-2'>
        {
            publicKey&&<CreateDialog><Button>Create Fund</Button></CreateDialog>
        }
        <div className='bg-black rounded-[5px] w-fit'>
        <WalletMultiButtonDynamic startIcon={<Button/>}/>
        </div>
        </div>
    </NavContainer>
  )
}

export default Navbar