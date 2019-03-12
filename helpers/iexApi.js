const axios = require('axios');
const Record = require('../db/TickerModel.js');

const fetchApiTicker = (req, res) => {
  const ticker = req.body.symbol
  let freshData ={};

  axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/quote`)
  .then(data => {
    let quoteData = data.data;
    freshData.price = quoteData.iexRealtimePrice.toFixed(2);

    if (quoteData.change >= 0) {
      freshData.percentChange = `+${quoteData.change.toFixed(2)}%`;
    } else {
      freshData.percentChange = quoteData.change.toFixed(2) + '%';
    }
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
  let upperCaseTicker = req.params.symbol; //client normalizes all tickers to upper case to send to db as uppercase 
  let lowerCaseTicker = req.params.symbol.toLowerCase(); //api takes a lowercase ticker
  let target = {symbol: upperCaseTicker};
  let freshData = {};
  axios.get(`https://api.iextrading.com/1.0/stock/${lowerCaseTicker}/quote`)
  .then(data => {
    freshData.price = data.data.iexRealtimePrice.toFixed(2);

    //add a + sign in front of the percentChange if it's positive
    if (data.data.change >= 0) {
      freshData.percentChange = `+${data.data.change.toFixed(2)}%`;
    } else {
      freshData.percentChange = data.data.change.toFixed(2) + '%';
    }

    return axios.get(`https://api.iextrading.com/1.0/stock/${lowerCaseTicker}/stats`)
  })
  .then(data => {
    let axiosData = data.data;
    freshData.avg200Day = axiosData.day200MovingAvg.toFixed(2)
    freshData.avg50Day = axiosData.day50MovingAvg.toFixed(2);

    console.log(freshData, `fresh data for ${upperCaseTicker}`);
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
