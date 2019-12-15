import React from 'react';
import SymbolColor from './SymbolColor.jsx'

const WatchListEntry = (props) => {

  console.log(props.entry, 'props.entry');

  if (!props.previousEntry || props.entry.price === props.previousEntry.price) {
    return (
      <tr className='watchlist-entry'>
        <SymbolColor
          symbol={props.entry.symbol}
          percentChange={props.entry.percentChange}
        />
        <td className='price-same'>{props.entry.price}</td>
        <td>{props.entry.percentChange}</td>
        <td>{props.entry.avg200Day}</td>
      </tr>
    )
  } else if (props.entry.price > props.previousEntry.price) {
    return (
      <tr className='watchlist-entry'>
        <SymbolColor
          symbol={props.entry.symbol}
          percentChange={props.entry.percentChange}
        />
        <td className='price-up flash-green'>{props.entry.price}</td>
        <td>{props.entry.percentChange}</td>
        <td>{props.entry.avg200Day}</td>
      </tr>
    )
  } else {
    return (
      <tr className='watchlist-entry'>
        <SymbolColor
          symbol={props.entry.symbol}
          percentChange={props.entry.percentChange}
        />
        <td className='price-down flash-red'>{props.entry.price}</td>
        <td>{props.entry.percentChange}</td>
        <td>{props.entry.avg200Day}</td>
      </tr>
    )
  }
}

export default WatchListEntry;