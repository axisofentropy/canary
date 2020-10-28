import React, { useState, useEffect } from "react";
import "./Review.css";

import { RouteComponentProps, navigate } from "@reach/router";
import { EnvironmentFilled } from "@ant-design/icons";
import { Stat } from "../components/Stat";
import { Radio, Rate, Collapse, Skeleton, Checkbox } from "antd/es";
import { useMediaQuery } from "react-responsive";

import { Review as ReviewInterface } from "../reviews";
import { database } from "../database";

const rateColor = (value) => (value > 3.5 ? "#2FF495" : value > 2 ? "#F9E02B" : "#F23E30"); //2FF495 30ADF2

const Question: React.SFC<{ label: string; className?: string }> = ({
	label,
	className = "",
	children,
}) => (
	<div className={"question" + className}>
		<div className="question__label">{label}</div>
		<div className="question__content">{children}</div>
	</div>
);

function NA_maker (content) {
	if (content == ""){
		content = "n.a.";
	}
	return content
}



function is_remote_packager (content) {
	if (content == "undefined"){
		content = "n.a.";
	} else if (content == "Some of both") {
    content = "Remote + In-person";
  } else if (content == null) {
    content = "In-person";
  }
	return content
}




const radioStyle = {
	lineHeight: "30px",
};

interface ReviewProps extends RouteComponentProps {
	reviewID?: string;
}
const Review = (props: ReviewProps) => {
	const isMobile = useMediaQuery({ query: "(min-width: 660px)" });
	const [review, setReview] = useState<ReviewInterface>();

	useEffect(() => {
		database
			.collection("review")
			.doc(props.reviewID)
			.get()
			.then((data) => {
				if (!data.data()) navigate("not-found");
				setReview(data.data() as ReviewInterface);
			})
			.catch((err) => {
				navigate("not-found");
			});
	}, [props.reviewID]);
	// const review = reviews.find(review => review.id === props.reviewID)




	return (
		<div id="myID" className="review-container">
			{review ? (
				<div className="review">
					<div className="review__company">
						{review.company.image && (
							<img src={review.company.image} alt="" className="review__company-image" />
						)}
						<div className="review__company-details">
							<h2 className="review__company-name">{review.company.name}</h2>
							<div className="review__company-description">{review.company.description}</div>
						</div>
					</div>

					<div className="review__card">

					<div className="review__position">
						<h2 className="review__position-name">
							<span>{review.position}</span>&emsp;
							<span style={{ margin: 0 }} className="review-card__team">
								<span className="review_terms_title">Department/team: </span>
								{review.team}
							</span>
						</h2>
					</div>
					<div className="review__position-details">
						<span className="review__internship-type">
							{(review.structured_program ? "Structured" : "Unstructured") +
								" " +
								review.internship_type}
						</span>
						&emsp;
						<span className="review__location">
							<EnvironmentFilled /> {review.location}
						</span>
						&emsp;
						<span className="review__terms">
							<span className="review_terms_title">Employed: </span>
							{review.terms.join(", ")}</span>
					</div>

					<div className = "remote-tag">
						<p>{is_remote_packager(review.is_remote)}</p>
					</div>


					<div className="review__ratings">
						<Stat title="Overall rating" className="review__overall-rating">
							<div style={{ position: "relative", width: "90px", height: "90px" }}>
								<svg
									version="1.1"
									x="0px"
									y="0px"
									width="70px"
									height="70px"
									viewBox="0 0 70 70"
									style={{ margin: "10px" }}
								>
									<path
										style={{ fill: rateColor(review.overall_rating) }}
										d="M35,70C15.67,70,0,54.33,0,35S15.67,0,35,0s35,15.67,35,35L35,70z"
									/>
								</svg>
								<h2>{review.overall_rating}</h2>
							</div>
						</Stat>
						<Stat title="Culture rating" className="review__culture-rating">
							<Rate
								character="●"
								style={{ color: rateColor(review.culture_rating) }}
								value={review.culture_rating}
								disabled
								allowHalf
							/>
						</Stat>
						<Stat title="Work rating" className="review__work-rating">
							<Rate
								character="●"
								style={{ color: rateColor(review.work_rating) }}
								value={review.work_rating}
								disabled
								allowHalf
							/>
						</Stat>
					</div>
					<div className="review__content">
						{isMobile ? (
							<div className="review__short">

							<div className="review__tools">
								<h4>Tools Used</h4>
								<div className="review__tools-content">
									{review.tools.often.length > 0 && (
										<Question label="Used all the time" className="review__tools-always">
											{review.tools.often.join(", ")}
										</Question>
									)}
									{review.tools.occasionally.length > 0 && (
										<Question label="Used occasionally" className="review__tools-occasionally">
											{review.tools.occasionally.join(", ")}
										</Question>
									)}
									{review.tools.rarely.length > 0 && (
										<Question label="Used a little" className="review__tools-little">
											{review.tools.rarely.join(", ")}
										</Question>
									)}
								</div>
							</div>

							<div>
								<div className="review__compensation">
									<h4>Compensation</h4>
									<Question label="Pay">
										{review.pay}
										{/* <PayDisplay {...review.pay} /> */}
									</Question>
									<Question label="Housing stipend">
										{review.housing_stipend ? review.housing_stipend : "None"}
									</Question>
									{/* <Question label="Other benefits">
						{review.benefits ? review.benefits : 'None'}
					</Question> */}
								</div>


								<div className="review__profile">
									<h4>Intern Profile</h4>
									<Question label="Major">{review.major}</Question>
									<Question label="Year">
										{review.year.grad_level
											? review.year.grad_level.charAt(0).toUpperCase() +
											  review.year.grad_level.substring(1)
											: ""}
										, {review.year.year} year
									</Question>
									<Question label="School">{review.school}</Question>
									{review.other_studies && (
										<Question label="Other areas of study">{review.other_studies}</Question>
									)}
								</div>


									<div className="review__offer">
										<h4>Offers</h4>
										<Question label="Offered full time position?">
											{
												[
													"Yes, accepted",
													"Offered, but declined",
													"Not offered",
													"Not applicable (e.g. too early)",
												][review.offer]
											}
										</Question>
										{review.offer !== 0 && review.offer !== 1 && (
											<Question label="Would accept full time offer?">
												{
													[
														"Yes, definitely",
														"Maybe, I probably would",
														"No, definitely not", /* Used to be "Not offered" for some reason. So Reviews before 8-1-2020 that have a would_accept_offer value of 2 might have been clicking "not offered" instead of "No, defintely not"*/
														"Maybe, but probably not",
													][review.would_accept_offer]
												}
											</Question>
										)}
										{/* <Question label="Other benefits">
              {review.benefits ? review.benefits : 'None'}
            </Question> */}
									</div>
								</div>
							</div>
						) : (
							<Collapse bordered={false} style={{ backgroundColor: "#fff" }}>
								<Collapse.Panel header={<h4>Intern Profile</h4>} key="1">
									<Question label="Major">{review.major}</Question>
									<Question label="Year">
										{review.year.grad_level
											? review.year.grad_level.charAt(0).toUpperCase() +
											  review.year.grad_level.substring(1)
											: ""}
										, {review.year.year} year
									</Question>
									<Question label="School">{review.school}</Question>
									{review.other_studies && (
										<Question label="Other areas of study">{review.other_studies}</Question>
									)}
								</Collapse.Panel>
								<Collapse.Panel header={<h4>Compensation</h4>} key="2">
									<Question label="Pay">
										{review.pay}
										{/* <PayDisplay {...review.pay} /> */}
									</Question>
									<Question label="Housing stipend">
										{review.housing_stipend ? review.housing_stipend : "None"}
									</Question>
								</Collapse.Panel>
								<Collapse.Panel header={<h4>Tools Used</h4>} key="3">
									{review.tools.often.length > 0 && (
										<Question label="Used all the time" className="review__tools-always">
											{review.tools.often.join(", ")}
										</Question>
									)}
									{review.tools.occasionally.length > 0 && (
										<Question label="Used occasionally" className="review__tools-occasionally">
											{review.tools.occasionally.join(", ")}
										</Question>
									)}
									{review.tools.rarely.length > 0 && (
										<Question label="Used a little" className="review__tools-little">
											{review.tools.rarely.join(", ")}
										</Question>
									)}
								</Collapse.Panel>
								<Collapse.Panel header={<h4>Fulltime Offer</h4>} key="4">
									<Question label="Offered full time position?">
										{
											[
												"Yes",
												"Offered, but declined",
												"Not offered",
												"Not applicable (e.g. too early)",
											][review.offer]
										}
									</Question>
									{review.offer !== 0 && (
										<Question label="Would accept full time offer?">
											{
												[
													"Yes, definitely",
													"Maybe, I probably would",
													"Maybe, but probably not",
													"No, definitely not",
												][review.would_accept_offer]
											}
										</Question>
									)}
								</Collapse.Panel>
							</Collapse>
						)}

						<div className="review__long">
							<div className="review__description">
								<h3>Overview</h3>
								<p>{review.project_description}</p>
								<p>{review.description}</p>
								<p>{review.optional_remarks}</p>
							</div>
							<div className="review__recommendation">
								{/*<h3>Recommendations</h3>*/}
								<h4>Would recommend it to people who...</h4>
								{/* <Question label="Would recommend it to people who..."><p>{review.recommend}</p></Question> */}
								<p>{NA_maker(review.recommend)}</p>
								<h4>Would NOT recommend it to people who...</h4>
								{/* <Question label="Would NOT recommend it to people who..."><p>{review.not_recommend}</p></Question> */}
								<p>{NA_maker(review.not_recommend)}</p>
							</div>


							<div className="review__work">
								<h3>Work</h3>
								{/*<h4>Did the job meet your expectations?</h4>*/}
								{/* <Question label="Did the job meet your expectations?"> */}
								{/*
								<Radio.Group value={review.expectations}>
									<Radio style={radioStyle} value={0}>
										It was what I expected
									</Radio>
									<Radio style={radioStyle} value={1}>
										It was better
									</Radio>
									<Radio style={radioStyle} value={2}>
										It was worse
									</Radio>
									<Radio style={radioStyle} value={3}>
										Not better or worse, just different
									</Radio>
								</Radio.Group> */}
								{/* </Question> */}
								{/* {review.expectations !== 1 && <Question label="What was different?">{review.expectations_description}</Question>} */}
								{/*
								{review.expectations !== 0 && (
									<div>
										<h4>How was it different?</h4>
										<p>{review.expectations_description}</p>
									</div>
								)}
								*/}
								{/* <Question label="Impact of work"> */}



								<h4>Impact of work</h4>
								<Radio.Group value={review.impact}>
									<Radio style={radioStyle} value={0}>
										No impact (busy-work)
									</Radio>
									<Radio style={radioStyle} value={1}>
										Not very impactful
									</Radio>
									<Radio style={radioStyle} value={2}>
										Somewhat impactful
									</Radio>
									<Radio style={radioStyle} value={3}>
										Impactful
									</Radio>
									<Radio style={radioStyle} value={4}>
										Very impactful
									</Radio>
								</Radio.Group>
								{/* </Question> */}
								{/* <Question label="How much knowledge or experience was needed going in (pre-requisites)?"> */}
								<h4>How much knowledge or experience was needed going in (pre-requisites)?</h4>
								<Radio.Group value={review.prerequisites}>
									<Radio style={radioStyle} value={0}>
										None - they'll teach you what you need to know
									</Radio>
									<Radio style={radioStyle} value={1}>
										Beginner - need basic knowledge/experience in this area
									</Radio>
									<Radio style={radioStyle} value={2}>
										Intermediate - need to be pretty familiar with this area
									</Radio>
									<Radio style={radioStyle} value={3}>
										Expert - need to have advanced knowledge / multiple prior experiences in this
										area
									</Radio>
								</Radio.Group>
								{/* </Question> */}
								{/* <Question label="Time spent working"> */}
								<h4>Time spent working</h4>
								<Radio.Group value={review.work_time}>
									<Radio style={radioStyle} value={0}>
										0-20% (I might as well have done nothing)
									</Radio>
									<Radio style={radioStyle} value={1}>
										20-40% (I worked some, but there was a ton of down time)
									</Radio>
									<Radio style={radioStyle} value={2}>
										40-60% (Some days I stayed busy, but there was a good bit of down time)
									</Radio>
									<Radio style={radioStyle} value={3}>
										60-80% (I stayed pretty busy)
									</Radio>
									<Radio style={radioStyle} value={4}>
										80-100% (I was more or less busy the whole time)
									</Radio>
								</Radio.Group>



								{review.remote_description && (
									<div className="review__remotedescription">
										<h4>How did the company do with the internship being remote?</h4>
										<p>{review.remote_description}</p>
									</div>
								)}



								{(review.rounds || review.interview_types || review.formats) && (
									<div>
										<h3>Interview Details</h3>
										<h4>Rounds</h4>
										<Radio.Group value={review.rounds}>
											<Radio value={"1"}>1</Radio>
											<Radio value={"2"}>2</Radio>
											<Radio value={"3"}>3</Radio>
											<Radio value={"4+"}>4+</Radio>
										</Radio.Group>
										<h4>Interview format(s)</h4>
										<Checkbox.Group
											value={review.formats}
											options={[
												{ label: "In-person", value: "in_person" },
												{ label: "Remote (video conference, phone call, etc.)", value: "remote" },
												{ label: "Recorded video", value: "recorded" },
												{ label: "Online test (e.g. HireVue, HackerRank)", value: "online_test" },
											]}
										/>
										<h4>Interview type</h4>
										<Checkbox.Group
											value={review.interview_types}
											options={[
												{ label: "Behavioral", value: "behavioral" },
												{ label: "Technical", value: "technical" },
												{ label: "Case", value: "case" },
												{ label: "Past Experience", value: "past_experience" },
											]}
										/>
									</div>
								)}

								{/* </Question> */}
								{review.interview_advice && (
									<div className="review__advice">
										<h4>Advice on the application/interview process</h4>
										<p>{NA_maker(review.interview_advice)}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				</div>
			) : (
				<Skeleton active paragraph={{ rows: 10 }} />
			)}
		</div>
	);
};

export default Review;
