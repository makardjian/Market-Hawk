import React from 'react';
import axios from 'axios';
import WatchList from './WatchList.jsx';
import AddStock from './AddStock.jsx';
import BluePromise from 'bluebird';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousList: [],
      watchList: [],
      currentMessage: '',
    }
    this.addTickerToWatchlist = this.addTickerToWatchlist.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.refreshWatchlist = this.refreshWatchlist.bind(this);
  }

  componentDidMount() {
    axios.get('/dbTickers')
      .then(data => {
        this.setState({
          watchList: data.data,
        });
      });
    this.refreshPrices = setInterval(this.refreshWatchlist, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.refreshPrices);
  }

  addTickerToWatchlist(query) {
    axios.post('/iexApiTickers', query)
      .then(data => {
        if (data.data.info) {
          let newData = [...this.state.watchList];
          newData = newData.concat(data.data.info)
          this.setState({
            watchList: newData,
            currentMessage: data.data.message
          })
        } else {
          this.setState({
            currentMessage: data.data.message,
          });
        }
      });
  }

  clearMessage() {
    this.setState({
      currentMessage: '',
    })
  }

  refreshWatchlist() {
    //  make a shallow copy of this.state.watchList
    let oldWatchList = [...this.state.watchList];
    //  use Bluepird.map to wait for each company's new data to return from IEX API (Promise.all)
    BluePromise.map(oldWatchList, (company) => {
      return axios.get(`/tickers/${company.symbol}`)
    })
      .then(data => {
        console.log({ data })
        //  map over array of axios api calls to pluck the data from the data property
        let freshPrices = data.map(company => {
          return company.data
        })
        console.log(freshPrices, 'freshprices')
        return freshPrices
      })
      .then(freshPrices => {
        this.setState({
          previousList: this.state.watchList,
          watchList: freshPrices,
        })
      })
  }

  render() {
    const { watchList, previousList, currentMessage } = this.state;
    // console.log({ watchList, previousList })
    return (
      <div>
        <img id='page-title' src='marketwatch-logo-vector-download.png' />
        <div id='container'>
          <WatchList watchList={watchList} previousList={previousList} />
          <AddStock addTickerToWatchlist={this.addTickerToWatchlist}
            currentMessage={currentMessage} clearMessage={this.clearMessage} />
        </div>
      </div>
    )
  }
}
