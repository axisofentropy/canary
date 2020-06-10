export interface Review {
	id: string;
	timestamp: { seconds: number };
	company: Company;
	position: string;
	team: string;
	internship_type: "internship" | "co-op";
	structured_program: boolean;
	location: string;
	terms: string[];
	pay: string;
	overall_rating: number;
	culture_rating: number;
	work_rating: number;
	year: YearValue;
	school: string;
	major: string;
	other_studies: string;
	housing_stipend: string;
	recommend: string;
	not_recommend: string;
	tools: {
		often: string[];
		occasionally: string[];
		rarely: string[];
	};
	description: string;
	offer: number;
	would_accept_offer: number;
	impact: number;
	prerequisites: number;
	expectations: number;
	expectations_description: string;
	work_time: number;
	interview_advice: string;
	optional_remarks: string;
	is_visible: boolean;
}

export interface Company {
	id: string;
	name: string;
	description: string;
	image: string;
}

export interface YearValue {
	grad_level?: "undergraduate" | "graduate" | "graduated";
	year?: "1st" | "2nd" | "3rd" | "4th" | "5th" | "6th+" | undefined;
}

// pay: ({
//   type: 'hourly',
//   amount: 20,
//   currency: 'USD'
// }) as PayValue,
