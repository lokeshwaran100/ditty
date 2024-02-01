import React, { useEffect, useState } from 'react'
// import { useStateContext } from '@/context'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {FC} from 'react'
import { Button } from '../ui/button'
export type ChitFunsCardProps={
    handleClick:()=>void,
    ChitFundName:string,
    Organiser:string,
    Participants:string[],
    TotalPot:number,
    Status:string
}

export const ChitFundCard:FC<ChitFunsCardProps> = ({handleClick,ChitFundName,Organiser,Participants,TotalPot,Status}) => {
//   const {isLoading}=useStateContext();
//   if(isLoading)
//   {
//     return <Loader/>
//   }
  return (
    <Card className=' cursor-pointer hover:scale-105 hover:bg-gray-200  transition-all duration-300 px-2 py-4 rounded border-[2px] border-[#F1F5F9]'>
        <CardHeader>
        <CardTitle>{ChitFundName.slice(0,15)}</CardTitle>
        <CardDescription>You can place your bids or deposit your amount</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3 justify-between mr-4 my-2'>
      <div className='flex justify-between'>
        <div>
          <p className='text-slate-700'>TotalPot:</p> 
          <p>{TotalPot} Lamport</p>
        </div>
          <div>
              <p className='text-slate-700'> Current bid: </p>
              <p>...</p>
          </div>
        </div>
            <div>
            <p className='text-slate-700'>Organiser</p>
                <p className=" text-[10px] whitespace-normal break-words">{Organiser}</p>
            </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className='text-slate-700'>Status <span className={`${Status=='Open'?'text-green-500 font-semibold p-0.5 rounded-[5px]':'text-red-500 font-semibold text-xl p-0.5 rounded-[5px]'} ml-2`}>{Status==="Open"&&"Active"}</span></p>
        {Status==='Open'?<Button onClick={handleClick} variant={"secondary"}>Open</Button>
        :
        <Button variant={"secondary"} >Deposit</Button>}
      </CardFooter>

    </Card>

  )
}

