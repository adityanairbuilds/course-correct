import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const USER_ID_KEY = "@rmc_user_id";
const SCHOOL_ID_KEY = "@rmc_school_id";
const HAS_SEEN_WELCOME_KEY = "@rmc_has_seen_welcome";

export async function getUserId(): Promise<string> {
  let id = await AsyncStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = Crypto.randomUUID();
    await AsyncStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export async function getSavedSchoolId(): Promise<string | null> {
  return AsyncStorage.getItem(SCHOOL_ID_KEY);
}

export async function saveSchoolId(schoolId: string): Promise<void> {
  await AsyncStorage.setItem(SCHOOL_ID_KEY, schoolId);
}

export async function hasSeenWelcome(): Promise<boolean> {
  const val = await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
  return val === "true";
}

export async function markWelcomeSeen(): Promise<void> {
  await AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, "true");
}
