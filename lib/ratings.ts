import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface RatingData {
  overall: number;
  homeworkLoad: number;
  hoursPerWeek: number;
}

export interface CourseAverages {
  overall: number;
  homeworkLoad: number;
  hoursPerWeek: number;
  count: number;
}

// count of raters per value (1–5) for each category
export type CategoryCounts = Record<number, number>;

export interface CourseDistributions {
  overall: CategoryCounts;
  homeworkLoad: CategoryCounts;
  hoursPerWeek: CategoryCounts;
  total: number;
}

function ratingDocId(userId: string, courseId: string): string {
  return `${userId}_${courseId}`;
}

export async function getUserRating(
  userId: string,
  courseId: string
): Promise<RatingData | null> {
  const ref = doc(db, "ratings", ratingDocId(userId, courseId));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    overall: d.overall,
    homeworkLoad: d.homeworkLoad,
    hoursPerWeek: d.hoursPerWeek,
  };
}

export async function submitRating(
  userId: string,
  courseId: string,
  data: RatingData
): Promise<void> {
  const ref = doc(db, "ratings", ratingDocId(userId, courseId));
  await setDoc(ref, {
    userId,
    courseId,
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getCourseDistributions(
  courseId: string
): Promise<CourseDistributions> {
  const empty = (): CategoryCounts => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const result: CourseDistributions = {
    overall: empty(),
    homeworkLoad: empty(),
    hoursPerWeek: empty(),
    total: 0,
  };

  const q = query(collection(db, "ratings"), where("courseId", "==", courseId));
  const snap = await getDocs(q);

  snap.forEach((d) => {
    const data = d.data();
    result.overall[data.overall] = (result.overall[data.overall] ?? 0) + 1;
    result.homeworkLoad[data.homeworkLoad] = (result.homeworkLoad[data.homeworkLoad] ?? 0) + 1;
    result.hoursPerWeek[data.hoursPerWeek] = (result.hoursPerWeek[data.hoursPerWeek] ?? 0) + 1;
    result.total += 1;
  });

  return result;
}

export async function getCourseAverages(
  courseId: string
): Promise<CourseAverages> {
  const q = query(
    collection(db, "ratings"),
    where("courseId", "==", courseId)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    return { overall: 0, homeworkLoad: 0, hoursPerWeek: 0, count: 0 };
  }

  let overall = 0;
  let homeworkLoad = 0;
  let hoursPerWeek = 0;

  snap.forEach((d) => {
    const data = d.data();
    overall += data.overall ?? 0;
    homeworkLoad += data.homeworkLoad ?? 0;
    hoursPerWeek += data.hoursPerWeek ?? 0;
  });

  const count = snap.size;
  return {
    overall: overall / count,
    homeworkLoad: homeworkLoad / count,
    hoursPerWeek: hoursPerWeek / count,
    count,
  };
}
