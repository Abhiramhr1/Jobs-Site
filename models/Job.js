const mongoose = require('mongoose')
const statusCodes = require('http-status-codes')
const{NotFoundError,BadRequestError} = require('../errors')

const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,"please provide the company name"],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,"please provide the company name"],
        maxlength:100

    },
    status:{
        type:String,
        enum:['interview',  'declined','pending'],
        default:'pending',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide a user']
    }
},{timestamps:true})

module.exports = mongoose.model('jobs',jobSchema);