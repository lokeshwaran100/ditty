"use client"
import React from 'react'
import Loader from '@/components/Loader'
import { useStateContext } from '@/context'
const page = () => {
  const {chitFunds,publicKey,isLoading,getCreatedChitFunds,program}=useStateContext();
  // to store all the chitfunds the user has subscribed to 
  const [funds, setFunds] = useState([]);
  useEffect(()=>{
      // to filter out only those which the user has joined
      setFunds(getCreatedChitFunds());
  },[chitFunds,program])
  // if in loading state
  if(isLoading)
  {
    return <Loader/>
  }
  return (
    <DisplayCampiagns
    chitFunds={funds}
  />
  )
}

export default page