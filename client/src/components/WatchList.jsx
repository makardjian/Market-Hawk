import React from 'react';
import WatchListEntry from './WatchListEntry.jsx';

const WatchList = (props) => {
  console.log(props)
  return (
    <table>
      <caption className='section-header'>Your Current Watchlist</caption>
      <tbody>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>200 Day <br></br> Moving Average</th>
      </tr>
      {
      props.watchList.map((entry, index)=> {
        return (<WatchListEntry entry={entry} previousEntry={props.previousList[index]}/>)
      })
      }
      </tbody>
    </table>
  )
}

export default WatchList;