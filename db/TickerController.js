const db = require('./mongo.js');
const Record = require('./TickerModel.js');
const exampleData = require('./exampleData.js');


const getAllStocks = (req, res) => {
  Record.find()
  .then((data) => {
    res.send(data);
  })
}

//  POST -> gets fresh data for a given company and saves it to the DB.
const addTickerToWatchList = (req, res) => {
  console.log('hello', req.body)
  //Simulate an API call for a given ticker symbol where ExampleData is a fake version of real time prices
  let freshData = exampleData[req.body.symbol];
  if (!Object.keys(freshData).length) {
    res.send('Sorry, looks like there\'s no company with that ticker symbol. Please try again.');
    return;
  }

  let tickerInstance = new Record(freshData);
  tickerInstance.save()
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
    // alert(`Looks like ${freshData.symbol} is already on your watchlist.`);
    res.send(err);
  });
}




//  Twice a day the REFRESH PRICES API gets hit for every ticker on a user's list.
const refreshPrice = (req, res) => {
  const ticker = req.params.symbol
  const timeToSell = [];
  const timeToBuy = [];

  const comparePriceAndSave = (symbol) => {
    const freshData = exampleData[symbol];
    Record.find({symbol: symbol.toUpperCase()})
    .catch(err => {
      console.log('The error for finding your ticker symbol is' + err)
    })
    .then(oldData => {
      if (oldData.length) {
        oldData = oldData[0];
        if (oldData.price < oldData.avg200Day && freshData.price > oldData.avg200Day) {
          timeToBuy.push(freshData)
        }
        if (oldData.price > oldData.avg200Day && freshData.price < oldData.avg200Day) {
          timeToSell.push(freshData);
        }
      Record.findOneAndUpdate({symbol: symbol.toUpperCase()}, freshData)
        .then(() => {
          console.log('updated record!')
        })
        .catch(err => {
          console.log('There was an error trying to update your file' + err);
        })
      } else {
        console.log('Looks like that ticker symbol is not in the database')
      }
    })
    .then(() => {
      // console.log(timeToBuy, timeToSell, 'from callback')
      if (timeToSell.length && timeToBuy.length) {
        let sellSymbols = '';
        let buySymbols = '';
        timeToSell.forEach(ticker => {
          sellSymbols += `${ticker.symbol.toUpperCase()} `
        })
        timeToBuy.forEach(ticker => {
          buySymbols += `${ticker.symbol.toUpperCase()} `
        })

        res.send(`Alert! There's a lot going on in the markets today. ${sellSymbols} have croosed beneath their 200-day moving averages - 
        consider liquidating these short-term positions and realocating your capital to buy ${buySymbols} which have crossed above
        their 200-day moving averages.`)
        return;
      }

      if (timeToSell.length) {
        res.send(`Alert! The price of ${ticker.toUpperCase()} has crossed beneath its 200-day moving average. Consider liquidating
        any of your short-term ${ticker.toUpperCase()} positions`);
        return;
      }

      if (timeToBuy.length) {
        res.send(`Alert! The price of ${ticker.toUpperCase()} has crossed above its 200-day moving average. Now would be a good time to buy.`)
        return;
      } else {
        res.send('No alerts at this time')
      }
    });
  } 
  comparePriceAndSave(ticker);
}





module.exports = {
  getAllStocks,
  addTickerToWatchList,
  refreshPrice
}
