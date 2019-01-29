import React from 'react';
import WatchListEntry from './WatchListEntry.jsx';

function WatchList(props) {
  return (
    <table>
      <caption className='section-header'>Your Current Watchlist</caption>
      <tbody>
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
      </tbody>
    </table>
  )
}

export default WatchList