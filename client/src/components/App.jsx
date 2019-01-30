import React from 'react';
import axios from 'axios';
import WatchList from './WatchList.jsx';
import AddStock from './AddStock.jsx';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      watchList: [],
      currentMessage: '',
    }
    this.addTickerToWatchlist = this.addTickerToWatchlist.bind(this);
  }

  componentDidMount() {
    axios.get('/getAllStocks')
    .then(data => {
      this.setState({
        watchList: data.data,
      })
    })
  }

  addTickerToWatchlist(query) {
    axios.post('/realapidata', query)
    .then(data => {
      console.log(data)
      
      if (data.data.info) {
        let newData = this.state.watchList.concat(data.data.info)
        this.setState({
          watchList: newData,
          currentMessage: data.data.message
        })
      } else {
        console.log(data)
        this.setState({
          currentMessage: data.data.message,
        })
      }
    })
  }

  render() {
    return (
      <div>
        <img id='page-title' src='marketwatch-logo-vector-download.png' style={{}}/>
        <div id='container'>
          <WatchList watchList={this.state.watchList}/>
          <AddStock addTickerToWatchlist={this.addTickerToWatchlist} 
          currentMessage={this.state.currentMessage}/>
        </div>
      </div>
    )
  }
}

export default App;

