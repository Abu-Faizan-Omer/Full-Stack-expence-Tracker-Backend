const express=require("express")
const router=express.Router()

const Controllers=require("../controllers/expence")

router.post("/signup",Controllers.post)

module.exports=router