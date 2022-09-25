const AppError = require('../utils/AppError')
const handleCastErrorDB = (err)=>{
  const message = `invalid ${err.path} : ${err.value}`
  return new AppError(message,400)
}


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
    //Programming or other unknown error : don't leak error details
  } else {
    //1) Log error
    console.error('ERROR 💥', err);
    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {

  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err}
    if(error.name = 'CastError') error = handleCastErrorDB(error)
    sendErrorProd(error, res);
  }
};
