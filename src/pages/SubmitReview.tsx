import React, { useState } from "react";
import "./SubmitReview.css";
import {schools, locations, majors} from "./SubmitAutocomplete.js";

import { useCookies } from "react-cookie";
import { RouteComponentProps, navigate } from "@reach/router";
import {
	Input,
	Form,
	Button,
	Select,
	Radio,
	Tooltip,
	Rate,
	Steps,
	Checkbox,
	InputNumber,
	Slider,
	Tabs,
	AutoComplete,
} from "antd/es";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { YearValue } from "../reviews";
import { database } from "../database";
// import { InputChangeEvent } from 'antd/es/input';

const { Option } = Select;

const { TabPane } = Tabs;





const marks_impact = {
0: "No impact (busy-work)",
1: "Not very impactful",
2: "Somewhat impactful",
3: "Impactful",
4: "Very impactful"
};

const marks_prerequisites = {
	0: "None (they'll teach you what you need to know)",
	1: "Beginner (need basic knowledge/ experience)",
	2: "Intermediate (need to be pretty familiar)",
	3: "Expert (need to have advanced knowledge/ experience)"
};

const marks_timeworking = {
	0: "0-20% (might as well have done nothing)",
	1: "20-40% worked some, but ton of down time)",
	2: "40-60% (some days stayed busy, but still good bit of downtime)",
	3: "60-80% (stayed pretty busy)",
	4: "80-100% (more or less busy the whole time)"
};

// const formItemLayout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 8 },
// };
// const formTailLayout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 8, offset: 4 },
// };

// const collegeSuggestions = [
//   "Georgia Institute of Technology",
//   "Carnegie Mellon",
//   "Georgia State University",
// ].map((option, i) => ({ value: option }))

// const companySuggestions = [
//   "Amazon",
//   "General Motors",
//   "UPS",
//   "NCR",
// ].map((option, i) => ({ value: option }))

const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
const semesters = ["Spring", "Summer", "Fall"];

const terms1 = years
	.reduce((acc, year) => {
		let perm = semesters.reduce((a, semester) => [...a, semester + " " + year], [] as string[]);
		return acc.concat(perm);
	}, [] as string[])
	.map((option, i) => (
		<Option value={option} key={i}>
			{option}
		</Option>
	));

	const terms = terms1.reverse();



// const majors = [
//   "Computer Science",
//   "Computational Media",
//   "Mechanical Engineering",
// ].map((option, i) => <Option value={option} key={i}>{option}</Option>)

const DynamicRule = () => {
	const [form] = Form.useForm();
	const [cookies, setCookie, removeCookie] = useCookies([
		"name",
		"email",
		"school",
		"majors",
		"year",
	]);
	const [hasHousingStipend, setHasHousingStipend] = useState(false);

	const onSuccess = (values) => {
		if (values.remember_personal) {
			setCookie("name", values.name || "");
			setCookie("school", values.school || "");
			setCookie("email", values.email || "");
			setCookie("major", values.major || "");
			setCookie("other_studies", values.other_studies || "");
			setCookie("year", values.year || {});
			setCookie("remember_personal", values.remember_personal);
		} else {
			removeCookie("name");
			removeCookie("school");
			removeCookie("email");
			removeCookie("major");
			removeCookie("other_studies");
			removeCookie("year");
			removeCookie("remember_personal");
		}
		const review = {
			id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
			timestamp: { seconds: new Date().getTime() / 1000 },
			company: {
				name: values.company_name || "",
				description: "",
				image:"",
			},
			position: values.position || "",
			team: values.team || "",
			internship_type: values.internship_type || "internship",
			structured_program: values.structured_program || "",
			location: values.location || "",
			terms: values.terms || [],
			pay: values.pay || "",
			overall_rating: values.overall_rating,
			culture_rating: values.culture_rating,
			work_rating: values.work_rating,
			year: Object.assign({ year: "1st", grad_level: "undergraduate" }, values.year),
			school: values.school,
			major: values.major,
			other_studies: values.other_studies || "",
			housing_stipend: values.housing_stipend || "",
			recommend: values.recommend || "",
			not_recommend: values.not_recommend || "",
			tools: {
				often: values.tools_often || [],
				occasionally: values.tools_occasionally || [],
				rarely: values.tools_rarely || [],
			},
			description: values.description || "",
			offer: values.offer,
			would_accept_offer: values.would_accept_offer || -1,
			impact: values.impact,
			prerequisites: values.prerequisites,
			expectations: values.expectations || "",
			expectations_description: values.expectations_description || "",
			work_time: values.work_time,
			interview_advice: values.interview_advice || "",
			optional_remarks: values.optional_remarks || "",
			rounds: values.rounds || "",
			formats: values.formats || [],
			interview_types: values.interview_types || [],
			feedback: values.feedback || "",
			is_visible: false,
			project_description: values.project_description || "",
			is_remote: values.is_remote || "",
			remote_description: values.remote_description || "",
			feedback_length: values.feedback_length || "",

		};
		// console.log(review);

		const user = {
			id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
			name: values.name,
			email: values.email || "",
			review_id: review.id,
			user_timestamp: { seconds: new Date().getTime() / 1000 },
		};

		database
			.collection("users")
			.doc(user.id)
			.set(user)
			.then(() => {
				database
					.collection("review")
					.doc(review.id)
					.set(review)
					.then(() => {
						navigate("/submit-success");
					})
					.catch((err) => {
						console.log(err);
						navigate("/submit-error");
					});
			})
			.catch((err) => {
				console.log(err);
				navigate("/submit-error");
			});
	};

	const onFail = (errorInfo) => {
		if (errorInfo.values.remember_personal) {
			setCookie("name", errorInfo.values.name || "");
			setCookie("school", errorInfo.values.school || "");
			setCookie("email", errorInfo.values.email || "");
			setCookie("major", errorInfo.values.major || "");
			setCookie("other_studies", errorInfo.values.other_studies || "");
			setCookie("year", errorInfo.values.year || {});
			setCookie("remember_personal", errorInfo.values.remember_personal);
		} else {
			removeCookie("name");
			removeCookie("school");
			removeCookie("email");
			removeCookie("major");
			removeCookie("other_studies");
			removeCookie("year");
			removeCookie("remember_personal");
		}
	};

	return (
		<Form
			scrollToFirstError={true}
			initialValues={{
				name: cookies.name,
				school: cookies.school,
				email: cookies.email,
				major: cookies.major,
				year: cookies.year,
				other_studies: cookies.other_studies,
				remember_personal: cookies.remember_personal === "true",
				internship_type: "internship",
			}}
			onFinish={onSuccess}
			onFinishFailed={onFail}
			form={form}
			layout="vertical"
			name="dynamic_rule"
		>
		  <div className = "featured_card_submit">
				<h3>🔥 For a limited time, get a <b>$5 Amazon gift card</b> when you leave a review!</h3>
				<p>Once your review is approved by our moderation team, a gift card code will be sent to your email adress! (limit one per user - hey I mean we're not loaded ya know)</p>
			</div>
			<br></br>
			<Steps direction="vertical">
				<Steps.Step status="process" title="About you" description={<AboutYou />} />
				<Steps.Step
					status="wait"
					title="Internship details"
					description={
						<InternshipDetails
							hasHousingStipend={hasHousingStipend}
							setHasHousingStipend={setHasHousingStipend}
						/>
					}
				/>
				<Steps.Step
					status="wait"
					title="Internship experience"
					description={<InternshipExperience />}
				/>
				<Steps.Step status="wait" title="Interview process" description={<InterviewProcess />} />
				<Steps.Step status="wait" title="Submit" description={<Submit onSubmit={onSuccess} />} />
			</Steps>
		</Form>
	);
};

const InterviewProcess = () => (
	<div className="interview-process">
		<Form.Item
			className = "input-horizontal"
			name="rounds"
			label="Rounds"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Radio.Group className="input-horizontal-spacer-rounds">
				<Radio value={"1"}>1</Radio>
				<Radio value={"2"}>2</Radio>
				<Radio value={"3"}>3</Radio>
				<Radio value={"4+"}>4+</Radio>
			</Radio.Group>
		</Form.Item>



		<Form.Item
			name="formats"
			label="Format(s)"
			extra="Choose all that apply"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Checkbox.Group
				options={[
					{ label: "In-person", value: "in_person" },
					{ label: "Remote (video conference, phone call, etc.)", value: "remote" },
					{ label: "Recorded video", value: "recorded" },
					{ label: "Online test (e.g. HireVue, HackerRank)", value: "online_test" },
				]}
			/>
		</Form.Item>


		<Form.Item
			name="interview_types"
			label="Interview type"
			extra="Choose all that apply"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Checkbox.Group
				options={[
					{ label: "Behavioral", value: "behavioral" },
					{ label: "Technical", value: "technical" },
					{ label: "Case", value: "case" },
					{ label: "Past Experience", value: "past_experience" },
				]}
			/>
		</Form.Item>
		<Form.Item
			name="interview_advice"
			label="Any other advice on the application/interview process?"
		>
			<Input.TextArea rows={1}></Input.TextArea>
		</Form.Item>
	</div>
);

const AboutYou = () => (
	<div className="about-you">
		<Form.Item
			className="input-horizontal"
			name="name"
			label="Name (will not be public)"
			rules={[
				{
					required: true,
					message: "Please input your full name",
				},
			]}
		>
			<Input style={{ maxWidth: "250px" }} placeholder="Please input your full name" className="input-horizontal-spacer"/>
		</Form.Item>

		{/*<Form.Item
			name="school"
			label="School"
			rules={[
				{
					required: true,
					message: "Please input your school",
				},
			]}
		>
			<Input style={{ maxWidth: "320px" }} placeholder="Please input your school"/>

		</Form.Item> */}


		<Form.Item
		className="input-horizontal"
		name="school"
		label="School"
		rules={[
			{
				required: true,
				message: "Please input your school",
			},
		]}
	>
		<AutoComplete
		className="input-horizontal-spacer"
		options={schools}
		placeholder="Please input your school"
		style={{ maxWidth: '320px' }}
		filterOption={(inputValue, option) => option ? option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false}/>
		</Form.Item>










		<Form.Item
			className="input-horizontal"
			name="email"
			label= {
				<span>
					School email (will not be public)
					<Tooltip className="input-horizontal-spacer" title="We use this to verify you are actually a student, and to send you stuff like Amazon gift cards (when we have a promotion going)">
						<QuestionCircleOutlined />
					</Tooltip>
				</span>
			}
			extra=""
			rules={[
				{
					required: true,
					type: "email",
					message: "Please input a valid school email",
				},
			]}
		>

			<Input style={{ maxWidth: "250px" }} placeholder="name@school.edu" className="input-horizontal-spacer"/>

		</Form.Item>


		{/*<Form.Item
			name="major"
			label="Major"
			rules={[
				{
					required: true,
					message: "Please input your major",
				},
			]}
		>
			<Input style={{ maxWidth: "320px" }} placeholder="Please input your major" />

			{/* <Select
				mode="tags"
				placeholder="Please input your major(s)"
				style={{ width: '100%', maxWidth: '340px' }} tokenSeparators={[',']}>
				{majors}
			</Select>
		</Form.Item> */}


			<Form.Item
		  className="input-horizontal"
			name="major"
			label="Major"
			rules={[
				{
					required: true,
					message: "Please input your major",
				},
			]}
		>
			<AutoComplete
			className="input-horizontal-spacer"
			options={majors}
			placeholder="Please input your major"
			style={{ maxWidth: '320px' }}
			filterOption={(inputValue, option) => option ? option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false}/>
			</Form.Item>








		{/* Minors and other studies */}

		{/*<Form.Item name="other_studies" label="Other studies (minors, certificates, etc.)">
			<Input style={{ maxWidth: "350px" }} placeholder="Please input your major" />
		</Form.Item> */}


		<Form.Item
			name="year"
			rules={[
				{
					required: true,
					message: "Please select your year",
				},
			]}
			label="Year in school when you applied to the job"
		>
			<YearInput />
		</Form.Item>
		<Form.Item
			name="remember_personal"
			valuePropName="checked"
			extra="If this is checked, once you submit, we'll store these details locally in your cookies, so you don't have to re-enter them if you write another review."
		>
			<Checkbox>Remember personal details for later?</Checkbox>
		</Form.Item>
	</div>
);

const InternshipDetails = ({ hasHousingStipend, setHasHousingStipend }) => (
	<div className="internship-details input-horizontal">
		<Form.Item
			className="input-horizontal"
			name="internship_type"
			label="Internship or Co-op"
			rules={[
				{
					required: true,
					message: "Please select internship type",
				},
			]}
		>
			<Radio.Group defaultValue="internship" value="internship" className="input-horizontal-spacer">
				<Radio.Button value="internship">Internship</Radio.Button>
				<Radio.Button value="co-op">Co-op</Radio.Button>
			</Radio.Group>
		</Form.Item>
		<Form.Item
			className="input-horizontal"
			name="company_name"
			label="Company name"
			rules={[
				{
					required: true,
					message: "Please input the company name",
				},
			]}
		>
			<Input style={{ maxWidth: "300px" }} placeholder="Please input the company name" className="input-horizontal-spacer" />
			{/* <AutoComplete
        options={companySuggestions}
        placeholder="Please input the company name"
        style={{ maxWidth: '250px' }}
        filterOption={(inputValue, option) => option ? option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false}/> */}
		</Form.Item>
		<Form.Item
			className="input-horizontal"
			name="position"
			label="Position title"
			rules={[
				{
					required: true,
					message: "Please input your position title",
				},
			]}
		>
			<Input style={{ maxWidth: "250px" }} placeholder="Please input your position title" className="input-horizontal-spacer"/>
		</Form.Item>
		<Form.Item
			className="input-horizontal"
			name="team"
			label="Department/Team"
			rules={[
				{
					required: false,
					message: "Please input your department/team",
				},
			]}
		>
			<Input style={{ maxWidth: "250px" }} placeholder="Please input your department/team" className="input-horizontal-spacer" />
		</Form.Item>
		{/*
		<Form.Item
			className="input-horizontal"
			name="structured_program"
			label={
				<span>
					Is this a structured internship/co-op program?&nbsp;
					<Tooltip title="Structured programs will usually have other interns, scheduled events/trainings, advisor check-ins, etc.">
						<QuestionCircleOutlined />
					</Tooltip>
				</span>
			}
			rules={[
				{
					required: true,
					message: "Please specify if this is a structured internship/co-op program",
				},
			]}
		>
			<Radio.Group className="input-horizontal-spacer">
				<Radio.Button value="yes">Yes</Radio.Button>
				<Radio.Button value="no">No</Radio.Button>
			</Radio.Group>
		</Form.Item> */}

		<Form.Item
			className=""
			name="is_remote"
			label={
				<span>
					Was this internship remote/virtual or was it in person?
					{/*}<Tooltip title="Structured programs will usually have other interns, scheduled events/trainings, advisor check-ins, etc.">
						<QuestionCircleOutlined />
					</Tooltip>*/}
				</span>
			}
			rules={[
				{
					required: true,
					message: "Please specify if this is a remote internship/co-op program",
				},
			]}
		>
			<Radio.Group className="">
				<Radio.Button value="In-person">In-person</Radio.Button>
				<Radio.Button value="Remote">Remote</Radio.Button>
				<Radio.Button value="Some of both">Some of both</Radio.Button>
			</Radio.Group>
		</Form.Item>

		<Form.Item
			className=""
			name="remote_description"
			label="If remote, how did it affect the experience? Do you think they'll continue remote after Covid?"
			rules={[
				{
					required: false,
					message: "PLease describe how the company did",
				},
			]}
		>
			<Input style={{ maxWidth: "250px" }} placeholder="How was it being virtual?" className=""/>
		</Form.Item>





		<Form.Item
			className="input-horizontal"
			name="terms"
			label="Term(s) employed"
			rules={[
				{
					required: true,
					message: "Please select the terms you were employed",
				},
			]}
		>
			<Select
				mode="multiple"
				placeholder="Please select the terms you were employed"
				style={{ width: "100%", maxWidth: "340px" }}
				tokenSeparators={[","]}
				className="input-horizontal-spacer"
			>
				{terms}
			</Select>
		</Form.Item>
		<Form.Item
			className="input-horizontal"
			name="location"
			label="Location (city/state/region)"
			rules={[
				{
					required: true,
					message: "Please input your internship's location",
				},
			]}
		>
			{/*<Input style={{ maxWidth: "340px" }} placeholder="Please input your internship's location" />*/}
			<AutoComplete
			options={locations}
			placeholder="Please input your internship's location"
			style={{ maxWidth: '340px' }}
			filterOption={(inputValue, option) => option ? option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false}
			className="input-horizontal-spacer"/>
		</Form.Item>
		<Form.Item
			className="input-horizontal"
			name="pay"
			label="Pay"
			extra="Hourly, stipend, etc."
			rules={[
				{
					required: true,
					message: "Please input your pay (hourly, stipend, etc.)",
				},
			]}
		>
			<Input style={{ maxWidth: "250px" }} placeholder="Please input your pay" className="input-horizontal-spacer"/>
		</Form.Item>
		<Form.Item label="Housing stipend" className="input-horizontal">
			<Radio.Group
				defaultValue="none"
				onChange={(e) => setHasHousingStipend(e.target.value === "yes")}
				className="input-horizontal-spacer"
			>
				<Radio.Button value="none">None</Radio.Button>
				<Radio.Button value="yes">Yes</Radio.Button>
			</Radio.Group>
			{hasHousingStipend && (
				<Form.Item name="housing_stipend" noStyle rules={[{ required: true }]}>
					<Input style={{ maxWidth: "250px" }} placeholder="Please input your housing stipend" />
				</Form.Item>
			)}
		</Form.Item>

		<Form.Item
			name="offer"
			label="Did you accept a full-time offer here?"
			rules={[
				{
					required: false,
					message: "Please select an option",
				},
			]}
		>
			<Radio.Group className="input-horizontal-spacer">
				<Radio style={verticalStyle} value={0}>
					Yes
				</Radio>
				<Radio style={verticalStyle} value={1}>
					Offered, but declined
				</Radio>
				<Radio style={verticalStyle} value={2}>
					Not offered
				</Radio>
				<Radio style={verticalStyle} value={3}>
					Not applicable (e.g. it's too early)
				</Radio>
			</Radio.Group>
		</Form.Item>
		<Form.Item
			noStyle
			shouldUpdate={(prevValues, currentValues) => prevValues.offer !== currentValues.offer}
		>
			{({ getFieldValue }) => {
				return getFieldValue("offer") && getFieldValue("offer") > 1 ? (
					<Form.Item
						name="would_accept_offer"
						label="Would you accept a full-time offer here?"
						rules={[{ required: true }]}
					>
						<Radio.Group>
							<Radio style={verticalStyle} value={0}>
								Yes, definitely
							</Radio>
							<Radio style={verticalStyle} value={1}>
								Maybe, I probably would
							</Radio>
							<Radio style={verticalStyle} value={2}>
								No, definitely not
							</Radio>
							<Radio style={verticalStyle} value={3}>
								Maybe, but probably not
							</Radio>
						</Radio.Group>
					</Form.Item>
				) : (
					<div></div>
				);
			}}
		</Form.Item>
	</div>
);

const InternshipExperience = () => (
	<div className="internship-experience">
		{/*
		<Form.Item
			name="expectations"
			label="How did your experience compare to your expectations?"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Radio.Group>
				<Radio style={verticalStyle} value={0}>
					It was what I expected
				</Radio>
				<Radio style={verticalStyle} value={1}>
					It was better
				</Radio>
				<Radio style={verticalStyle} value={2}>
					It was worse
				</Radio>
				<Radio style={verticalStyle} value={3}>
					Not better or worse, just different
				</Radio>
			</Radio.Group>
		</Form.Item>
		*/}


		{/* How was it different text box input */}
		{/*
		<Form.Item
			noStyle
			shouldUpdate={(prevValues, currentValues) =>
				prevValues.expectations !== currentValues.expectations
			}
		>
			{({ getFieldValue }) => {
				return getFieldValue("expectations") && getFieldValue("expectations") > 0 ? (
					<Form.Item
						name="expectations_description"
						label="How was it different?"
						rules={[
							{ required: true, message: "Please describe how your experience was different" },
						]}
					>
						<Input.TextArea rows={2} />
					</Form.Item>
				) : (
					<div></div>
				);
			}}
		</Form.Item> */}



		{/*}<Form.Item
			name="impact"
			label="Impact of your work"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Radio.Group>
				<Radio style={verticalStyle} value={0}>
					No impact (busy-work)
				</Radio>
				<Radio style={verticalStyle} value={1}>
					Not very impactful
				</Radio>
				<Radio style={verticalStyle} value={2}>
					Somewhat impactful
				</Radio>
				<Radio style={verticalStyle} value={3}>
					Impactful
				</Radio>
				<Radio style={verticalStyle} value={4}>
					Very impactful
				</Radio>
			</Radio.Group>
		</Form.Item> */}

		<Form.Item name="impact"	label="Impact of your work"	extra="" rules={[
							{	required: true,
								message: "please slide",
							},]}>

					<Slider marks={marks_impact} defaultValue={0} tooltipVisible={false} step={5} min={0} max={4}	className="submit_slider"/>
		</Form.Item>


		{/*}<Form.Item
			name="prerequisites"
			label="How much knowledge or experience was needed going in?"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Radio.Group>
				<Radio style={verticalStyle} value={0}>
					None - they'll teach you what you need to know
				</Radio>
				<Radio style={verticalStyle} value={1}>
					Beginner - need basic knowledge/experience in this area
				</Radio>
				<Radio style={verticalStyle} value={2}>
					Intermediate - need to be pretty familiar with this area
				</Radio>
				<Radio style={verticalStyle} value={3}>
					Expert - need to have advanced knowledge / multiple prior experiences in this area
				</Radio>
			</Radio.Group>
		</Form.Item> */}


		<Form.Item name="prerequisites"	label="How much knowledge or experience was needed going in?"	extra="" rules={[
							{	required: true,
								message: "Please selet an option",
							},]}>

					<Slider marks={marks_prerequisites} defaultValue={0} tooltipVisible={false} step={4} min={0} max={3}	className="submit_slider submit_slider_prerequisites"/>
		</Form.Item>


		{/*<Form.Item
			name="work_time"
			label="How much of your time were you actively working? (versus waiting for work)"
			rules={[
				{
					required: true,
					message: "Please select an option",
				},
			]}
		>
			<Radio.Group>
				<Radio style={verticalStyle} value={0}>
					0-20% (I might as well have done nothing)
				</Radio>
				<Radio style={verticalStyle} value={1}>
					20-40% (I worked some, but there was a ton of down time)
				</Radio>
				<Radio style={verticalStyle} value={2}>
					40-60% (Some days I stayed busy, but there was a good bit of down time)
				</Radio>
				<Radio style={verticalStyle} value={3}>
					60-80% (I stayed pretty busy)
				</Radio>
				<Radio style={verticalStyle} value={4}>
					80-100% (I was more or less busy the whole time)
				</Radio>
			</Radio.Group>
		</Form.Item> */}

		<Form.Item name="work_time"	label="How much of your time were you actively working? (versus waiting for work)"	extra="" rules={[
							{	required: true,
								message: "Please selet an option",
							},]}>

					<Slider marks={marks_timeworking} defaultValue={0} tooltipVisible={false} step={5} min={0} max={4}	className="submit_slider submit_slider_worktime"/>
		</Form.Item>


		<Form.Item
			className=""
			name="tools_often"
			label="Software/Tools you used most often"
			rules={[
				{
					required: true,
					message: "Please input the tools(s) you used often",
				},
			]}
		>
			<Select
				className=""
				mode="tags"
				placeholder="Please input the tools(s) you used often"
				dropdownStyle={{ display: "none" }}
				style={{ width: "100%", maxWidth: "340px" }}
				tokenSeparators={[","]}
			></Select>
		</Form.Item>
		<Form.Item name="tools_occasionally" label="Software/Tools you used occasionally" className="">
			<Select
				className=""
				mode="tags"
				dropdownStyle={{ display: "none" }}
				placeholder="Please input the tools(s) you used occasionally"
				style={{ width: "100%", maxWidth: "340px" }}
				tokenSeparators={[","]}
			></Select>
		</Form.Item>


		{/* Tools used rarely input */}
		{/*
		<Form.Item name="tools_rarely" label="Software/Tools you used rarely">
			<Select
				mode="tags"
				dropdownStyle={{ display: "none" }}
				placeholder="Please input the tools(s) you used rarely"
				style={{ width: "100%", maxWidth: "340px" }}
				tokenSeparators={[","]}
			></Select>
		</Form.Item> /*}




		{/* <Form.Item
      shouldUpdate={(prevValues, currentValues) => prevValues.work_rating !== currentValues.work_rating}>

      {({ getFieldValue }) => (
        <div>
          <Form.Item
            name="work_rating"
            noStyle
            label="Rate the quality of work (1 = boring and useless, 10 = fascinating and engaging)" rules={[
              {
                required: true,
                message: "Please rate your work experience",
              }
            ]}>
            <Slider
              min={0}
              max={5}
              step={0.5}
              style={{ maxWidth: '300px' }}
              marks={{ 0: '', 1: '', 2: '', 3: '', 4: '', 5: ''}} />
          </Form.Item>
          <Rate count={5} value={getFieldValue('work_rating')} allowHalf/>
        </div>

      )}
    </Form.Item> */}
		<Form.Item
			name="work_rating"
			label="Rate the work you did (1 = boring and useless, 5 = fascinating and engaging)"
			rules={[
				{
					required: true,
					message: "Please rate the work you did",
				},
			]}
		>
			<Rate count={5} allowHalf defaultValue={0} />
		</Form.Item>
		<Form.Item
			name="culture_rating"
			label="Rate the company culture (1 = toxic and discouraging, 5 = warm and inspiring)"
			rules={[
				{
					required: true,
					message: "Please rate your company's culture",
				},
			]}
		>
			<Rate count={5} allowHalf defaultValue={0} />
		</Form.Item>
		<Form.Item
			name="overall_rating"
			label="Rate the overall experience"
			rules={[
				{
					required: true,
					message: "Please rate your overall experience",
				},
			]}
		>
			<Rate count={5} allowHalf defaultValue={0} />
		</Form.Item>
		<Form.Item
			name="project_description"
			label= {<span>Describe your main project(s). Please explain what you <b>actually</b> did - don't overhype it ;)</span>}
			rules={[
				{
					required: true,
					message: "Please describe your internship",
				},
			]}
		>
			<Input.TextArea
				placeholder="Describe your main project - there's room for any other comments later!"
				rows={2}
			></Input.TextArea>
		</Form.Item>
		<Form.Item
			name="recommend"
			label="Would recommend it to people who..."
			rules={[
				{
					required: false,
					message: "Please describe who you would recommend this internship to",
				},
			]}
		>
			<Input />
		</Form.Item>


		{/* Would NOT Recommend input */}

		<Form.Item
			name="not_recommend"
			label={
				<span>
					Would <b>NOT</b> recommend it to people who...
				</span>
			}
			rules={[
				{
					required: false,
					message: "Please describe who you would NOT recommend this internship to",
				},
			]}
		>
			<Input />
		</Form.Item>


		<Form.Item name="optional_remarks" label="Anything else you want to share? Like it? Hate it? What did you learn? Add any additonal thoughts/advice/stories here!">
			<Input.TextArea rows={3}></Input.TextArea>
		</Form.Item>





	</div>
);

const verticalStyle = {
	lineHeight: "30px",
	display: "block",
};

const Submit = ({ onSubmit }) => (
	<div className="submit">
		{/* <Form.Item
      name="platform_use"
      label="How likely would you be to use a platform that lets you read detailed student reviews of internship/co-op experiences?">
      <Radio.Group>
        <Radio fstructutrestyle={verticalStyle} value="4">Definitely</Radio>
        <Radio style={verticalStyle} value="3">Very likely</Radio>
        <Radio style={verticalStyle} value="2">Probably</Radio>
        <Radio style={verticalStyle} value="1">Not likely</Radio>
        <Radio style={verticalStyle} value="0">Not at all</Radio>
      </Radio.Group>
    </Form.Item> */}
		<Form.Item
			name="feedback"
			label="What can we improve on Canary? What questions should we remove or add?"
		>
			<Input.TextArea rows={1}></Input.TextArea>
		</Form.Item>

		<Form.Item
			name="feedback_length"
			label={
				<span>
					How was the length of this form?
					{/*}<Tooltip title="Structured programs will usually have other interns, scheduled events/trainings, advisor check-ins, etc.">
						<QuestionCircleOutlined />
					</Tooltip>*/}
				</span>
			}
			rules={[
				{
					required: false,
					message: "",
				},
			]}
		>
			<Radio.Group>
				<Radio.Button value="Too short">Too short</Radio.Button>
				<Radio.Button value="Just right">Just Right</Radio.Button>
				<Radio.Button value="Too long">Too long</Radio.Button>
			</Radio.Group>
		</Form.Item>



		<Form.Item
			name="permission"
			label="Conditions"
			rules={[{ required: true, message: "Please check to accept" }]}
			valuePropName="checked"
		>
			<Checkbox>
				By clicking the checkbox, I give permission to Canary to share my anonymized information on its website and with third
				parties. I have read and agree to Canary's <a href="https://drive.google.com/file/d/1H04VfyYI4EFOhgfS3Twur3gky6k8K9dM/view?usp=sharing" target="_blank">Reservation of Rights</a> and <a href="https://drive.google.com/file/d/10r35P3iHzBMvLncvOcpgc2GjPqNbWunm/view?usp=sharing" target="_blank">Terms of Service</a>. I understand submitted information becomes the property of Canary. (We take privacy and anonymity
			  seriously - we will NOT share your name or email.)
			</Checkbox>
		</Form.Item>
		<Form.Item>
			<Button type="primary" htmlType="submit">
				Submit
			</Button>
		</Form.Item>
	</div>
);

export interface PayValue {
	type: "hourly" | "lump" | "monthly" | "weekly";
	amount: number;
	currency: "USD" | "EUR";
}

interface YearInputProps {
	value?: YearValue;
	onChange?: (value: YearValue) => void;
}

const YearInput: React.FC<YearInputProps> = ({ value = {}, onChange }) => {
	const [gradLevel, setGradLevel] = useState<"undergraduate" | "graduate" | "graduated">();
	const [year, setYear] = useState<"1st" | "2nd" | "3rd" | "4th" | "5th" | "6th+">();

	const triggerChange = (changedValue) => {
		if (onChange) {
			onChange({ grad_level: gradLevel, year, ...value, ...changedValue });
		}
	};

	const onGradLevelChange = (e) => {
		let newVal = e.target.value;
		if (!("grad_level" in value)) {
			setGradLevel(newVal);
			if (!("year" in value)) {
				setYear("1st");
			}
		}
		triggerChange({ grad_level: newVal, year: value.year || "1st" });
	};

	const onCurrencyChange = (e) => {
		let newVal = e.target.value;
		if (!("year" in value)) {
			setYear(newVal);
			if (!("grad_level" in value)) {
				setGradLevel("undergraduate");
			}
		}
		triggerChange({ year: newVal, grad_level: value.grad_level || "undergraduate" });
	};

	return (
		<span className="year-select">
			<Radio.Group value={value.grad_level} onChange={onGradLevelChange}>
				<Radio.Button value="undergraduate">Undergraduate</Radio.Button>
				<Radio.Button value="graduate">Graduate</Radio.Button>
				<Radio.Button value="graduated">Graduated</Radio.Button>
			</Radio.Group>
			<Radio.Group
				value={value.grad_level === "graduated" ? "" : value.year}
				onChange={onCurrencyChange}
				disabled={value.grad_level === "graduated"}
			>
				<Radio.Button value="1st">1st</Radio.Button>
				<Radio.Button value="2nd">2nd</Radio.Button>
				<Radio.Button value="3rd">3rd</Radio.Button>
				<Radio.Button value="4th">4th</Radio.Button>
				<Radio.Button value="5th">5th</Radio.Button>
				<Radio.Button value="6th+">6th+</Radio.Button>
			</Radio.Group>
		</span>
	);
};

const SubmitReview = (props: RouteComponentProps) => {
	return (
		<div className="SubmitReview centered">
			<DynamicRule />
		</div>
	);
};

export default SubmitReview;
