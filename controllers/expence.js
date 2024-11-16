const Expences=require("../models/expence")
exports.post=async (req,res,next)=>{
    try{
        const {expence,description,categories}=req.body

        const Expence_data=await Expences.create({expence,description,categories})
        res.status(201).json({message:"Dataposted Succesful"})

    }catch{
        return res.status(500).json(err)
    }
}

exports.get=async (req,res,next)=>{
    try{
        //const { expence,description,categories} = req.body;
        const users = await Expences.findAll()
        res.status(200).json(users);

    }catch(err)
    {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.delete=async (req,res,next)=>{
    try{
    const expenceId=req.params.id
    await Expences.destroy({where:{id:expenceId}})
    res.status(200).json({message:"delete Succesfull"})
    }catch{
        res.status(500).json({message:"Internal Error"})
    }    
}