"use client"
import Image from 'next/image'
import { useStateContext } from '@/context';
import { useEffect } from 'react';

export default function Home() {
  const {chitFunds,publicKey}=useStateContext();
  console.log(chitFunds);  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      page
    </main>
  )
}
