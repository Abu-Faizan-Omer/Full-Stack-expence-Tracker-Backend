const express=require("express")
const router=express.Router()
const controllers=require("../controllers/expence")
const userauthentication=require("../middleware/auth")

router.post("/post",userauthentication.authenticate,controllers.post)
router.get("/get",userauthentication.authenticate,controllers.get)
router.get('/download', userauthentication.authenticate, controllers.downloadExpenses)
router.delete("/delete/:id",userauthentication.authenticate,controllers.delete)

module.exports=router