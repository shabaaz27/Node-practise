const fs = require('fs');
const express = require('express');
const morgan = require('morgan')

const app = express();


//1.middlewares
app.use(morgan('dev'))
app.use(express.json()); 
//create you own middleware
app.use((req,res,next)=>{
  console.log('from the middle ware')
  next()
})

app.use((req,res,next)=>{
 req.requestTime = new Date().toISOString();
  next()
})

//2.Route Headers

const getAllTours = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    reqAt:req.requestTime,
    code: 200,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params.id);
  const id = req.params.id * 1;

  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'failed',
      code: 404,
      message: 'Invalid Id',
    });
  } else {
    res.status(200).json({
      status: 'success',
      code: 200,
      data: tour,
    });
  }
  
};

const createTour = (req, res) => {
  // console.log(req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        code: 201,
        data: { tour: newTour },
      });
    }
  );
};

//just test update  not proper function return
const updateTour = (req, res) => {
  const id = req.params.id * 1;

  const checkTour = tours.find((item) => item.id === id);
  if (!checkTour) {
    res.status(404).json({
      status: 'failed',
      code: 404,
      message: 'Invalid Id',
    });
  } else {
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'TOUR updated',
    });
  }
};
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  } else {
    const id = req.params.id * 1;
    // tours.find((item,index)=> item.id ==id ? tours.splice(index,1):null)
    return res.status(204).json({
      status: 'success',
      message: 'Data deleted',
      data: null,
    });
  }
};
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


//old way
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3.route
app.route('/api/v1/tours').get(getAllTours).post(createTour)

app.use((req,res,next)=>{
  console.log('fHello rom the middle ware')
  next()
})
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)


//4.Start Sever
const port = 4000;
app.listen(port, () => {
  console.log('Listening port ', { port });
});
