const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError')
const globalErrorHandler = require('./controller/errorController')
const router = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const errorController = require('./controller/errorController');

const app = express();

console.log(process.env.NODE_ENV);
//1.middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//create you own middleware
// app.use((req, res, next) => {
//   console.log('from the middle ware');
//   next();
// });

//old way
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3.route
// mounting routers
app.use('/api/v1/tours', router);
app.use('/api/v1/users', userRouter);


// handling unhandled routes
app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status:'failed',
  //   message:`Can't find ${req.originalUrl} on this server`
  // })
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(errorController)
module.exports = app;
