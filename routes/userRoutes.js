const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authController')

const userRouter = express.Router()

userRouter.post('/signup',authController.signup)

userRouter.route('/').get(userController.getAllUsers).post(userController.createUser)
userRouter.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser)

module.exports = userRouter