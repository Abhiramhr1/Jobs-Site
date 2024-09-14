const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("custom erros");  
  let customErrors = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message|| 'something went wrong'
  }
  // if (err instanceof CustomAPIError) {
   
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.message === 'ValidationError')
  {
    customErrors.msg = Object.values(err.errors)
    .map((item)=>item.message)
    .join(',');
    customErrors.statusCode = 400;
  }
  if(err.code && err.code === 11000)
  {
    customErrors.statusCode = 400
    customErrors.msg = `duplicate value entered for: ${Object.keys(err.keyValue)} field,please choose another value `
  }
  if(err.name ==='CastError')
  {
    customErrors.msg=`no item found with id:${err.value}`
    customErrors.statusCode=404;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customErrors.statusCode).json({ msg:customErrors.msg })
}

module.exports = errorHandlerMiddleware
