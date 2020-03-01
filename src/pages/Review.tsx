import React from 'react';
import './Review.css';

import { RouteComponentProps, Redirect } from "@reach/router"
import { EnvironmentFilled, QuestionCircleOutlined } from '@ant-design/icons'
import { Stat } from '../components/Stat';
import { PayDisplay } from '../components/PayDisplay';
import { Tooltip, Radio, Rate, Collapse } from 'antd/es';
import { useMediaQuery } from 'react-responsive'

import { reviews } from '../reviews'

const rateColor = value => value > 3.5 ? '#2FF495' : value > 1.5 ? '#F9E02B' : '#F23E30'; //2FF495 30ADF2

const Question: React.SFC<{ label: string, className?: string } > = ({ label, className = "", children }) => (
  <div className={"question" + className}>
    <div className="question__label">{label}</div>
    <div className="question__content">{children}</div>
  </div>
)

const radioStyle = {
  lineHeight: '30px',
}

interface ReviewProps extends RouteComponentProps { reviewID?: string }
const Review = (props: ReviewProps) => {
  const isMobile = useMediaQuery({ query: '(min-width: 660px)' })
  const review = reviews.find(review => review.id === props.reviewID)
  console.log(review);
  
  return !review ? <Redirect noThrow to="/reviews/not-found" /> : (
    <div className="review">
      <div className="review__company">
        <img src={review.company.image} alt="" className="review__company-image" />
        <div className="review__company-details">
          <h2 className="review__company-name">{review.company.name}</h2>
          <div className="review__company-description">{review.company.description}</div>
        </div>
      </div>
      <div className="review__position">
        <h2 className="review__position-name"><span>{review.position}</span>&emsp;<span style={{margin: 0}} className="review-card__team">{review.team}</span></h2>
      </div>
      <div className="review__position-details">
        <span className="review__internship-type">{(review.structured_program ? 'Structured' : 'Unstructured') + ' ' + review.internship_type}</span>&emsp;
        <span className="review__location"><EnvironmentFilled /> {review.location}</span>&emsp;
        <span className="review__terms">Employed: {review.terms.join(',')}</span>
      </div>
      <div className="review__ratings">
        <Stat title="Overall rating" className="review__overall-rating">
            <svg version="1.1" x="0px" y="0px" width="70px"
            height="70px" viewBox="0 0 70 70" style={{margin: '10px'}}>
            <path style={{ fill: rateColor(review.overall_rating) }}
              d="M35,70C15.67,70,0,54.33,0,35S15.67,0,35,0s35,15.67,35,35L35,70z" />
            <text transform="matrix(1 0 0 1 16.916 43.1436)" style={{
              fontSize: '29.3344px',
              fontWeight: 700,
            }}>{review.overall_rating}</text>
            </svg>
        </Stat>
        <Stat title="Culture rating" className="review__culture-rating">
          <Rate character="●" style={{ color: rateColor(review.culture_rating) }} value={review.culture_rating} disabled allowHalf />
        </Stat>
        <Stat title="Work rating" className="review__work-rating">
          <Rate character="●" style={{ color: rateColor(review.work_rating) }} value={review.work_rating} disabled allowHalf />
        </Stat>
      </div>
      <div className="review__content">
        {isMobile ?
          <div className="review__short">
            <div className="review__profile">
              <h4>Intern Profile <Tooltip title="A description of who wrote the review"><QuestionCircleOutlined style={{ fontSize: '0.85em' }} /></Tooltip></h4>
              <Question label="Major">{review.major}</Question>
              <Question label="Year">{review.year.grad_level ? review.year.grad_level.charAt(0).toUpperCase() + review.year.grad_level.substring(1) : ''}, {review.year.year} year</Question>
              <Question label="School">{review.school}</Question>
              <Question label="Other areas of study">{review.other_studies}</Question>
            </div>
            <div className="review__compensation">
              <h4>Compensation</h4>
              <Question label="Pay">
                {review.pay}
                {/* <PayDisplay {...review.pay} /> */}
              </Question>
              <Question label="Housing stipend">
                {review.housing_stipend ? review.housing_stipend : 'None'}
              </Question>
              {/* <Question label="Other benefits">
              {review.benefits ? review.benefits : 'None'}
            </Question> */}
            </div>
            <div className="review__tools">
              <h4>Tools Used</h4>
              <div className="review__tools-content">
                {review.tools.often.length > 0 && <Question label="Used all the time" className="review__tools-always">
                  {review.tools.often}
                </Question>}
                {review.tools.occasionally.length > 0 && <Question label="Used occasionally" className="review__tools-occasionally">
                  {review.tools.occasionally}
                </Question>}
                {review.tools.rarely.length > 0 && <Question label="Used a little" className="review__tools-little">
                  {review.tools.rarely}
                </Question>}
              </div>
            </div>
            <div className="review__future">
              <h4>Offers</h4>
              <Question label="Offered full time offer?">{review.offer}</Question>
              {review.offer !== 'Yes' && <Question label="Would accept full time offer?">{review.would_offer}</Question>}
              {/* <Question label="Other benefits">
              {review.benefits ? review.benefits : 'None'}
            </Question> */}
            </div>
          </div>
          :
          <Collapse bordered={false} style={{ backgroundColor: '#fff' }} >
            <Collapse.Panel header={<h4>Intern Profile</h4>} key="1">
              <Question label="Major">{review.major}</Question>
              <Question label="Year">{review.year.grad_level ? review.year.grad_level.charAt(0).toUpperCase() + review.year.grad_level.substring(1) : ''}, {review.year.year} year</Question>
              <Question label="School">{review.school}</Question>
              <Question label="Other areas of study">{review.other_studies}</Question>
            </Collapse.Panel>
            <Collapse.Panel header={<h4>Compensation</h4>} key="2">
              <Question label="Pay">
                {review.pay}
                {/* <PayDisplay {...review.pay} /> */}
              </Question>
              <Question label="Housing stipend">
                {review.housing_stipend ? review.housing_stipend : 'None'}
              </Question>
            </Collapse.Panel>
            <Collapse.Panel header={<h4>Tools Used</h4>} key="3">
              {review.tools.often.length > 0 && <Question label="Used all the time" className="review__tools-always">
                {review.tools.often}
              </Question>}
              {review.tools.occasionally.length > 0 && <Question label="Used occasionally" className="review__tools-occasionally">
                {review.tools.occasionally}
              </Question>}
              {review.tools.rarely.length > 0 && <Question label="Used a little" className="review__tools-little">
                {review.tools.rarely}
              </Question>}
            </Collapse.Panel>
            <Collapse.Panel header={<h4>Fulltime Offer</h4>} key="4">
              <Question label="Offered full time offer?">{review.offer}</Question>
              {review.offer !== 'Yes' && <Question label="Would accept full time offer?">{review.would_offer}</Question>}
            </Collapse.Panel>
          </Collapse>
        }
        

        <div className="review__long">
          <div className="review__description">
            <h3>Job description</h3>
            <p>{review.description}</p>
          </div>
          <div className="review__recommendation">
            <h3>Recommendations</h3>
            <h4>Would recommend it to people who...</h4>
            {/* <Question label="Would recommend it to people who..."><p>{review.recommend}</p></Question> */}
            <p>{review.recommend}</p>
            <h4>Would NOT recommend it to people who...</h4>
            {/* <Question label="Would NOT recommend it to people who..."><p>{review.not_recommend}</p></Question> */}
            <p>{review.not_recommend}</p>
          </div>
          <div className="review__work">
            <h3>Work</h3>
            <h4>Did the job meet your expectations?</h4>
            {/* <Question label="Did the job meet your expectations?"> */}
            <Radio.Group>
              <Radio style={radioStyle} value={1} checked={review.expectations === 1}>
                It was what I expected
                </Radio>
              <Radio style={radioStyle} value={2} checked={review.expectations === 2}>
                It was better
                </Radio>
              <Radio style={radioStyle} value={3} checked={review.expectations === 3}>
                It was worse
                </Radio>
              <Radio style={radioStyle} value={4} checked={review.expectations === 4}>
                Not better or worse, just different
                </Radio>
            </Radio.Group>
            {/* </Question> */}
            {/* {review.expectations !== 1 && <Question label="What was different?">{review.expectations_description}</Question>} */}
            {review.expectations !== 1 && <div>
              <h4>How was it different?</h4>
              {review.expectations_description}
            </div>}
            {/* <Question label="Impact of work"> */}

            <h4>Impact of work</h4>
            <Radio.Group>
              <Radio style={radioStyle} value={1} checked={review.impact === 1}>
                No impact (busy-work)
                </Radio>
              <Radio style={radioStyle} value={2} checked={review.impact === 2}>
                Not very impactful
                </Radio>
              <Radio style={radioStyle} value={3} checked={review.impact === 3}>
                Somewhat impactful
                </Radio>
              <Radio style={radioStyle} value={4} checked={review.impact === 4}>
                Impactful
                </Radio>
              <Radio style={radioStyle} value={5} checked={review.impact === 5}>
                Very impactful
                </Radio>
            </Radio.Group>
            {/* </Question> */}
            {/* <Question label="How much knowledge or experience was needed going in (pre-requisites)?"> */}
            <h4>How much knowledge or experience was needed going in (pre-requisites)?</h4>
            <Radio.Group>
              <Radio style={radioStyle} value={1} checked={review.prerequisites === 1}>
                None - they'll teach you what you need to know
                </Radio>
              <Radio style={radioStyle} value={2} checked={review.prerequisites === 2}>
                Beginner - need basic knowledge/experience in this area
                </Radio>
              <Radio style={radioStyle} value={3} checked={review.prerequisites === 3}>
                Intermediate - need to be pretty familiar with this area
                </Radio>
              <Radio style={radioStyle} value={4} checked={review.prerequisites === 4}>
                Expert - need to have advanced knowledge / multiple prior experiences in this area
                </Radio>
            </Radio.Group>
            {/* </Question> */}
            {/* <Question label="Time spent working"> */}
            <h4>Time spent working</h4>
            <Radio.Group>
              <Radio style={radioStyle} value={1} checked={review.work_time === 1}>
                0-20% (I might as well have done nothing)
                </Radio>
              <Radio style={radioStyle} value={2} checked={review.work_time === 2}>
                20-40% (I worked some, but there was a ton of down time)
                </Radio>
              <Radio style={radioStyle} value={3} checked={review.work_time === 3}>
                40-60% (Some days I stayed busy, but there was a good bit of down time)
                </Radio>
              <Radio style={radioStyle} value={4} checked={review.work_time === 4}>
                60-80% (I stayed pretty busy)
                </Radio>
              <Radio style={radioStyle} value={5} checked={review.work_time === 5}>
                80-100% (I was more or less busy the whole time)
                </Radio>
            </Radio.Group>
            {/* </Question> */}
            <h4>Advice on the application/interview process</h4>
            {review.interview_advice}
          </div>
        </div>
        

      </div>
    </div>
  );
}

export default Review;