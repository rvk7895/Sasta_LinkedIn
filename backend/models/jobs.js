const mongoose = require('mongoose');
const RatingSchema = mongoose.Schema({userId:String,rating:Number});
const SkillSchema = mongoose.Schema({name:String, id:String})

const JobSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    recruiter_id:{
        type:String,
        required:true
    },
    max_app:{
        type:Number,
        required:true
    },
    max_pos:{
        type:Number,
        required:true
    },
    post_date:{
        type:Date,
        default:new Date()
    },
    deadline:{
        type:Date,
        required:true,
    },
    'req_skills':{
        type:[SkillSchema],
        required:true
    },
    type:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    rating:{
        type:[RatingSchema]
    },
    pos_left:{
        type:Number,
    },
    app_left:{
        type:Number,
    }
});

module.exports = mongoose.model('jobs',JobSchema);