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


// exports.get=async (req,res,next)=>{
//     try{
//         //const { expence,description,categories} = req.body;
//         const users = await Expences.findAll({where:{userId:req.user.id}})
//         res.status(200).json(users);

//     }catch(err)
//     {
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }
exports.get = async (req, res, next) => {
    try {
        // Pagination-related lines
        const page = parseInt(req.query.page) || 1; // Current page number
        const pageSize = parseInt(req.query.pageSize) || 3; // Number of expenses per page

        const offset = (page - 1) * pageSize; // Calculate offset
        const limit = pageSize; // Limit results

        // Fetch expenses with pagination
        const { count, rows } = await Expences.findAndCountAll({
            where: { userId: req.user.id },
            offset: offset, // Pagination-related line
            limit: limit,   // Pagination-related line
        });

        const totalPages = Math.ceil(count / pageSize);

        res.status(200).json({
            expenses: rows,
            currentPage: page,
            totalPages: totalPages,
            totalExpenses: count,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


exports.delete=async (req,res,next)=>{
    try{
    const expenceId=req.params.id
    await Expences.destroy({where:{id:expenceId,userId:req.user.id}})
    res.status(200).json({message:"delete Succesfull"})
    }catch{
        res.status(500).json({message:"Internal Error"})
    }    
}