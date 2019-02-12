const express = require('express');
const app = express();
const PORT = 3001;
const mongoConnection = require('../db/mongo');
const db = require('../db/TickerController.js');
const iex = require('../helpers/iexApi.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../public'))

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);  
})


app.get('/dbTickers', db.getAllTickers)

app.get('/tickers/:symbol', iex.refreshTickerData)

app.post('/iexApiTickers', iex.fetchApiTicker)