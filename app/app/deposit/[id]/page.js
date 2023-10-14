"use client"
import DepositModal from '@/components/DepositModal';
import React, { useState } from 'react'

const page = () => {
    const [deposit,setDeposit]=useState();
  return (
    <DepositModal
        button="Deposit"
        value={deposit}
    />
  )
}

export default page