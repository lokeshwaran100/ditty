import mongoose from "mongoose";

const ChitFundSchema=new mongoose.Schema({
    ChitFundName: {
        type:String,
        required:true
    },
    Organiser: { 
        type: String,
        required:true
    },
    TotalPot: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    Participants:{
        type: [String],
        default:[]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChitFund=mongoose.models.ChitFund||mongoose.model('ChitFund',ChitFundSchema);

export default ChitFund;