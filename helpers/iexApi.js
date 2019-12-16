const axios = require('axios');
const Record = require('../db/TickerModel.js');
const { IEXKEY } = require('../secrets/keys');

const fetchApiTicker = (req, res) => {
  const ticker = req.body.symbol
  let freshData = {};

  console.log('hello3333')
  // something is wrong and the below console logs aren't loging on the server

  axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${IEXKEY}`)
    .then(data => {
      let quoteData = data.data;
      freshData.price = quoteData.iexRealtimePrice.toFixed(2);

      if (quoteData.change >= 0) {
        freshData.percentChange = `+${quoteData.change.toFixed(2)}%`;
      } else {
        freshData.percentChange = quoteData.change.toFixed(2) + '%';
      }
      return axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/stats?=${IEXKEY}`)
    })
    .then((data) => {
      let axiosData = data.data;
      console.log('hello2')
      freshData.symbol = axiosData.symbol;
      freshData.name = axiosData.companyName;
      freshData.avg200Day = axiosData.day200MovingAvg.toFixed(2)
      freshData.avg50Day = axiosData.day50MovingAvg.toFixed(2);
      let tickerInstance = new Record(freshData);
      return tickerInstance.save()
    })
    .then((data) => {
      console.log({ data })
      console.log('hello')
      let sendObject = {};
      if (freshData.avg200Day < freshData.price) {
        sendObject.message = `${freshData.symbol} has been added to your watchlist. We'll let
      you know if the stock's price falls below its 200-day moving average!!`;
        sendObject.info = freshData;
      } else {
        sendObject.message = `${freshData.symbol} has been added to your watchlist. We'll let
      you know if the stock's price rises above its 200-day moving average!`
        sendObject.info = freshData;
      }
      console.log({ sendObject });
      res.send(sendObject);
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





const refreshTickerData = async (req, res) => {
  let upperCaseTicker = req.params.symbol; //client normalizes all tickers to upper case to send to db as uppercase 
  let lowerCaseTicker = req.params.symbol.toLowerCase(); //api takes a lowercase ticker
  let target = { symbol: upperCaseTicker };
  let freshData = {};

  try {
    let quote = await axios.get(`https://cloud.iexapis.com/stable/stock/${lowerCaseTicker}/quote/?displayPercent=true&token=${IEXKEY}`);
    quote = quote.data;
    let price = quote.iexRealtimePrice ? quote.iexRealtimePrice : quote.delayedPrice;
    freshData.price = price.toFixed(2);
    if (quote.change >= 0) {
      freshData.percentChange = `+${(quote.changePercent).toFixed(2)}%`;
    } else {
      let num = (quote.changePercent).toFixed(2);
      freshData.percentChange = `${num}%`;
    }

  } catch (e) {
    console.error(e);
  }

  try {
    let stats = await axios.get(`https://cloud.iexapis.com/stable/stock/${lowerCaseTicker}/stats?token=${IEXKEY}`);
    stats = stats.data;
    freshData.avg200Day = stats.day200MovingAvg.toFixed(2);
    freshData.avg50Day = stats.day50MovingAvg.toFixed(2);
    console.log({ freshData });
    Record.findOneAndUpdate(target, freshData, { new: true })
      .then(freshRecord => {
        res.send(freshRecord);
      });
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  fetchApiTicker,
  refreshTickerData,
}
