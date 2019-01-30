import React from 'react';

class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      showMessage: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange (e) {
    this.setState({
      input: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let query = {symbol: this.state.input.toLowerCase()}
    console.log(query)

    this.props.addTickerToWatchlist(query);
    this.setState({
      showMessage: !this.state.showMessage,
    })
  }

  handleClick() {
    this.setState({
      showMessage: !this.state.showMessage,
    })
  }

  render() {
    if (!this.state.showMessage) {
      return (
        <div className='add-stock-component'>
          <div className='section-header'>Add a stock to your Watchlist</div>
          <form className='form' onSubmit={this.handleSubmit}>
            <label>Ticker Symbol:</label>
            <input type='text' onChange={this.handleChange}></input>
            <button onClick={this.handleSubmit}>Add Stock</button>
          </form>
        </div>
      )
    } else {
      return (
        <div id='message' className='add-stock-component'>
          <div className='section-header'>Add a stock to your Watchlist</div>
          <div>{this.props.currentMessage}</div>
          <button onClick={this.handleClick}>Add another stock</button>
        </div>
      )
    }
  }
}

export default AddStock;

/*
Current Plan:
  /Create a new component called Message on the AddStock Component
  /set a Message property on the state of AddStock = false
  /Onsubmit, set the Addstock.message = true.
  /conditionally render a page that will display the message to the user
  /Add a button to this page that says 'Add another Stock' Which will reset the state of message to false.
*/