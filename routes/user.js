const express=require("express")
const router=express.Router()

const Controllers=require("../controllers/user")

router.post("/signup",Controllers.signup)
router.post("/login",Controllers.login)

module.exports=router