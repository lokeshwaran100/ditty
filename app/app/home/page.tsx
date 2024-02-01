"use client"
import React from 'react'
import DisplayChitFunds from '@/components/ShowChitFunds'

const chitFunds=[
  {
      ChitFundName:'ChitFund1',
      Organiser:'Organiser1',
      participants:["1","2","3"],
      totalPot:100,
      status:"Close"
  },
  {
      ChitFundName:'ChitFund2',
      Organiser:'Organiser2',
      participants:["1","2","3"],
      totalPot:100,
      status:"Open"
  },
  {
      ChitFundName:'ChitFund3',
      Organiser:'Organiser3',
      participants:["1","2","3"],
      totalPot:100,
      status:"Open"
  },
  {
      ChitFundName:'ChitFund4',
      Organiser:'Organiser4',
      participants:["1","2","3"],
      totalPot:100,
      status:"Open"
  },
  {
      ChitFundName:'ChitFund5',
      Organiser:'Organiser5',
      participants:["1","2","3"],
      totalPot:100,
      status:"Open"
  },
  {
      ChitFundName:'ChitFund6',
      Organiser:'Organiser6',
      participants:["1","2","3"],
      totalPot:100,
      status:"Open"
  },
  {
      ChitFundName:'ChitFund7',
      Organiser:'Organiser7',
      Participants:["1","2","3"],
      TotalPot:100,
      Status:"Open"
  },
]

const page = () => {
  return (
    <div>
      <DisplayChitFunds
      chitFunds={chitFunds}
        ></DisplayChitFunds>
    </div>
  )
}

export default page