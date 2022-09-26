const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

//name, email, photo, password,passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, `Please provide your email`],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate:{
        //this only work on CREATE AND  SAVE!!!
        validator:function(el){
            return el === this.password; //validation
        }, 
        message:'Password and confrim password should be same'    
    }
  },
});


userSchema.pre('save',async function(next){
    // Only run if password was actually modified
    if(!this.isModified('password')) return next()

    // hash password with cost 12
    this.password = await bcrypt.hash(this.password,12);

    //delete passwordConfirm field
    this.passwordConfirm = undefined;

    console.log(this.password)
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;
