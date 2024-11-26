const sequelize=require("../utils/database")
const Sequelize=require("sequelize")

const User=sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser: {
        type:Sequelize.BOOLEAN
    },
    totalExpenses:{
        type:Sequelize.INTEGER,
        default:0
    }
})

module.exports=User