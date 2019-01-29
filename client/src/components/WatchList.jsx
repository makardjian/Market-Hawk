import React from 'react';
import WatchListEntry from './WatchListEntry.jsx';

function WatchList(props) {
  return (
    <table>
      <caption>Your Current Watchlist</caption>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>200D-MA</th>
      </tr>
      {
      props.watchList.map(entry => {
        return (<WatchListEntry entry={entry}/>)
      })
      }
    </table>
  )
}

export default WatchList