const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../modals/tourModal')




dotenv.config({path:'./config.env'})


const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATA_PASSWORD);

mongoose.connect(process.env.DATABASE_LOCAL,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false
}).then(()=> console.log("DataBase connection successful"))

// Read JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))


//Import Data inTO DB
const importData = async () =>{
    try{
        await Tour.create(tours)
        console.log('Data Successfully loaded')
       
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}


// Delete All Data from DB
const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        console.log('Data Successfully deleted')
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}

if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
    deleteData()
}

console.log(process.argv);