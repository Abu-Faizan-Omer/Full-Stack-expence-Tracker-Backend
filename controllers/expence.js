const Expence=require("../models/expence")

exports.post=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body
   
        // Combine input data into a single JSON object for the `details` field
        const details = {
            name: name,
            email: email,
            password: password
        };

        const ExpenceData=await Expence.create({details})
        return res.status(201).json({message:`sucessful`})
    }
    catch{
        return res.status(500).json({message:`Failed`})
    }   
}