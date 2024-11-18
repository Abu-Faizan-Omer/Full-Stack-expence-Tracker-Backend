const Expences=require("../models/expence")
const jwt=require("jsonwebtoken")
exports.post=async (req,res,next)=>{
    try{
        const {expence,description,categories}=req.body

        const Expence_data=await Expences.create({expence,description,categories,userId:req.user.id})
        res.status(201).json({message:"Dataposted Succesful"})

    }catch{
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.get=async (req,res,next)=>{
    try{
        //const { expence,description,categories} = req.body;
        const users = await Expences.findAll({where:{userId:req.user.id}})
        res.status(200).json(users);

    }catch(err)
    {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.delete=async (req,res,next)=>{
    try{
    const expenceId=req.params.id
    await Expences.destroy({where:{id:expenceId,userId:req.user.id}})
    res.status(200).json({message:"delete Succesfull"})
    }catch{
        res.status(500).json({message:"Internal Error"})
    }    
}