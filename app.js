const express = require('express');

const app = express();


const { router } = require('./src/middleware');

app.use('/logs', router);

// app.get('/', (req, res) => {


// });

app.listen(5000, () => {
  console.log('on 5000');
});
