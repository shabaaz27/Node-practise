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





const port = process.env.port || 3000;
app.listen(port, () => {
  console.log('Listening port ', { port });
});



//TEST