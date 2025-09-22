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
