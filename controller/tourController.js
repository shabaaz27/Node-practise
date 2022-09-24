const fs = require('fs');
const Tour = require('../modals/tourModal');
const APIFeatures = require('../utils/apilFeatures')


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


exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log(req.requestTime);
    const tourData = await Tour.findById(req.params.id);
    //Tour.findOne({id:req.params.id})
    res.status(200).json({
      status: 'success',
      code: 200,
      data: tourData,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: 'Not Found',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      code: 201,
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//just test update  not proper function return
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'TOUR updated',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data sent',
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // tours.find((item,index)=> item.id ==id ? tours.splice(index,1):null)
    res.json({
      status: '204',
      message: 'Data deleted Successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data sent',
    });
  }
};



exports.getTourStats = async (req,res) =>{
  try{
    // $match Filters the document stream to allow only matching documents to pass unmodified into the next pipeline stage. 
    const stats= await Tour.aggregate([
      {
        $match: {ratingAverage:{$gte:4.5}}
      },
      {
        $group:{
          _id:{$toUpper:'$difficulty'},
          numTours:{$sum:1},
          numRatings:{$sum:'$ratingQuantity'},
          avgRating:{$avg: '$ratingAverage'},
          avgPrice:{$avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'}
       } },
        {
          $sort:{avgPrice:1}
        },{
          $match:{
            _id:{$ne:'EASY'}
          }
        }
      
    ]);
    res.status(200).json({
      status:'success',
      data:{
        stats
      }

    })
  }
  catch(err){
      res.status(404).json({
        status:'fail',
        message:err
      })
}
}


exports.getMonthlyPlan = async (req,res)=>{
  try{
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind:'$startDates'
      },
      {
        $match:{
          startDates:{
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }
        }
      },{
        $group:{
          _id:{$month:'$startDates'},
          numTourStarts:{$sum:1},
          tours:{$push:'$name'}
        }
      },
      {
        $addFields:{month:'$_id'}
      },
      {
        $project:{_id:0}
      },{
        $sort:{numTourStarts:-1}
      },
      // {
      //   $limit:12
      // }
    ]);

    res.status(200).json({
      status:'success',
      data:{
        plan
      }
    })
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
}

}