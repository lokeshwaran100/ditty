import dbConnect from "@/utils/conDB";
import ChitFund from "@/models/ChitFund";
import { NextResponse } from "next/server";
export async function GET(req, res) {
    try{
        await dbConnect();  
        const data=await ChitFund.find();
        return NextResponse.json({
            message:data
        },{
            status:200
        });
    }
    catch(err)
    {
        console.log(err);
        return NextResponse.json({
            message:"There was some form of a error"
        },{
            status:500
        });
    }
}