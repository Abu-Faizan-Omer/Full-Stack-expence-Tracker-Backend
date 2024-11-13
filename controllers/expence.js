const Expence=require("../models/expence")

exports.post=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body

        const ExpenceData=await Expence.create({name,email,password})
        return res.status(201).json({message:`sucessful`})
    }
    catch{
        return res.status(500).json({message:`Failed`})
    }   
}