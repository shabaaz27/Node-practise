const express = require('express')

const userRouter = express.Router()


const createUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  
  const updateUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  const deleteUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  const getUser = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  
  const getAllUsers = (req,res)=>{
    res.status(500).json({
      status:500,
      message:'This route not yet defined'
    })
  }
  
  

userRouter.route('/').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = userRouter