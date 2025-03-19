const mongoose=require("mongoose")
const expenceSchema=new mongoose.Schema({
    expence:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categories:{
        type:String,
        required:true
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports= mongoose.model("Expence",expenceSchema)

// const sequelize=require("../utils/database")
// const Sequelize=require("sequelize")

// const Expences=sequelize.define("expence_tracker",{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         autoIncrement:true,
//         primaryKey:true
//     },
    // expence:{
    //     type:Sequelize.STRING,
    //     allowNull:false
    // },
    // description:{
    //     type:Sequelize.STRING,
    //     allowNull:false
    // },
    // categories:{
    //     type:Sequelize.STRING,
    //     allowNull:false
    // }
// })
// module.exports=Expences