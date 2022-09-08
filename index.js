
const express = require('express');
const morgan = require('morgan');
const router = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();


//1.middlewares
app.use(morgan('dev'))
app.use(express.json()); 
//create you own middleware
app.use((req,res,next)=>{
  console.log('from the middle ware')
  next()
})


//old way
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3.route
// mounting routers
app.use('/api/v1/tours',router)
app.use('/api/v1/users',userRouter)


//4.Start Sever

module.exports = app