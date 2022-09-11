const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})


const app = require('./index');




const port = process.env.port || 3000;


app.listen(port, () => {
  console.log('Listening port ', { port });
});