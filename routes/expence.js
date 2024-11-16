const express=require("express")
const router=express.Router()
const controllers=require("../controllers/expence")

router.post("/post",controllers.post)
router.get("/get",controllers.get)
router.delete("/delete/:id",controllers.delete)

module.exports=router