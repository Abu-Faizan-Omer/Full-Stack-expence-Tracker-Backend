const express =require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require("cors")
const bcrypt=require("bcrypt")

const sequelize=require("./utils/database")
const userRoutes=require("./routes/user")
const expenceroutes=require("./routes/expence")
const User=require("./models/user")
const Expences = require("./models/expence")

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use("/users",userRoutes)
app.use("/expence",expenceroutes)

User.hasMany(Expences)
Expences.belongsTo(User)

sequelize.sync()
.then((result)=>{
    app.listen(3000,()=>{
        console.log(`Server is runnig on Port 3000`)
    })
})
.catch((err)=>{
    console.log(`Error syncing database:`, err)
})

