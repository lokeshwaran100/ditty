"use client"
import { createContext, createElement, useContext } from "react";

const StateContext=createContext();

const StateContextProvider=({children})=>{
    const createChitFund=(form)=>{
        // logic to create chit fund in the smartContract
        console.log(form);  
    }
    return(
        <StateContext.Provider value={{createChitFund}}>
            {children}
        </StateContext.Provider>
    )
}

const useStateContext=()=>(useContext(StateContext));
export {StateContextProvider,useStateContext};