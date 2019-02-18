import React from 'react';

const WatchListEntry = (props) => {
  console.log(props, 'props')

  if (!props.previousEntry || props.entry.price === props.previousEntry.price) {
    return (
      <tr className='watchlist-entry'>
        <td>{props.entry.symbol}</td>
        <td className='price-same'>{props.entry.price}</td>
        <td>{props.entry.avg200Day}</td>
      </tr>
    )
  } else if (props.entry.price > props.previousEntry.price) {
      return (
        <tr className='watchlist-entry'>
        <td>{props.entry.symbol}</td>
        <td className='price-up flash-green'>{props.entry.price}</td>
        <td>{props.entry.avg200Day}</td>
      </tr>
    )
  } else {
    return (
      <tr className='watchlist-entry'>
        <td>{props.entry.symbol}</td>
        <td className='price-down flash-red'>{props.entry.price}</td>
        <td>{props.entry.avg200Day}</td>
      </tr>
    )
  }
}

export default WatchListEntry;