import React, { useState, useEffect } from "react";
import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import "./Home.css";

import { Button, Checkbox, Input, Pagination, Spin, Result, Form, Select } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { FilterOutlined, CloseOutlined, ArrowDownOutlined } from "@ant-design/icons";

import CompanyCard from "../components/CompanyCard";

import { Review } from "../reviews";
import { database } from "../database";

import classNames from "classnames";
import Fuse from "fuse.js";
import flow from "lodash/flow";

// let test_rev = test_data[1]
// database.collection('review').doc(test_rev.id).set(test_rev)

const keyMap: { [key: string]: string } = {
	Position: "position",
	Company: "company.name",
	Description: "description",
};

const sortFunctions = {
	date: (a, b) => b.timestamp.seconds - a.timestamp.seconds,
	"rating-overall": (a, b) => b.overall_rating - a.overall_rating,
	"rating-work": (a, b) => b.work_rating - a.work_rating,
	"rating-culture": (a, b) => b.culture_rating - a.culture_rating,
};

const filterReviews = (reviews, keys, globalOptions = {}) => {
	let keyList = Object.keys(keys);
	if (keyList.length === 0) return reviews;
	let functions = Object.keys(keys).map((key) => {
		return (list) => {
			let searchKeys = [key];
			if (key === "tools") {
				searchKeys = ["tools.often", "tools.occasionally", "tools.rarely"];
			} else if (key === "company") {
				searchKeys = ["company.name"];
			}
			// else if (key === "school") {
			//   searchKeys = ["school.name"];
			// }

			let fuse = new Fuse(list, { ...globalOptions, keys: searchKeys });
			//@ts-ignore
			return fuse.search(keys[key].replace(/,/g, "|")).map((entry) => entry.item);
		};
	});

	return flow(functions)(reviews);
};

interface HomeProps extends RouteComponentProps {
	children?: any;
}
const Home = (props: HomeProps) => {
	const location = useLocation();
	const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
	const [searchText, setSearchText] = useState<string>("");
	const [showFilter, setShowFilter] = useState<boolean>(false);
	var urlParams = new URLSearchParams(props.location?.search);

	useEffect(() => {
		function getReviews(search) {
			urlParams = new URLSearchParams(search);

			// console.log(Array.from(urlParams.entries()));

			database
				.collection("review")
				.where("is_visible", "==", true)
				.get()
				.then((data) => {
					let reviews_data = data.docs.map((d) => d.data());

					let params = new URLSearchParams(props.location?.search);

					let keys: { search?: string; sort?: string; key?: string } = {};
					//@ts-ignore
					for (let entry of params.entries()) {
						// each 'entry' is a [key, value] tupple
						const [key, value] = entry;
						keys[key] = value;
					}
					let { search, sort, key } = keys;
					delete keys.search;
					delete keys.sort;
					delete keys.key;

					if (search) {
						//@ts-ignore
						const fuse = new Fuse(reviews_data, {
							threshold: 0.5,
							useExtendedSearch: true,
							keys: [
								"tools.often",
								"tools.occasionally",
								"tools.rarely",
								"company.name",
								"position",
								"description",
								"team",
								"school.name",
								"major",
							],
						});
						//@ts-ignore
						reviews_data = fuse.search(search).map((entry) => entry.item);
					}
					reviews_data = filterReviews(reviews_data, keys, {
						threshold: 0.2,
						useExtendedSearch: true,
					});

					if (key && key !== "relevance") {
						reviews_data.sort(sortFunctions[key]);
					} else if (
						!key &&
						(urlParams.keys().next().done || urlParams.keys().next().value === "page")
					) {
						reviews_data.sort(sortFunctions["date"]);
					}
					if (sort === "ascending") {
						reviews_data = reviews_data.reverse();
					}
					setReviews(reviews_data as Review[]);
				})
				.catch((err) => {
					// console.log(err);
				});
		}
		// getReviews(props.location?.search);
		// return globalHistory.listen(({ location }) => {
		//   getReviews(location.search);
		// });
		setSearchText(urlParams.get("text") || "");
		getReviews(location.search);
	}, [location.search]);

	const [page, setPage] = useState<number>(1);
	const [form] = Form.useForm();
	const [reviewsPerPage, setReviewsPerPage] = useState<number>(10);

	const initialValues = {
		key: urlParams.get("key") || "relevance",
		search: urlParams.get("search") || "",
		tools: urlParams.get("tools")?.split(",") || [],
		company: urlParams.get("company")?.split(",") || [],
		position: urlParams.get("position")?.split(",") || [],
		major: urlParams.get("major")?.split(",") || [],
		school: urlParams.get("school")?.split(",") || [],
		// posted_from: urlParams.get('posted_from') ? moment().year(urlParams.get('posted_from')) : null,
		// posted_to: urlParams.get('posted_to') ? moment().year(urlParams.get('posted_to')) : null,
	};

	function onFormChange(changed, all) {
		if ("search" in changed && Object.keys(changed).length === 1) {
			return;
		}
		setPage(1);
		for (const [key, value] of Object.entries(changed)) {
			if (!value || (value as Array<string>).length === 0) {
				urlParams.delete(key);
			} else {
				urlParams.set(key, value as string);
			}
		}
		navigate("/?" + urlParams.toString());
	}

	function handleSearch(value) {
		if (value) urlParams.set("search", value);
		else urlParams.delete("search");
		navigate("/?" + urlParams.toString());
	}

	return (
		<div className="Home">
			<div className="jumbotron">
				<div className="jumbotron__content">
					<h1>
						The internship process, democratized
					</h1>
					<div className="jumbotron__review">
						Empower your peers &ensp;{" "}
						<Button type="primary" onClick={() => navigate("/submit")}>
							✎ Write a Review
						</Button>
					</div>
				</div>
				<p className="jumbotron__subtitle">Internship and co-op reviews by students, for students</p>
			</div>
			<div
				className={classNames("drawer-shade", { visible: showFilter })}
				onClick={() => setShowFilter(false)}
			></div>

			<Form
				layout="vertical"
				form={form}
				onValuesChange={onFormChange}
				initialValues={initialValues}
			>
				<div className="search">
					<Form.Item name="search" noStyle>
						<Input.Search
							placeholder="Search reviews"
							value={searchText}
							allowClear
							onChange={(e) => setSearchText(e.target.value)}
							onSearch={handleSearch}
						/>
					</Form.Item>
					<Button
						type="primary"
						className="filter-toggle"
						style={{
							border: "none",
							marginLeft: "5px",
							height: "100%",
							marginRight: "auto",
							borderRadius: "5px",
						}}
						onClick={() => setShowFilter(true)}
					>
						<FilterOutlined />
					</Button>
				</div>
				<div className="search-content">
					<Filter onClose={() => setShowFilter(false)} visible={showFilter} />
					<div className="reviews-container">
						<div className="reviews-header">
							<Pagination
								// showSizeChanger
								current={page}
								total={reviews?.length}
								hideOnSinglePage
								onChange={(page, pageSize) => setPage(page)}
								// showTotal={total => `Total ${total} items`}
								pageSize={reviewsPerPage}
								onShowSizeChange={(cur, pageSize) => setReviewsPerPage(pageSize)}
							/>
							<div className="sort-input">
								<Form.Item name={"sort"} noStyle>
									<SortInput />
								</Form.Item>
								<Form.Item name={"key"} noStyle>
									<Select style={{ width: 140 }} bordered={false}>
										<Select.Option value="relevance">Relevance</Select.Option>
										<Select.Option value="date">Date</Select.Option>
										<Select.Option value="rating-overall">Overall Rating</Select.Option>
										<Select.Option value="rating-work">Work Rating</Select.Option>
										<Select.Option value="rating-culture">Culture Rating</Select.Option>
									</Select>
								</Form.Item>
							</div>
						</div>
						<div className="reviews">
							{reviews ? (
								reviews.length > 0 ? (
									reviews
										.slice((page - 1) * reviewsPerPage, page * reviewsPerPage)
										.map((review, i) => (
											<CompanyCard
												key={review.id}
												name={review.company.name}
												image={review.company.image}
												description={review.company.description}
												reviews={[review]}
											/>
										))
								) : (
									<Result
										status="warning"
										title="Search returned 0 results"
										style={{ gridColumn: "1 / 3" }}
									/>
								)
							) : (
								<Spin size="large" />
							)}
						</div>
						<Pagination
							// showSizeChanger
							current={page}
							total={reviews?.length}
							hideOnSinglePage
							onChange={(page, pageSize) => setPage(page)}
							// showTotal={total => `Total ${total} items`}
							pageSize={reviewsPerPage}
							onShowSizeChange={(cur, pageSize) => setReviewsPerPage(pageSize)}
						/>
					</div>
				</div>
			</Form>
		</div>
	);
};

export default Home;

const Filter = ({ onClose, visible }) => {
	return (
		<div className={classNames("filter", { visible })}>
			<div className="filter-toggle filter-close" onClick={onClose}>
				<CloseOutlined />
			</div>
			<h2>
				<FilterOutlined /> Filter
			</h2>
			<Form.Item name="company" label="Companies">
				<Select
					notFoundContent=""
					allowClear
					mode="tags"
					placeholder="Companies"
					optionFilterProp="children"
					// filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					showSearch
				></Select>
			</Form.Item>
			<Form.Item name="position" label="Positions">
				<Select notFoundContent="" allowClear mode="tags" placeholder="Positions" />
			</Form.Item>
			<Form.Item name="tools" label="Tools">
        <Select notFoundContent="" allowClear mode="tags" placeholder="Tools"></Select>
      </Form.Item>
			{/*<div className="date-range">
        <Form.Item name="posted_from" label="Posted">
          <DatePicker picker="year" placeholder="from" />
        </Form.Item>
        <Form.Item name="posted_to" label={<div></div>}>
          <DatePicker picker="year" placeholder="to" />
        </Form.Item>
      </div>*/}
			<h3>Intern profile</h3>
			<Form.Item name="major" label="Majors">
				<Select
					notFoundContent=""
					allowClear
					mode="tags"
					placeholder="Majors"
					optionFilterProp="children"
					// filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					showSearch
				></Select>
			</Form.Item>
			<Form.Item name="school" label="Schools">
				<Select
					notFoundContent=""
					allowClear
					mode="tags"
					placeholder="Schools"
					optionFilterProp="children"
					// filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					showSearch
				></Select>
			</Form.Item>
		</div>
	);
};

interface SortInput {
	value?: "ascending" | "descending";
	onChange?: (value: "ascending" | "descending") => void;
}

const SortInput: React.FC<SortInput> = ({ value = "descending", onChange }) => {
	const triggerChange = (changedValue) => {
		if (onChange) {
			onChange(changedValue);
		}
	};

	const onClick = () => {
		let newVal = value === "ascending" ? "descending" : "ascending";
		triggerChange(newVal);
	};

	return (
		<div className="sort">
			<Button
				className={"sort-direction " + value}
				shape="circle"
				style={{
					border: "none",
					background: "none",
					padding: "0",
					boxShadow: "none",
				}}
				onClick={onClick}
			>
				<ArrowDownOutlined />
			</Button>
		</div>
	);
};
