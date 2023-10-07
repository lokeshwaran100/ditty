"use client"
import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { idl,CHIT_FUND_PUBLICKEY } from "@/constants";
import * as anchor from "@project-serum/anchor";
import { useConnection,useWallet,useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import axios from "axios";
const StateContext=createContext();

const StateContextProvider=({children})=>{
    const url="http://localhost:3000/";
    // to connect to the smart contracts
    const {connection}=useConnection();
    const {publicKey}=useWallet();
    const anchorwallet=useAnchorWallet();

    // a fucntion to fetch all the chitFunds
    const fetchChitFunds=async()=>{
        try{
            const data=await axios.get(`${url}api/allFunds`);
            return data.data.message;
        }
        catch(err)
        {
            console.log(err);
        }
    }
    // to keep track of all the created chitfunds
    const [chitFunds,setChitFunds]=useState([]);

    useEffect(() => {
        setChitFunds(fetchChitFunds()); // Call the function to fetch data when the component mounts
      }, [url]);

    // to connect to the smart contract
    const program=useMemo(()=>{
        if(anchorwallet){
            const provider=new anchor.AnchorProvider(connection,anchorwallet,anchor.AnchorProvider.defaultOptions())
            return new anchor.Program(idl,CHIT_FUND_PUBLICKEY,provider)
        }
    },[connection,anchorwallet]);

    // to create a chitfund in the blockchain
    const createChitFund=async(form)=>{
        // console.log("organiser",publicKey);
        console.log("Smart contracts",CHIT_FUND_PUBLICKEY);
        // logic to create chit fund in the smartContract
        if(program&&publicKey)
        {
            try{
                const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(form.FundName),publicKey.toBuffer()],program.programId)
                // calling the method from the blockchain
                const tx=await program.methods
                .initializechitfund(form.FundName, form.TotalPot)
                .accounts({
                  chitFund: profilePda,
                  organiser: publicKey,
                  systemProgram: SystemProgram.programId,
                })
                .rpc();
                // storing the fund information in the database

                const data={
                    "ChitFundName": form.FundName,
                    "Organiser": publicKey,
                    "TotalPot": form.TotalPot,
                    "Status": "Open",
                    "Participants":[]
                }

                const res=await axios.post(`${url}api/create`, data);
                // to fetch the updated data the database
                // setChitFunds(fetchChitFunds())
                // toast.success('Successfully initialized user');
            }
            catch(e)
            {
                console.log(e);
                // toast.error(e.toString());
            }
        }
        else{
            console.log("connect your wallet");
        }
        console.log(form);  
    }
    const getCount=async()=>{
        //logic to fetch the number of chitfunds created
        return '1';
    }
    const addParticipant=async(name,ownerAddress)=>{
        // logic to add participant to the chit fund
        if(program&&publicKey)
        {
            try{
                const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(name),publicKey.toBuffer()],program.programId)

                // calling the method from the blockchain
                const tx=await program.methods
                .join(name)
                .accounts({
                  organiser: ownerAddress,
                  chitFund: profilePda,
                  participant: publicKey
                })
                .rpc();
                toast.success('Successfully initialized user');
                // to add participant to the database
                const res=await axios.post(`${url}api/participate`, {
                        "chitFundName":name,
                        "participantName":publicKey
                    }
                );
                // to fetch the updated data from the database
                // setChitFunds(fetchChitFunds());
                console.log(res);
            }
            catch(e)
            {
                console.log(e);
                // toast.error(e.toString());
            }
        }
        else{
            console.log("connect your wallet");
        }
        // console.log(form);  
        // console.log("Participant added successfully");
    }

    // function to bid an amount by a participant
    const bid=async (chitFundName,participant,organiser,amount)=>{
        try{
            const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(chitFundName),publicKey.toBuffer()],program.programId);
            const tx = await program.methods
            .bid(chitFundName, amount)
            .accounts({
              organiser: organiser,
              chitFund: profilePda,
              participant: participant,
            })
            .rpc();
        }
        catch(e)
        {
            console.log(e);
        }
    }
    // funciton to deposit an amount by the participant
    const deposit=async (chitFundName,participant,organiser,bidWinner,amount)=>{
        try{
            const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(chitFundName),publicKey.toBuffer()],program.programId);

            const tx = await program.methods
            .deposit(chitFundName, amount)
            .accounts({
              organiser: organiser,
              chitFund: profilePda,
              participant: participant,
              bidWinner: bidWinner,
              cf: profilePda,
              systemProgram: web3.SystemProgram.programId,
            })
            .rpc();
            console.log(`Use 'solana confirm -v ${tx}' to see the logs`);

        }
        catch(e)
        {
            console.log(e);
        }
    } 
    return(
        <StateContext.Provider value={{createChitFund,getCount,addParticipant,url,bid,deposit,chitFunds}}>
            {children}
        </StateContext.Provider>
    )
}

const useStateContext=()=>(useContext(StateContext));
export {StateContextProvider,useStateContext};