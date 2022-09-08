const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId=(req,res,next,val)=>{
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
          status: 404,
          message: 'Invalid Id',
        });
      }
      next()
}

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    reqAt: req.requestTime,
    code: 200,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params.id);
  const id = req.params.id * 1;

  const tour = tours.find((item) => item.id === id);

  
    res.status(200).json({
      status: 'success',
      code: 200,
      data: tour,
    });
  
};

exports.createTour = (req, res) => {
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
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  const checkTour = tours.find((item) => item.id === id);

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'TOUR updated',
    });
  
};
exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    // tours.find((item,index)=> item.id ==id ? tours.splice(index,1):null)
    return res.status(204).json({
      status: 'success',
      message: 'Data deleted',
      data: null,
    });
  
};
