import { useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { getSavedSchoolId, hasSeenWelcome } from "../lib/user";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function SplashRedirect() {
  const router = useRouter();

  // In development (Expo Go), always show the welcome screen for easy testing
  if (__DEV__) {
    return <Redirect href="/welcome" />;
  }

  useEffect(() => {
    async function redirect() {
      const seen = await hasSeenWelcome();
      if (!seen) {
        router.replace("/welcome");
        return;
      }
      const schoolId = await getSavedSchoolId();
      router.replace(schoolId ? "/courses" : "/onboarding");
    }
    redirect();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1a56db" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
