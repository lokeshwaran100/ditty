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

    // to keep track of the loader
    const [isLoading,setIsLoading]=useState(false);

    // to keep track of all the created chitfunds
    const [chitFunds,setChitFunds]=useState([]);

    // a fucntion to fetch all the chitFunds
    const fetchChitFunds=async()=>{
        setIsLoading(true);
        try{
            const data=await axios.get(`${url}api/allFunds`);
            setChitFunds(data.data.message)
        }
        catch(err)
        {
            console.log(err);
        }
        setIsLoading(false);
    }

    useEffect(() => {

        // const fetchData = async () => {
        //     try {
        //         const response = await axios.get(`${url}api/allFunds`);
        //         const data = response.data.message;
        //         setChitFunds(data); // Set the chitFunds state with the fetched data
        //     } catch (err) {
        //         console.error(err);
        //     }
        // };
    
        // fetchData(); // Call the function to fetch data when the component mounts
        fetchChitFunds();
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
                setIsLoading(true);
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
                    "Participants":[publicKey]
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
            setIsLoading(false);
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
            const Owner=new PublicKey(ownerAddress)
            try{
                const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(name),Owner.toBuffer()],program.programId)

                // calling the method from the blockchain
                const tx=await program.methods
                .join(name)
                .accounts({
                  organiser: Owner,
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
    const bid=async (organiser,participant,amount,chitFundName)=>{
        setIsLoading(true);
        console.log(organiser,participant,amount,chitFundName);
        try{
            const Owner=new PublicKey(organiser);
            const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(chitFundName),Owner.toBuffer()],program.programId);
            const tx= await program.methods
            .bid(chitFundName, amount)
            .accounts({
              organiser: Owner,
              chitFund: profilePda,
              participant: publicKey,
            })
            .rpc();
        
            // const tx = await program.methods
            // .bid(chitFundName, amount)
            // .accounts({
            //   organiser: organiser,
            //   chitFund: profilePda,
            //   participant: participant,
            // })
            // .rpc();
        }
        catch(e)
        {
            console.log(e);
        }
        setIsLoading(false);
    }
    // funciton to deposit an amount by the participant
    const deposit=async (chitFundName,participant,organiser,bidWinner,amount)=>{
        
        try{
            const Owner=new PublicKey(organiser)
            const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(chitFundName),Owner.toBuffer()],program.programId);

            const tx = await program.methods
            .deposit(chitFundName, amount)
            .accounts({
              organiser: Owner,
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

    // a funcion to fetch all the chitfunds in which i have participated
    const getMyChitFunds=()=>{
        
        if(publicKey)
        {
            const filteredFunds=chitFunds.filter((funds)=>{
                return funds.Participants.includes(publicKey.toString());
            })
            console.log("in context",filteredFunds);
            
            return filteredFunds
        }
        else
        {
            
            console.log("please connect your wallet");
        }
    }
    const getChitFundStatus=async (name,organiser)=>{
        setIsLoading(true);
        const Owner=new PublicKey(organiser)
        const [profilePda,profileBump]=findProgramAddressSync([utf8.encode(name),Owner.toBuffer()],program.programId);
        const data= await program.account.chitFund.fetch(
            profilePda
        );
        setIsLoading(false);
        return data
    }
    // to get the details of a particular fund
    const getFundDetails=(name)=>{
        
        // console.log(name,"context");
        const fund=chitFunds.filter((fund)=>{
            return fund.ChitFundName==name
        });
        
        return fund[0];
    }
    return(
        <StateContext.Provider value={{createChitFund,getCount,addParticipant,url,bid,deposit,chitFunds,isLoading,setIsLoading,getMyChitFunds,getFundDetails,publicKey,getChitFundStatus}}>
            {children}
        </StateContext.Provider>
    )
}

const useStateContext=()=>(useContext(StateContext));
export {StateContextProvider,useStateContext};