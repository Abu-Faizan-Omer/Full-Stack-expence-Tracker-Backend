const dotenv=require("dotenv")
require('dotenv').config();
const express =require("express")
const app=express()

const mongoose=require("mongoose")

const bodyparser=require("body-parser")
const cors=require("cors")
const bcrypt=require("bcrypt")
const path=require("path")

//const sequelize=require("./utils/database")
const userRoutes=require("./routes/user")
const expenceroutes=require("./routes/expence")
const purchaseroutes=require("./routes/purchase")
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes=require("./routes/resetPassword")

const User=require("./models/user")
const Expences = require("./models/expence")
const Order=require("./models/order")
const Forgotpassword=require("./models/forgotpasswordm")

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'public')))


app.use("/users",userRoutes)
app.use("/expence",expenceroutes)
app.use("/purchase",purchaseroutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password',resetPasswordRoutes)


// Serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views','signup.html'));  // Home page is home.html
});

// Serve HTML files dynamically from /views folder
app.get("/:page", (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'views', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        }
    });
});

// User.hasMany(Expences, { as: "Expences" }); // Add alias as "Expences"
// Expences.belongsTo(User);

// User.hasMany(Order)
// Order.belongsTo(User)

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// sequelize.sync()
// .then((result)=>{
//     app.listen(3000,()=>{
//         console.log(`Server is runnig on Port 3000`)
//     })
// })
// .catch((err)=>{
//     console.log(`Error syncing database:`, err)
// })

mongoose.connect(process.env.MONGODB_CONNECTION_URL)
.then(result => {
    app.listen(process.env.PORT)
    console.log("Connected ")
})
.catch(err =>{
    console.log("Error in Connection Mongodb")
})

