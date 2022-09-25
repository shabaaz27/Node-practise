const fs = require('fs');
const Tour = require('../modals/tourModal');
const APIFeatures = require('../utils/apilFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId=(req,res,next,val)=>{
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//           status: 404,
//           message: 'Invalid Id',
//         });
//       }
//       next()
// }

// exports.checkBody = (req,res,next)=>{
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//           status: 400,
//           message: 'Missing name or price',
//         });
//       }
//       next()
// }

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.highPrice = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingAverage,-price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res,next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let tourData = await features.query;

  res.status(200).json({
    status: 'success',
    reqAt: req.requestTime,
    code: 200,
    results: tourData.length,
    data: {
      tourData,
    },
  });
});

exports.getTour = catchAsync(async (req, res,next) => {
  console.log(req.requestTime);
  const tourData = await Tour.findById(req.params.id);

  if(!tourData){
    return next(new AppError('No tour found found with that ID',404))
  }

  //Tour.findOne({id:req.params.id})
  res.status(200).json({
    status: 'success',
    code: 200,
    data: tourData,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    code: 201,
    data: { tour: newTour },
  });
});

//just test update  not proper function return
exports.updateTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!tour){
    return next(new AppError('No tour found found with that ID',404))
  }

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'TOUR updated',
    data: {
      tour,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res,next) => {
  const tourData = await Tour.findByIdAndDelete(req.params.id);

  if(!tourData){
    return next(new AppError('No tour found found with that ID',404))
  }
  // tours.find((item,index)=> item.id ==id ? tours.splice(index,1):null)
  res.json({
    status: '204',
    message: 'Data deleted Successfully',
  });
});

exports.getTourStats = catchAsync(async (req, res,next) => {
  // $match Filters the document stream to allow only matching documents to pass unmodified into the next pipeline stage.
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: {
        _id: { $ne: 'EASY' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    // {
    //   $limit:12
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
