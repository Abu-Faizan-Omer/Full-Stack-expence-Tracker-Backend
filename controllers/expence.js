const Expences=require("../models/expence")
const jwt=require("jsonwebtoken")
const User = require('../models/user'); // Adjust the path as necessary
const sequelize=require("../utils/database")

const S3Service= require("../services/S3services")
const UserServices=require("../services/userservices")



exports.downloadExpenses = async (req, res) => {
    try {
        // `getExpences()` Sequelize association method ko call karega
        const expenses = await UserServices.getExpences(req);
        console.log(expenses)
        const stringifiedExpenses=JSON.stringify(expenses)

        //it should depend upon the userId

        const userId=req.user.id
        const filename=`Expense${userId}/${new Date()}.txt`
        const fileURL=await S3Service.uploadToS3(stringifiedExpenses,filename)
        res.status(200).json({fileURL,success:true})

        
    } catch (err) {
        console.error("Error fetching expenses:", err.message);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};


exports.post = async (req, res, next) => {
    const t = await sequelize.transaction(); // Begin transaction
    try {
        const { expence, description, categories } = req.body;

        if (!expence || expence.length === 0) {
            return res.status(400).json({ success: false, message: 'Parameter missing' });
        }

        // Create the expense in the database
        const expenceamount = await Expences.create(
            { expence, description, categories, userId: req.user.id },
            { transaction: t }
        );

        // Calculate and update the user's total expenses
        const totalExpense = Number(req.user.totalExpenses) + Number(expence);
        await User.update(
            { totalExpenses: totalExpense },
            { where: { id: req.user.id }, transaction: t }
        );

        // Commit the transaction
        await t.commit();

        // Send the response with the created expense
        res.status(200).json({
            success: true,
            message: 'Expense added successfully',
            expenceamount, // Pass the created expense object to the frontend
        });
    } catch (err) {
        // Rollback the transaction in case of an error
        await t.rollback();
        console.error("Error while creating expense:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};


// exports.post = async (req, res, next) => {
//     let t
//     try {
//         //create transaction for to PREVENT repetative show Leaderboard list
//         t= await sequelize.transaction()
//         const { expence, description, categories } = req.body;

//         // Create the expense
//         const expenceamount = await Expences.create({
//             expence,
//             description,
//             categories,
//             userId: req.user.id,
//         },
//         {transaction: t});

//         // Update total expenses for the user
//         const totalExpense = Number(req.user.totalExpenses) + Number(expence);
//         await User.update(
//             { totalExpenses: totalExpense },
//             { where: { id: req.user.id } },
//             {transaction: t}
//         );

//        await t.commit()
//         res.status(201).json({
//             success: true,
//             message: "Expense added successfully",
//             expenceamount,
//         });
//     } catch (err) {
//         // Rollback the transaction if any error occurs
       
//             await t.rollback();
        
//         console.error("Error in creating expense:", err); // Log error for debugging
//         res.status(500).json({ success: false, error: err.message });
//     }
// };


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