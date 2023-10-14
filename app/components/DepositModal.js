"use client"
import React from 'react'

const DepositModal = ({value,setValue,button}) => {
    const handleChange=(e)=>{
        console.log(e.target);
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Form submitted");
    }
  return (
    <div className="fixed inset-0 z-10 bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
    <div className="bg-white w-96 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold my-2">ChitFundName</h2>
      <p>Organiser: <span>Organiser</span></p>
      <p>Total Amount: <span>totalAmount</span></p>
      <p>DepositAmount: <span>previousBid</span></p>
      <form onSubmit={handleSubmit}>
      <div className="mt-4">
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
          Deposit Amount
        </label>
        <input
          type="number"
          id="bidAmount"
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Enter your deposit"
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

export default DepositModal