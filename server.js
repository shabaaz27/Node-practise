const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');




dotenv.config({path:'./config.env'})


const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATA_PASSWORD);

mongoose.connect(process.env.DATABASE_LOCAL,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false
}).then(()=> console.log("DataBase connection successful"))


const tourSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'A tour must have a name'],
    unique:true
  },
  rating:{
    type:Number,
    default:4.5
  },
  price:{
    type:Number,
    required:[true,'A tour must have a price']
  }
})

const Tour = mongoose.model('Tour',tourSchema)

const testTour = new Tour({
  name:'The Forest Hiker',
  rating:4.7,
  price:597
});

const secondTour = new Tour({
  name:'The Sky Diver',
  rating:4.9,
  price:1000
});

testTour.save().then((doc)=>console.log(doc)).catch(err=>console.log(err.message,'🤦‍♂️'))



const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('Listening port ', { port });
});