const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
    job_id:{
        type:String,
        required:true
    },
    app_id:{
        type:String,
        required:true
    },
    rec_id:{
        type:String,
        required:true
    },
    SOP:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    }
});

module.exports = mongoose.model('applications',ApplicationSchema);