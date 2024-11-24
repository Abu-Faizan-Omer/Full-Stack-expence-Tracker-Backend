const User=require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
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
        const saltround=10
        bcrypt.hash(password,saltround,async(err,hash)=>{

            const ExpenceData=await User.create({name,email,password:hash})
            return res.status(201).json({message:`sucessful create user`})
        })
    }catch(err){
        return res.status(500).json(err)
    }   
}

 function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser},'secretkey')
 }
// Export generateAccessToken
 exports.generateAccessToken = generateAccessToken;

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (isStringValid(email) || isStringValid(password)) {
            return res.status(400).json({ message: "Email or password is missing" });
        }

        // Check if the user exists in the database
        const user = await User.findAll({ where: { email } });

        if (user.length > 0) {
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error('Something went wrong')
                }  
                if (result===true) {
                    // Password matches
                    return res.status(200).json({ message: "User login successful",token:generateAccessToken(user[0].id,user[0].name,user[0].ispremiumuser)});
                } else {
                    // Password does not match
                    return res.status(401).json({ message: "Password not match" });
                }  
            })     
        }else{
            res.status(404).json({message:"User not exist"})
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
