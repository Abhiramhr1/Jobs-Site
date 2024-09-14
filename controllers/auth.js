const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const {BadRequestError,UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')


const register = async(req,res)=>
{
    // const{name,email,password} = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(password,salt);
    // const tempUser = {name,email,password:hashPassword}; //its getting messier iconrollers so handle hashing in middlewares

    const user = await User.create({...req.body});//normally we sent original password in (req.body) but now we are hashing it(tempUser),but after using middlewares its back to normal

    //const token = jwt.sign({userId:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'1d'}) //used in instance method of schema
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); //send user when required
    // res.send('registered user');
}

const login = async(req,res)=>
{
    const{email,password} = req.body;
    console.log(email,password);
    if(!email || !password)
    {
        throw new BadRequestError("please provide email and password");
    }
    //res.send('logged user');
    const user = await User.findOne({email:email})
    if(!user)
    {
        console.log('throwing error');
        throw new UnauthenticatedError("invalid credentials")//User not find ,create a account first
    }
    //compare password
    const isPasswordCorrect = await user.checkPassword(password);
    if(!isPasswordCorrect   )
    {
        throw new UnauthenticatedError("invalid credentials")//User not find ,create a account first
    }

    const token =  user.createJWT();
    // console.log("yeahh user logged in");
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = {register,login};