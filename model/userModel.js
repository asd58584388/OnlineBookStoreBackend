const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    // userid:{
    //     type:Number,
    //     unique:true 
    // },
    password:{
        type:String,
        set(val){
            //Password Protection :encryption through bcryptjs,(value,password strength)
            return require('bcryptjs').hashSync(val,10)
        }
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    createAt: {
        type: Number,
        default:Date.now,
    }
})


module.exports = UserSchema;