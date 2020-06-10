import React from 'react';
import './ReviewCard.css';

import { Stat } from './Stat'
import { Rate, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from "@reach/router";
import { Review } from '../reviews'

import moment from "moment";
// import Review from '../pages/Review';

const rateColor = value => value > 3.5 ? '#2FF495' : value > 2 ? '#F9E02B' : '#F23E30'; //2FF495 30ADF2

interface ReviewCardProps {
  review: Review
  note?: string,
  wordLimit?: number,
  charLimit?: number,
}


const ReviewCard = ({ review, note = "", wordLimit = 35, charLimit=300 }: ReviewCardProps) => {

  function truncateDescription(description) {
    let wordLimited = description.split(' ').length > wordLimit ? description.split(' ').slice(0, wordLimit).join(' ') + ' ...' : description;
    if (wordLimited.length > charLimit)
      return description.slice(0, charLimit).replace(/\s\.\.\./, '') + ' ...'
    return wordLimited
  }
  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__overall-rating" style={{ background: rateColor(review.overall_rating) }}>{review.overall_rating}<span className="divisor">/5</span>
          
        </div>
        <div className="review-card__stats">
          {/* <Stat title="Overall">
            <Rate character="●" style={{ color: rateColor(review.overall_rating) }} value={review.overall_rating} disabled allowHalf />
          </Stat> */}
          <Stat title="Work Satisfaction">
            <Rate character="●" style={{ color: rateColor(review.work_rating) }} value={review.work_rating} disabled allowHalf />
          </Stat>
          <Stat title="Culture">
            <Rate character="●" style={{ color: rateColor(review.culture_rating) }} value={review.culture_rating} disabled allowHalf />
          </Stat>
        </div>
        <div className="review-card__meta">
          <div className="review-card__note">{note}</div>
          <div className="review-card__date">{moment.unix(review.timestamp.seconds).format("MM/DD/YY")}</div>
        </div>
      </div>
      <div className="review-card__content">
        <h2 className="review-card__position">{review.position} <span className="review-card__team">{review.team}</span></h2>
        <div className="review-card__description">{truncateDescription(review.description)}</div>
        <div className="review-card__footer">
          <Stat title="Pay">
            {review.pay}
          </Stat>
          <Stat title="Tools">
            <span className="review-card__tool">{review.tools.often.slice(0, 3).join(', ')}</span>
          </Stat>
          <Stat title="Major">
            {review.major}
          </Stat>
          {/* <Stat title="Year">
            {review.year.grad_level ? review.year.grad_level.charAt(0).toUpperCase() + review.year.grad_level.substring(1) : ''}, {review.year.year} year
          </Stat> */}
          <div className="review-card__view">
            <Link to={"/reviews/" + review.id}>Read more <ArrowRightOutlined/></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
