const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const tickerSchema = new mongoose.Schema({
  symbol: {type: String, unique: true, index: true},
  name: String,
  price: Number,
  avg200Day: Number,
  avg50Day: Number,
}); 

tickerSchema.plugin(uniqueValidator);

let Record = mongoose.model('tickers', tickerSchema);

module.exports = Record;
