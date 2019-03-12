import React, { Component } from 'react';

const SymbolColor = (props) => {
  const {symbol, percentChange} = props;
  let change = percentChange.slice(0, -1)
  if (change >= 0) {
    return (
      <td className='price-up'>{symbol}</td>  
    )
  } else {
    return (
      <td className='price-down'>{symbol}</td>
    )
  }
}

export default SymbolColor;

