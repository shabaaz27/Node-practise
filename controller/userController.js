
const User = require('../modals/userModel');
const catchAsync = require('../utils/catchAsync');

exports.createUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  
  exports.updateUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  exports.deleteUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  exports.getUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  
  exports.getAllUsers = catchAsync(async(req,res,next)=>{
    let users = await User.find();

    res.status(200).json({
      status: 'success',
      reqAt: req.requestTime,
      code: 200,
      results: users.length,
      data: {
        users,
      },
    });
  })
  
  