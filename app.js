require('dotenv').config();
const express =require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require("cors")
const bcrypt=require("bcrypt")

const sequelize=require("./utils/database")
const userRoutes=require("./routes/user")
const expenceroutes=require("./routes/expence")
const purchaseroutes=require("./routes/purchase")
const premiumFeatureRoutes = require('./routes/premiumFeature')

const User=require("./models/user")
const Expences = require("./models/expence")
const Order=require("./models/order")

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use("/users",userRoutes)
app.use("/expence",expenceroutes)
app.use("/purchase",purchaseroutes)
app.use('/premium', premiumFeatureRoutes)

User.hasMany(Expences)
Expences.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize.sync()
.then((result)=>{
    app.listen(3000,()=>{
        console.log(`Server is runnig on Port 3000`)
    })
})
.catch((err)=>{
    console.log(`Error syncing database:`, err)
})

