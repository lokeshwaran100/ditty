"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useStateContext } from '@/context'

const page = () => {
    // to get the name of the group form the url
    const {id}=useParams();
    // console.log("in the join",id);
    // http://localhost:3000/join/MoneyCircle+EKfM2mArvj1FP7B6WxN5MabfmwRd9AmSR1MwPaAzhGy8
    const name=id.substring(0,id.search('%'));
    const ownerAddress=id.substring(id.search('%2B')+3,id.length);
    console.log(name,ownerAddress);
    const {addParticipant}=useStateContext();

    const router=useRouter();
    // to handle the join group button
    const handleClick=async()=>{
        console.log("You joined ",name);
        await addParticipant(name,ownerAddress);
        router.push("/");
    }
    return (
        <div className="w-full flex justify-center ">
        <div className='bg-[#ccffff] my-10 text-center font-semibold  p-5 w-[400px] max-h-[300px] rounded-[10px] flex justify-center items-center flex-col lg:mr-[300px]'>
            <div className=' leading-8 text-2xl py-3 mb-[28px]'>
                Are you sure you want<br/> to join {name}
            </div>
            <button className=' text-white py-2 px-5 bg-[#3B82F6] rounded-[5px]' onClick={handleClick}>Join</button>
        </div>

        </div>
    )
}

export default page;