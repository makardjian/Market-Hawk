import React from 'react';

const WatchListEntry = (props) => {
  return (
    <tr className='watchlist-entry'>
      <td>{props.entry.symbol}</td>
      <td>{props.entry.price}</td>
      <td>{props.entry.avg200Day}</td>
    </tr>
  )
}

export default WatchListEntry;