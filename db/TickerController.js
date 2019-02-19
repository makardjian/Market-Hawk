const Record = require('./TickerModel.js');
const exampleData = require('./exampleData.js');
const axios = require('axios');


const getAllTickers = (req, res) => {
  Record.find()
  .then((data) => {
    res.send(data);
  })
}


module.exports = {
  getAllTickers,
  refreshPrice,
}
