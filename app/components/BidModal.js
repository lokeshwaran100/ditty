"use client"
import { useStateContext } from '@/context'
// import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import React from 'react'

const TransactionModal = ({value,setValue,button,ChitFundName,Organiser,TotalPot,PreviousBid}) => {
  const {bid,publicKey}=useStateContext();
  // to call when the value is changed
  const handleChange=(e)=>{
    setValue(e.target.value);
  }
  // to call when the user will bid
  const handleSubmit=async (e)=>{

    e.preventDefault();
    // console.log(publicKey);
    if(publicKey)
    {
      await bid(Organiser,publicKey,value,ChitFundName);
    }
    else{
      console.log("please connect your wallet");
    }
  }
  return (
    <div className="fixed inset-0 z-10 bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
    <div className="bg-white w-96 p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold my-2 text-center">{ChitFundName}</h2>
      <p className='font-semibold'>Organiser: <span className=' text-slate-800 break-words font-normal'>{Organiser}</span></p>
      <p className='font-semibold'>Total Amount: <span className='text-slate-800 font-normal'>{TotalPot}</span></p>
      <p className='font-semibold'>Previous Bid: <span className='text-slate-800 font-normal'>{PreviousBid}</span></p>
      <form onSubmit={handleSubmit}>
      <div className="mt-4">
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
          Bid Amount
        </label>
        <input
          type="number"
          id="bidAmount"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Enter your bid"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className='text-center'>
      <button
        className="mt-4 bg-blue-500 text-white rounded-md px-5 py-2 hover:bg-blue-600"
      >
        {button}
      </button>
      </div>
      </form>
    </div>
  </div>
  )
}

export default TransactionModal