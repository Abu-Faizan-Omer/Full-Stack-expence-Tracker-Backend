const express =require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require("cors")
const bcrypt=require("bcrypt")

const sequelize=require("./utils/database")
const Routes=require("./routes/user")
const routes=require("./routes/expence")

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use("/users",Routes)
app.use("/expence",routes)

sequelize.sync()
.then((result)=>{
    app.listen(3000,()=>{
        console.log(`Server is runnig on Port 3000`)
    })
})
.catch((err)=>{
    console.log(`Error syncing database:`, err)
})

