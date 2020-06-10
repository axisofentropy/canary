import React from 'react';
import './Company.css';

import { RouteComponentProps } from "@reach/router"

const Company = (props: RouteComponentProps) => {
  return (
    <div className="Company">
      <header className="company__header"></header>
      <div className="company__reviews"></div>
    </div>
  );
}

export default Company;