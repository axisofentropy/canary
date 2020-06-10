import React from 'react';

import './Stat.css'

export const Stat: React.SFC<{ title: string, className?: string }> = ({ title, className = "", children }) => (
  <div className={"stat " + className}>
    <div className="stat__title">{title}</div>
    <div className="stat__content">{children}</div>
  </div>
)