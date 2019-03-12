import React from 'react';
import WatchListEntry from './WatchListEntry.jsx';

const WatchList = (props) => {
  return (
    <table>
      <caption className='section-header'>Your Current Watchlist</caption>
      <tbody>
      <tr>
        <th>Symbol</th>
        <th>Last</th>
        <th>%Change</th>
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