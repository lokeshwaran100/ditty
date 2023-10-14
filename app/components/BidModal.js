"use client"
import { useStateContext } from '@/context'
// import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const TransactionModal = () => {
  const {isLoading,getChitFundStatus,program,publicKey,bid,deposit,loading,setIsLoading}=useStateContext();
  const {id:name,organiser}=useParams();
  
  const router=useRouter();


  const [value,setValue]=useState();
  const [fund,setFund]=useState();
  // to handle the change to the value
  const handleChange=(e)=>{
    setValue(e.target.value);
  }
  // a function to get the status from the blockchain
  const handleChitStatus=async (name,organiser)=>{
    try{
      const data=await getChitFundStatus(name,organiser);
      setFund(data);
      // console.log(fund);
    }
    catch(err)
    {
      console.log(err);
    }
  }
  useEffect(()=>{
    handleChitStatus(name,organiser)
    // console.log(fund);
  },[name,organiser,program]);

  // to handle the bid 
  const handleBid=async(e)=>{
    e.preventDefault();
    try{
      setIsLoading(true);
      await bid(organiser,publicKey,value,name)
      console.log("The Bid is initiated");
      setIsLoading(false);
      router.push('/');
    }
    catch(err)
    {
      console.log(err);
      setIsLoading(false);
    }
  }

  // to handle depositting the funds
  const handleDeposit=async(e)=>{
    e.preventDefault();
    try{
      setIsLoading(true);
      const depositAmount=fund.lowestBidAmount.words[0]/3;
      await deposit(name,publicKey,organiser,fund.bidWinner,depositAmount);
      console.log("The Deposit is initiated");
      setIsLoading(false);
      router.push('/');
    }
    catch(err)
    {
      console.log(err);
      setIsLoading(false);
    }
  }
  if(isLoading||!fund)
  {
    return <Loader/>
  }
  return (
      <div className="fixed inset-0 z-10 bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <div className="bg-white w-96 p-5 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold my-2 text-center">{fund.name}</h2>
        <p className='font-semibold'>Organiser: <span className=' text-slate-800 break-words font-normal'>{fund.organizer.toString()} </span></p>
        <p className='font-semibold'>Total Amount: <span className='text-slate-800 font-normal'>{fund.commitedAmount.toString()}</span></p>
        <p className='font-semibold'>Lowest Bid: <span className='text-slate-800 font-normal'>{fund.lowestBidAmount.words[0]}</span></p>
        <p className='font-semibold'>BiddingStatus:<span className={`${fund.status.hasOwnProperty('open')||fund.status.hasOwnProperty('biddingOpen')?'bg-green-400 text-white p-0.5 rounded-[5px]':'bg-red-500 text-white p-0.5 rounded-[5px]'} ml-2`}>{fund.status.hasOwnProperty('open')||fund.status.hasOwnProperty('biddingOpen')?"Active":"Closed"}</span></p>
        {(fund.status.hasOwnProperty('open')||fund.status.hasOwnProperty('biddingOpen'))?<form>
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
          onClick={handleBid}
        >
          Bid
        </button>
        </div>
        </form>:<form>
        <div className="mt-4">
          <label htmlFor="bidAmount" className=" text-center  mt-3  block text-sm font-medium text-gray-700">
            {(fund.bidWinner.toString()===publicKey.toString())?"You have won the bid":`You have to deposit ${fund.lowestBidAmount.words[0]/3}`}
          </label>
        </div>
        <div className='text-center'>
        {(fund.bidWinner.toString()!==publicKey.toString())&&<button
          className="mt-4 bg-blue-500 text-white rounded-md px-5 py-2 hover:bg-blue-600"
          onClick={handleDeposit}
        >
          Deposit
        </button>}
        </div>
        </form>}

      </div>
    </div>
    )
}

export default TransactionModal;