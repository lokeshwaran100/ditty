"use client"
import { createContext, createElement, useContext } from "react";

const StateContext=createContext();

const StateContextProvider=({children})=>{
    const url="http://localhost:3000/";

    const createChitFund=async(form)=>{
        // logic to create chit fund in the smartContract
        console.log(form);  
    }
    const getCount=async()=>{
        //logic to fetch the number of chitfunds created
        return '1';
    }
    const addParticipant=async()=>{
        // logic to add participant to the chit fund
        console.log("Participant added successfully");
    }
    return(
        <StateContext.Provider value={{createChitFund,getCount,addParticipant,url}}>
            {children}
        </StateContext.Provider>
    )
}

const useStateContext=()=>(useContext(StateContext));
export {StateContextProvider,useStateContext};