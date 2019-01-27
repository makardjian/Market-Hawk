const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost/mvp'
const db = mongoose.connect(mongoURI, { useNewUrlParser: true })

db.then(() => {
  console.log(`connected to ${mongoURI}`);
})
.catch(err => {
  console.log(`there was an error connectiont to ${mongoURI}`);
  console.log(err);
})

module.exports = db;