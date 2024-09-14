const User = require('../models/User')
const {UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')


const authMiddle = (req,res,next)=>{
    // console.log('authenticating');
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError("header not found");
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    try {
        console.log('verfying  token');
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const{_id,name} = decoded;
        req.user = { userId: decoded.userId, name: decoded.name }

        next();
    } catch (error) {
        throw new UnauthenticatedError(`Invalidd token ${error}`);
    }


} 

module.exports = authMiddle; 