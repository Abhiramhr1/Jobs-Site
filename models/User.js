const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// require('dotenv').config
const userSchema = new mongoose.Schema({
    name :{
        type:String,
        require:[true,'name is required'],
        minlength:10,
        maxlength:30,
    },
    email :{
        type:String,
        require:[true,'email is required'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide a valid email'],
        unique:true
    },
    password :{
        type:String,
        require:[true,'password is required'],
    },

})
//this is mongoose middlewares
userSchema.pre('save',async function(next){ //using conventional function keyword helps `this` to point to the document so we can use schema varibales 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.checkPassword = async function(newPassword){
    const match = await bcrypt.compare(newPassword,this.password);
    return match
}
userSchema.methods.createJWT = function()
{
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:'30d'})
};
module.exports = mongoose.model('user',userSchema);
