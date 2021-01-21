const mongoose = require('mongoose');

const InstiSchema = mongoose.Schema({id:String,name:String,starty:String,endy:String});
const RatingSchema = mongoose.Schema({rating:Number,userId:String});
const SkillSchema = mongoose.Schema({id:String,name:String});

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    insti:{
        type:[InstiSchema],
        default:undefined
    },
    skills:{
        type:[SkillSchema],
        default:undefined
    },
    bio:{
        type:String,
        default:undefined
    },
    contact_no:{
        type:String,
        default:undefined
    },
    rating:{
        type:[RatingSchema]
    },
    role:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('users',UserSchema);