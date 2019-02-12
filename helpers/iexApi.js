const axios = require('axios');
const Record = require('../db/TickerModel.js');

const fetchApiTicker = (req, res) => {
  const ticker = req.body.symbol
  let freshData ={};

  axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/price`)
  .then(data => {
    freshData.price = data.data;
    return axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/stats`)
  })
  .then((data) => {
    let axiosData = data.data;

    freshData.symbol = axiosData.symbol;
    freshData.name = axiosData.companyName;
    freshData.avg200Day = axiosData.day200MovingAvg.toFixed(2)
    freshData.avg50Day = axiosData.day50MovingAvg.toFixed(2);
    let tickerInstance = new Record(freshData);
    return tickerInstance.save()
  })
  .then(() => {
    let sendObject = {};
    if (freshData.avg200Day < freshData.price) {
      sendObject.message = `${freshData.symbol} has been added to your watchlist. We'll let
      you know if the stock's price falls below its 200-day moving average!!`;
      sendObject.info = freshData;
      res.send(sendObject)
    } else {
      sendObject.message = `${freshData.symbol} has been added to your watchlist. We'll let
      you know if the stock's price rises above its 200-day moving average!`
      sendObject.info = freshData;
      res.send(sendObject);
    }
  })
  .catch((err) => {
    let sendObject = {};
    if (err._message === 'tickers validation failed') {
      sendObject.message = `Looks like ${freshData.symbol} is already on your watchlist.`
      res.send(sendObject);
      console.log(err._message);
    }
  });
}




const refreshTickerData = (req, res) => {
  let upperCaseTicker = req.params.symbol;
  let lowerCaseTicker = req.params.symbol.toLowerCase();
  let target = {symbol: upperCaseTicker};
  let freshData = {};
  axios.get(`https://api.iextrading.com/1.0/stock/${lowerCaseTicker}/price`)
  .then(data => {
    freshData.price = Number(data.data.toFixed(2));

    return axios.get(`https://api.iextrading.com/1.0/stock/${lowerCaseTicker}/stats`)
  })
  .then(data => {
    let axiosData = data.data;
    freshData.avg200Day = axiosData.day200MovingAvg.toFixed(2)
    freshData.avg50Day = axiosData.day50MovingAvg.toFixed(2);

    // console.log(freshData, 'freshData');
    // console.log(target,'target')

    return Record.findOneAndUpdate(target, freshData, {new: true})
  })
  .catch(err => {
    console.log(err);
  })
  .then((freshRecord) => {
    res.send(freshRecord);
  })
}








module.exports = {
  fetchApiTicker,
  refreshTickerData,
}