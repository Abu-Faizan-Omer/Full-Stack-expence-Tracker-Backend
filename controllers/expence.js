const Expences=require("../models/expence")
const jwt=require("jsonwebtoken")
const users = require('../models/user'); // Adjust the path as necessary
const sequelize=require("../utils/database")
const { Parser } = require('json2csv');
const S3Service= require("../services/S3services")
const UserServices=require("../services/userservices")



// exports.downloadExpenses = async (req, res) => {
//     try {
//         // `getExpences()` Sequelize association method ko call karega
//         const expenses = await UserServices.getExpences(req);
//         console.log(expenses)
//         const stringifiedExpenses=JSON.stringify(expenses)

//         //it should depend upon the userId

//         const userId=req.user._id
//         const filename=`Expense${userId}/${new Date()}.txt`
//         const fileURL=await S3Service.uploadToS3(stringifiedExpenses,filename)
//         res.status(200).json({fileURL,success:true})

        
//     } catch (err) {
//         console.error("Error fetching expenses:", err.message);
//         res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//     }
// };
exports.downloadExpenses = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from auth middleware

        // Fetch all expenses for the logged-in user
        const allExpenses = await Expences.find({ userId });

        if (!allExpenses || allExpenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found.' });
        }

        // Map the expenses data to match the CSV fields
        const expensesData = allExpenses.map(expense => ({
            expence: expense.expence, // Mapping field name `expence` to the CSV field `amount`
            description: expense.description,
            categories: expense.categories,
            //createdAt: expense.createdAt.toISOString(), // Convert date to string format
        }));

        // Define the fields for the CSV
        const fields = ['expence', 'description', 'categories'];

        // Create a parser and convert the expenses data to CSV
        const parser = new Parser({ fields });
        const csv = parser.parse(expensesData);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
        res.status(200).send(csv);

    } catch (err) {
        console.error('Error downloading expenses:', err);
        res.status(500).json({ message: 'Error fetching expenses', error: err.message });
    }
};


exports.post = async (req, res, next) => {
    const t = await sequelize.transaction(); // Begin transaction if error it rollback
    try {
        const { expence, description, categories } = req.body;
        const userId=req.user._id;

        if (!expence || expence.length === 0) {
            return res.status(400).json({ success: false, message: 'Parameter missing' });
        }

        // Create the expense in the database
        // const expenceamount = await Expences.create(
        //     { expence, description, categories, userId: req.user.id },
        //     { transaction: t }
        // );
        const addExpence= new Expences({
            expence,
            description,
            categories,
            userId
        })
        await addExpence.save();


        // Calculate and update the user's total expenses
        const user= await users.findById(userId);
         const totalExpense = Number(user.totalExpenses) + Number(expence);
         user.totalExpenses = totalExpense;
         console.log("totalexpenses ",totalExpense)
        // await User.update(
        //     { totalExpenses: totalExpense },
        //     { where: { id: req.user.id }, transaction: t }
        // );

        // Commit the transaction
         await t.commit();         
         await user.save()

        // Send the response with the created expense
        res.status(200).json({
            success: true,
            message: 'Expense added successfully',
            addExpence, // Pass the created expense object to the frontend
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

        const offset = (page - 1) * pageSize; // skip and show from next
        const limit = pageSize; // Limit results No of item per page

        // Fetch expenses with pagination
        const expenses = await Expences.find({ userId: req.user._id }) // Filter by userId (from token)
            .skip(offset) // Skip the items for previous pages
            .limit(limit); // Limit the results per page

        const totalExpenses = await Expences.countDocuments({ userId: req.user._id }); // Count total expenses for the user
        const totalPages = Math.ceil(totalExpenses / pageSize); // Calculate total pages

        res.status(200).json({
            expenses: expenses,
            currentPage: page,
            totalPages: totalPages,
            totalExpenses: totalExpenses,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


exports.delete=async (req,res,next)=>{
    try{
    const expenceId=req.params.id
    const result = await Expences.findByIdAndDelete(expenceId)
    res.status(200).json({message:"delete Succesfull"})
    }catch{
        res.status(500).json({message:"Internal Error"})
    }    
}