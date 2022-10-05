const jwt = require('jsonwebtoken');
const User = require('../modals/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


const signToken = id =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id)

//   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exist && password is correct

  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password,user.password)
  // 3) If Everything ok, send token to client
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`InCorrect Mail or password`, 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 200,
    token,
  });
});
