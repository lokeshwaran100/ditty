"use client"
import React, { useEffect, useState } from 'react'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { useStateContext } from '@/context'
import { useWallet } from '@solana/wallet-adapter-react'
import Loader from '@/components/Loader'

const CreateComponent = () => {
  // to get fetch the function from StateContext
  const {createChitFund,url,isLoading}=useStateContext();

  const {publicKey}=useWallet();

  // to load the Organizer address everytime the form loads

  // to display the creation message
  const [isCreated,setIsCreated]=useState(false);
  const [form,setForm]=useState({
    Organizer:'',
    FundName:'',
    Description:'',
    TotalPot:''
  });
  const [joinUrl, setJoinUrl] = useState(url);

  useEffect(()=>{
    setForm({...form,Organizer:publicKey})
  },[publicKey])

  // update the form
  const handleFormChange=(e)=>{
    // console.log(e.target);
    const {value,name,isLoading}=e.target;
    setForm({...form,[name]:value});
  }

  // to handle the form data upon submision
  const handleFormSubmit=async (e)=>{
    e.preventDefault();
    if(publicKey)
    {
      // setForm({...form,Organizer:publicKey,Id:count})
      await createChitFund(form);
      setIsCreated(true);
      // console.log("form",form);
      setJoinUrl(`${url+"join/"}${form.FundName}/${form.Organizer}`)
      setForm(
        {
          FundName:'',
          Description:'',
          TotalPot:''
        }
      );
    }
    else{
      console.log("please connect your wallet");
    }
    // console.log(form);
  }

  // if in loading state
  if(isLoading)
  {
    return <Loader/>
  }
  return (
    
    <div className=' mx-60 my-[20px]'>
    <div className='bg-[#ccffff]	 p-8 rounded-[10px] flex flex-col'>
    <div className=" tracking-wider text-black font-epilogue text-2xl rounded-[10px] px-10 py-2 mx-auto font-bold">
      Create Your ChitFund
    </div>
    <form onSubmit={handleFormSubmit}>
    <div className='flex gap-1'>
        <FormField
          label="FundName"
          isTextArea={false}
          placeholder="Enter your Chit Fund Name"
          handleChange={(e)=>{handleFormChange(e)}}
          value={form.FundName}
        />
      </div>
      <div>
        <FormField
          label="Description"
          isTextArea={true}
          placeholder="Why are u creating this Fund?"
          handleChange={(e)=>{handleFormChange(e)}}
          value={form.Description}
        />
      </div>
      <div className='flex gap-1'>
      <FormField
          label="TotalPot"
          placeholder="LAMPORTS"
          handleChange={(e)=>{handleFormChange(e)}}
          value={form.TotalPot}
        />
      </div>
      <div className='mx-auto flex flex-col justify-center'>
        <CustomButton 
          name="Submit"
          styles=" mx-auto max-w-[200px] bg-blue-500 text-white rounded-[4px] mt-4 py-2 px-6"
          btnType="submit"
        />
        {isCreated&&<p className='whitespace-normal break-words font-semibold mt-2 mx-auto '>Your ChitFund Created Successfully! <br /> <span className='whitespace-normal break-words'>Unique url: {joinUrl}</span> </p>}
      </div>
    </form>
    </div>
    </div>
  )
}

export default CreateComponent