const express = require('express');
const app = express();
const PORT = 3001;
const db = require('../db/TickerController.js');
const bodyParser = require('body-parser')

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);  
})

app.post('/addToWatchList', db.addTicker);

