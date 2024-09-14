const {StatusCodes} = require('http-status-codes');
const jobSchema = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllJobs = async(req,res)=>{
    const  jobs =   await jobSchema.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs:jobs,count:jobs.length});
    // res.send('get all jobs');
}
const createJob = async(req,res)=>{
    // console.log(req);
    req.body.createdBy = req.user.userId;
    // console.log(req.user.userId)
    const job = await jobSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({job}); 

    // res.json(req.user);
}
const getJob = async(req,res)=>{
    const {user:{userId},params:{id:jobId}} = req;
    const job = await jobSchema.findOne({_id:jobId,createdBy:userId});
    // res.send('get single job');
    if(!job)
    {
        throw new NotFoundError(`no jobs with id:${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const updateJob = async(req,res)=>{
    const {
    body:{company,position},
    user:{userId},
    params:{id:jobId}} = req;

    if(company ===''|| position ==='')
    {
        throw new BadRequestError('company or position cannot be empty');
    }

    const job = await jobSchema.findOneAndUpdate({_id:jobId,createdBy:userId},{company,position },{new:true,runValidators:true});
    if(!job)
    {
        throw new  NotFoundError('job not found and unable to update');
    }
    res.status(StatusCodes.OK).json({job});
//     res.send('updated job');
}
const deleteJob = async(req,res)=>{
    const {
        user:{userId},
        params:{id:jobId}} = req;
        const job = await jobSchema.findByIdAndDelete({_id:jobId,createdby:userId});
        if(!job)
        {
            throw new BadRequestError('job not found and unable to delete')
        }
        res.status(StatusCodes.OK).send();
    //res.send('deleted job');
}

module.exports = {getAllJobs,getJob,createJob,updateJob,deleteJob};