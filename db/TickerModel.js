const mongoose = require('mongoose');

const tickerSchema = new mongoose.Schema({
  id: {type: Number, index: true},
  symbol: {type: String, unique: true, index: true},
  name: String,
  amPrice: Number,
  pmPrice: Number,
  avg200Day: Number,
  avg50Day: Number
}); 

let Ticker = mongoose.model('tickers', tickerSchema);

module.exports = Ticker;
