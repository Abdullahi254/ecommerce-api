const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(v){
                return(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(v)
            },
            message:props=>`${props.value} is not a valid email address!`
        }
    },
    password:{type:String,required:true},
    isAdmin:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

module.exports = mongoose.model("User",UserSchema)