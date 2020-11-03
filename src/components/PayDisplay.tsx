import React from 'react';

const currencyMap = {
  USD: '$'
}

const payTypeMap = {
  hourly: '/hr',
  monthly: '/month',
  lump: ' total',
}

export const PayDisplay = ({ type, amount, currency }) => (
  <span className="pay-display">
    <span className="pay-display__amount"><span className="pay-display__symbol">{currencyMap[currency]}</span>{amount}</span>
    <span className="pay-display__type">{payTypeMap[type]}</span>
  </span>
)