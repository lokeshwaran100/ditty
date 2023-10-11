import React from 'react'
import Card from './ChitFundCard';
import { useRouter } from 'next/navigation'

const DisplayChitFunds = ({chitFunds}) => {
    console.log("In display campagns",chitFunds);
    // a function to handle the click on a card
    const router=useRouter();
    // to handle naviagtion to the bid route
    const handleClick=(name,organiser)=>{
      console.log("You clicked on",name);
      router.push(`/bid/${name}/${organiser}`);
    } 
  return (
    <div className='px-10 '>
        <h1 className=' text-2xl ml-4 mt-4 font-semibold'>
            ChitFunds ({chitFunds&&chitFunds.length})
        </h1>
        <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-[20px] grid-cols-1 mt-10'>
        {/* map through the chitfund array and create a card for each */}
        {chitFunds?.map((fund)=>{
          return <Card key={fund.ChitFundName} {...fund} handleClick={()=>handleClick(fund.ChitFundName,fund.Organiser)}/>
        })}
        </div>
    </div>
  )
}

export default DisplayChitFunds