const express=require("express")
const router=express.Router()

const expenseController=require("../controllers/expence")
const authenticatemiddleware=require("../middleware/auth")

const Controllers=require("../controllers/user")

router.post("/signup",Controllers.signup)
router.post("/login",Controllers.login)



module.exports=router