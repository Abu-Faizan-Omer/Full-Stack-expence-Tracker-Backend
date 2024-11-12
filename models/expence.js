const sequelize=require("../utils/database")
const Sequelize=require("sequelize")

const Expence=sequelize.define("expence-details",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    details:{
        type:Sequelize.JSON,
        allowNull:false
    }
})

module.exports=Expence