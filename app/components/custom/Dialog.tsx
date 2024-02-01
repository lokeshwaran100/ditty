import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "@/components/ui/label"
import { ChangeEvent, FormEvent, FormEventHandler, ReactNode, useState } from "react"
import { useWallet }from "@solana/wallet-adapter-react";
import Image from "next/image"
import copy from 'clipboard-copy';
 
export function CreateDialog({children} : {children:ReactNode}) {
// to display the creation message
  const [isCreated,setIsCreated]=useState(false);
  const {publicKey}=useWallet();
  const [form,setForm]=useState({
    Organizer: publicKey?.toString(),
    FundName:'',
    Description:'',
    TotalPot:''
  });
    // update the form
    const handleInputChange=(e:ChangeEvent<HTMLInputElement>)=>{
        // console.log(e.target);
        const {value,name}=e.target;
        setForm({...form,[name]:value});
    }
    const handleTextAreaChange=(e:ChangeEvent<HTMLTextAreaElement>)=>{
        // console.log(e.target);
        const {value,name}=e.target;
        setForm({...form,[name]:value});
    }
    //   for form submission
    const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        //   // setForm({...form,Organizer:publicKey,Id:count})
        //   await createChitFund(form);
        //   setIsCreated(true);
        //   // console.log("form",form);
        //   setJoinUrl(`${url+"join/"}${form.FundName}/${form.Organizer}`)
        console.log("form created",form);
        setIsCreated(true);
    }
    // to handle copy messages
    const [copied,setCopied]=useState(false);
    const handleCopy=(e: React.MouseEvent<HTMLButtonElement>)=>{
        console.log("You are in copy");
        // a function to generate a random url
        const generateRandomURL = () => {
            let randomURL = `${process.env.NEXT_PUBLIC_URL}/join/${form.FundName}/${form.Organizer}`;
            return randomURL;
          };
        copy(generateRandomURL());
        setCopied(true);
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chit Fund</DialogTitle>
          <DialogDescription>
            Fill in the all the details and the total money locked to create a Chitfund
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-sm">
              Name:
            </Label>
            <Input id="name" name="FundName" value={isCreated?"":form.FundName} className="col-span-3" placeholder="Fund Name" onChange={handleInputChange}/>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="username" className="text-right mt-3 text-sm">
            Description:
            </Label>
            <Textarea id="username" name="Description" value={isCreated?"":form.Description} placeholder="Why are you creating this Fund?" className="col-span-3" onChange={handleTextAreaChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right text-sm">
              TotalPot:
            </Label>
            <Input id="username" name="TotalPot" value={isCreated?"":form.TotalPot} type="number" placeholder="LAMPORTS" className="col-span-3" onChange={handleInputChange} />
          </div>
        </div>
        <p className='whitespace-normal break-words font-semibold mt-2 mx-auto text-green-600'>ChitFund Created Successfully!</p>

        <DialogFooter>
            {
                isCreated?<CopyButton copied={true} onClick={handleCopy}/>:<Button type="submit" onClick={handleButtonClick} onSubmit={handleButtonClick}>Create</Button>
            }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const CopyButton=({copied,onClick}:{copied:boolean,onClick: React.MouseEventHandler<HTMLButtonElement>})=>{
    return (
        <Button onClick={onClick}>
            <Image className=' transition-all duration-300' src={(copied)?"/assets/tick.svg":"/assets/copy.svg"} alt='copy' height={20} width={20}/>
            <span>{(copied)?'URL Copied':'Copy URL'}</span>
        </Button>
    )
}