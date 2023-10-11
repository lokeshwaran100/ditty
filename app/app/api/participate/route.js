import dbConnect from "@/utils/conDB";
import ChitFund from "@/models/ChitFund";
import { NextResponse } from "next/server";


export async function POST(req,res){

  const data=await req.json();
  console.log(data);
  await dbConnect();
  const chitFund = await ChitFund.findOne({ ChitFundName: data.chitFundName });

  if (!chitFund) {
    return NextResponse.json({ message: 'ChitFund not found' });
  }

  // Add the participant to the Participants array
  chitFund.Participants.push(data.participantName);

  // Save the updated ChitFund
  await chitFund.save();

  return NextResponse.json({
    message:"successfully added the participant"
  },{
    status: 200
  })
}

export async function GET(){
  return NextResponse.json({
    message:"You are in the participate route"
  },{
    status: 200
  })
}