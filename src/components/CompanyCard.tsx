import React from 'react';
import './CompanyCard.css';

import { Review } from '../reviews'
// import { Link } from "@reach/router";
// import { Stat } from './Stat'

import ReviewCard from './ReviewCard';

const CompanyMeta = ({  }: {  }) => (
  <div className="company-meta">
    test
  </div>
)

const CompanyCard = ({ name, description, image, reviews }: { name: string, description: string, image?: string, reviews: Review[] }) =>  (
  <div className="company-card">
    <div className="company-card__header">
      <div className="company-card__left">
        {image && <img src={image} alt={name} className="company-card__img" />}
        <span className="company-card__title">
          <h2 className="company-card__name">{name}</h2>
          <div className="company-card__description">{description}</div>
        </span>
      </div>
      <div className="company-card__right">
        {/* <div className="company-card__stats"> */}
          {/* <Stat title="Overall">
            4.32
          </Stat>
          <Stat title="Culture">
            4.32
          </Stat>
          <Stat title="Work">
            4.32
          </Stat> */}
        {/* </div> */}
      </div>
    </div>
    <div className="company-card__more">
      {/* <Link to="/">More details about this company...</Link> */}
    </div>
    <div className="company-card__reviews">
      {reviews.map((review, i) => <ReviewCard key={i} review={review} />)}
    </div>
  </div>
);

export default CompanyCard;
