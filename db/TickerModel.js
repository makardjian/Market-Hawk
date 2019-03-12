const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//might need to change price, avg200Day and avg50Day to string data types because that's
  //how the IEX functions are saving things to the database due to toFixed() returning a string.
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
