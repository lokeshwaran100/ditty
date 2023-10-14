"use client"
import Image from 'next/image'
import { useStateContext } from '@/context';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import DisplayCampiagns from '@/components/DisplayChitFunds';


export default function Home() {
  const {chitFunds,publicKey,isLoading,getMyChitFunds,program}=useStateContext();
  // console.log(chitFunds);  
  // to store all the chitfunds the user has subscribed to 
  const [funds, setFunds] = useState([]);
  useEffect(()=>{
      // to filter out only those which the user has joined
      setFunds(getMyChitFunds());
  },[chitFunds,program])
    // if in loading state
  if(isLoading)
  {
    return <Loader/>
  }
  return (
    <main className="">
      <DisplayCampiagns
        chitFunds={funds}
      />
    </main>
  )
}
