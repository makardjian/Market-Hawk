import React from 'react';
import axios from 'axios';
import WatchList from './WatchList.jsx'

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      watchList: [],
    }
  }

  componentDidMount() {
    axios.get('/getAllStocks')
    .then(data => {
      // console.log(data.data)
      this.setState({
        watchList: data.data,
      })
    })
  }

  render() {
    return (
      <div>
        <h1 id='page-title'>Market Watch</h1>
        <div id='container'>
          <WatchList watchList={this.state.watchList}/>
          {/* <AddStock/> */}
        </div>
      </div>
    )
  }
}

export default App;