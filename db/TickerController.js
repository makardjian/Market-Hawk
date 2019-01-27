const db = require('./mongo.js');
const Ticker = require('./TickerModel.js');
const exampleData = require('./exampleData.js');

//  POST -> gets fresh data for a given company and saves it to the DB.
const addTicker = (req, res) => {
  console.log('hello', req.body)
  //Simulate an API call for a given ticker symbol where ExampleData is a fake version of real time prices
  let freshData = exampleData[req.body.symbol];
  if (!Object.keys(freshData).length) {
    res.send('Sorry, looks like there\'s no company with that ticker symbol. Please try again.');
    return;
  }

  let tickerInstance = new Ticker(freshData);
  tickerInstance.save()
  .then(() => {
    if (freshData.avg200Day < freshData.price) {
      res.send(`${freshData.symbol} has been added to your watchlist. We'll let
        you know if the stock's price rises above its 200-day moving average!`)
    } else {
      res.send(`${freshData.symbol} has been added to your watchlist. We'll let
      you know if the stock's price falls below its 200-day moving average!`)
    }
  })
  .catch((err) => {
    res.send(`Looks like ${freshData.symbol} is already in the database.`)
    console.log(err);
  });
}

//  Twice a day the REFRESH PRICES API gets hit for every ticker on a user's list.
const refreshData = (req, res) => {
  const ticker = req.params.symbol
  const timeToSell = [];
  const timeToBuy = [];

  const comparePrices = (symbol) => {
    const oldData = Ticker.find(symbol: symbol);
    const newData = exampleData[symbol];
    if (oldData.price < oldData.avg200Day && freshData.price > oldData.avg200Day) {
      timeToBuy.push(freshData)
    }
    if (oldData.price > oldData.avg200Day && freshData.price < oldData.avg200Da) {
      timeToSell.push(freshData);
    }
  }
  comparePrices(ticker);
  return 
}

/*
refreshData Functionality:
  /retrieve data on a given ticker from the database. 
  /make an API call for all the same ticker symbol.
  /if (oldData.price < oldData.200Avg is true && freshData.price > oldData.200Day avg)  
    /notify user that the price of the given ticker symbol has risen above the 200Day moving average, consider buying. 
  /if (oldData.price > oldData.200Avg. && freshData.price < oldData.200DayAvg)
    /notify user that price has gone below 200 day avg, and to consdier selling your positions.

  //overwrite the old data with new data in the database
  // 

*/

module.exports = {
  addTicker,
}