const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');

//uncaughtException
process.on('uncaughtException', (err) => {
  console.log(err.name, ',', err.message);
  console.log('UncaughtException 💥 Shutting down');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATA_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DataBase connection successful'));

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log('Listening port ', { port });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UnhandledRejection 💥 Shutting down');
  server.close(() => {
    process.exit(1);
  });
});

// process.on('uncaughtException',err=>{
//   console.log(err.name,",",err.message)
//   console.log('UncaughtException 💥 Shutting down')
//   server.close(()=>{
//     process.exit(1)
//  })
// })


//TEST for UncaughtExceptio
// console.log(x);

