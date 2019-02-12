import React from 'react';
import axios from 'axios';
import WatchList from './WatchList.jsx';
import AddStock from './AddStock.jsx';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      watchList: [],
      currentMessage: '',
    }
    this.addTickerToWatchlist = this.addTickerToWatchlist.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
  }

  componentDidMount() {
    axios.get('/dbTickers')
    .then(data => {
      console.log(data.data, 'db data')
      this.setState({
        watchList: data.data,
      });
    });

    let refreshPrices = setTimeout(this.refreshWatchlist.bind(this), 2000)

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
        })
      }
    })
  }

  clearMessage () {
    this.setState({
      currentMessage: '',
    })
  }

  refreshWatchlist () {
    let freshWatchList = [...this.state.watchList] //make a shallow copy of this.state.watchList
    freshWatchList.forEach((company, index) => {
      axios.get(`/tickers/${company.symbol}`)
      .then(data => {
        data = data.data;
        console.log(data, 'data that was sent back from server')
      })
    })

    //figure out how to reset the state of the watchList inside the forEAch function so that the DOM updates
    
  }

  render() {
    return (
      <div>
        <img id='page-title' src='marketwatch-logo-vector-download.png'/>
        <div id='container'>
          <WatchList watchList={this.state.watchList}/>
          <AddStock addTickerToWatchlist={this.addTickerToWatchlist} 
          currentMessage={this.state.currentMessage} clearMessage={this.clearMessage}/>
        </div>
      </div>
    )
  }
}
