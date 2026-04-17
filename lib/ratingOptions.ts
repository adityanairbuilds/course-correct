export type RatingCategory = "overall" | "homeworkLoad" | "hoursPerWeek";

export interface RatingOption {
  label: string;
  value: number; // 1-5
}

export const OVERALL_OPTIONS: RatingOption[] = [
  { label: "Very Easy", value: 1 },
  { label: "Easy", value: 2 },
  { label: "Moderate", value: 3 },
  { label: "Hard", value: 4 },
  { label: "Extremely Hard", value: 5 },
];

export const HOMEWORK_OPTIONS: RatingOption[] = [
  { label: "None", value: 1 },
  { label: "Light", value: 2 },
  { label: "Moderate", value: 3 },
  { label: "Heavy", value: 4 },
  { label: "Very Heavy", value: 5 },
];

export const HOURS_OPTIONS: RatingOption[] = [
  { label: "<1 hr", value: 1 },
  { label: "1–2 hrs", value: 2 },
  { label: "3–5 hrs", value: 3 },
  { label: "5–7 hrs", value: 4 },
  { label: "7+ hrs", value: 5 },
];

export interface Tag {
  value: string;
  label: string;
  description: string;
}

export const TAGS: Tag[] = [
  { value: "hands-on", label: "Hands-On", description: "Course involves lab work, studio sessions, or other hands-on activities." },
  { value: "project-based", label: "Project-Based", description: "Grade is primarily based on projects rather than tests." },
  { value: "writing-intensive", label: "Writing-Intensive", description: "Requires frequent or lengthy written assignments and essays." },
  { value: "frequent-tests", label: "Frequent Tests", description: "Regular quizzes and tests throughout the semester." },
  { value: "group-work", label: "Group Work", description: "Involves significant collaborative group assignments." },
  { value: "memorization-heavy", label: "Memorization-Heavy", description: "Requires memorizing large amounts of content." },
  { value: "curved", label: "Curved", description: "Grades are curved, making it easier to achieve a higher grade." },
  { value: "extra-credit", label: "Extra Credit", description: "Extra credit opportunities are available to boost your grade." },
  { value: "dual-enrollment", label: "Dual Enrollment", description: "This course counts for college credit." },
];

export const CATEGORY_META: Record<
  RatingCategory,
  { label: string; options: RatingOption[] }
> = {
  overall: { label: "Overall Difficulty", options: OVERALL_OPTIONS },
  homeworkLoad: { label: "Homework Load", options: HOMEWORK_OPTIONS },
  hoursPerWeek: { label: "Hours per Week", options: HOURS_OPTIONS },
};
