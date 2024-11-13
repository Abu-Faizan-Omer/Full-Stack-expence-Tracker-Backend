const Expence=require("../models/expence")

//to check every input is filled or not
function isStringValid(string){
    if(string==undefined || string.length===0)
    {
        return true
    }else{
        return false
    }
}

exports.signup=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body

        if(isStringValid(name) || isStringValid(email) ||isStringValid(password))
        {
            return res.status(500).json({err:"Something is missing"})
        }

        const ExpenceData=await Expence.create({name,email,password})
        return res.status(201).json({message:`sucessful`})
    
    }catch(err){
        return res.status(500).json(err)
    }   
}


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (isStringValid(email) || isStringValid(password)) {
            return res.status(400).json({ message: "Email or password is missing" });
        }

        // Check if the user exists in the database
        const user = await Expence.findOne({ where: { email } });

        if (!user) {
            // User not found
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password === password) {
            // Password matches
            return res.status(200).json({ message: "User login successful" });
        } else {
            // Password does not match
            return res.status(401).json({ message: "User not authorized" });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
