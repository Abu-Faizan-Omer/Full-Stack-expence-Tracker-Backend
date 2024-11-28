const express=require("express")
const router=express.Router()
const userauthentication=require("../middleware/auth")
const controllers=require("../controllers/resetpassword")

router.post('/forgotpassword',controllers.forgotpassword);
router.get('/resetpassword/:uuid',controllers.checkresetpassword);
router.post('/resetpassword/:uuid',controllers.finalresetpassword);

module.exports=router