const fs = require('fs');
const Tour = require('../modals/tourModal') 

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

exports.getAllTours = async (req, res) => {

  try{ 
    
    //1.filtering
    const queryObj = {...req.query}
    const excludedFields = ['page','sort','limit','fields']
    excludedFields.forEach(el=> delete queryObj[el])
    console.log(req.query,queryObj)

    //2.advance filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`)
    console.log(JSON.parse(queryStr))

    //3.Sorting
    let query = Tour.find(JSON.parse(queryStr))
    console.log(`${req.query.sort}`)
    query = req.query.sort ? query.sort(req.query.sort) : query;

    let tourData = await query;

    res.status(200).json({
      status: 'success',
      reqAt: req.requestTime,
      code: 200,
      results: tourData.length,
      data: {
        tourData,
      },
    });
}
catch(err){
    res.status(404).json(
      {
        status:'failed',
        message:err
      }
    )
}
};

exports.getTour = async (req, res) => {
 
  try {
  console.log(req.requestTime);
  const tourData = await Tour.findById(req.params.id)
  //Tour.findOne({id:req.params.id})
    res.status(200).json({
      status: 'success',
      code: 200,
     data: tourData,
    });
  }
  catch(err){
    res.status(404).json({
      status:'Failed',
      message:'Not Found'
    })
  }
};


exports.createTour = async (req, res) => {
  try {
   const newTour = await Tour.create(req.body)
  res.status(201).json({
    status: 'success',
    code: 201,
    data: { tour: newTour },
  });
}catch(err){
  res.status(400).json({
    status:'fail',
    message:'Invalid Data sent'
  })
}



};

//just test update  not proper function return
exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'TOUR updated',
      data:{
        tour
      }
    });
  }
  catch(err){
    res.status(400).json({
      status:'fail',
      message:'Invalid Data sent'
    })
  }

   
  
};
exports.deleteTour = async (req, res) => {

  try{
    await Tour.findByIdAndDelete(req.params.id)

    // tours.find((item,index)=> item.id ==id ? tours.splice(index,1):null)
     res.json({
      status: '204',
      message: 'Data deleted Successfully',
    });

  }
  catch(err){
    res.status(400).json({
      status:'fail',
      message:'Invalid Data sent'
    })
  }
    
  
};
