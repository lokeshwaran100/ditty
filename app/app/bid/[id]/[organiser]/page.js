"use client"
import TransactionModal from '@/components/BidModal'
import React, { useEffect, useState } from 'react'
import {useParams} from 'next/navigation'
import { useStateContext } from '@/context'

const page = () => {
  const [bid,setBid]=useState();
  const [fund,setFund]=useState({
    Organiser:" ",
    TotalPot:0,
    Prevbid:" ",
    ChitFundName:" "
  });

  // usiing state context
  const {getFundDetails,getChitFundStatus}=useStateContext()
  const {id:name,organiser}=useParams();
  useEffect(()=>{
    setFund(getFundDetails(name));
    console.log("bid value",fund);
    console.log("ChitFund Status",getChitFundStatus(name,organiser));
  },[]);

  return (
    <TransactionModal
        button="Bid"
        ChitFundName={fund.ChitFundName}
        value={bid}
        setValue={setBid}
        Organiser={fund.Organiser}
        TotalPot={fund.TotalPot}
        PreviousBid={10}
    />
  )
}

export default page