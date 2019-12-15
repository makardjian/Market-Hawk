const Record = require('./TickerModel.js');


const getAllTickers = (req, res) => {
  Record.find()
    .then((data) => {
      res.send(data);
    })
}


module.exports = {
  getAllTickers,
}
