import React, { useEffect, useState } from 'react'
import { useStateContext } from '@/context'
import Loader from './Loader';

const Card = ({handleClick,ChitFundName,Organiser,Participants,TotalPot,Status}) => {
  const {isLoading}=useStateContext();
  if(isLoading)
  {
    return <Loader/>
  }
  return (
    <div className='bg-[#ccffff] rounded-[10px] p-2'>
      <h1 className=' my-2 text-xl text-center font-semibold'>{ChitFundName.slice(0,15)}</h1>
      <div className='flex flex-col gap-3 justify-between mr-4 my-2'>
      <div className='flex justify-between'>
        <div>
          <p className='text-slate-700'>TotalPot:</p> 
          <p>{TotalPot} Sol</p>
        </div>
          <div>
              <p className='text-slate-700'> Current bid: </p>
              <p>10 Sol</p>
          </div>
        </div>
            <div>
            <p className='text-slate-700'>Organiser</p>
                <p className=" text-[10px] whitespace-normal break-words">{Organiser}</p>
            </div>
            <div className='flex justify-between items-center'>
                <p className='text-slate-700'>Status <span className={`${Status=='Open'?'bg-green-400 text-white p-0.5 rounded-[5px]':'bg-red text-white p-0.5 rounded-[5px]'} ml-2`}>{Status==="Open"&&"Active"}</span></p>
                {Status==='Open'?<button onClick={handleClick} className=' bg-blue-600 text-white py-0.5 px-2 rounded-[5px]'>Open</button>
                :
                <button className='bg-blue-600 text-white py-0.5 px-2 rounded-[5px]'>Deposit</button>}
            </div>
        </div>
    </div>
  )
}

export default Card