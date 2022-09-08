const app = require('./index');

const port = 4000;
app.listen(port, () => {
  console.log('Listening port ', { port });
});