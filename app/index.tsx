import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getSavedSchoolId } from "../lib/user";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function SplashRedirect() {
  const router = useRouter();

  useEffect(() => {
    getSavedSchoolId().then((schoolId) => {
      if (schoolId) {
        router.replace("/courses");
      } else {
        router.replace("/onboarding");
      }
    });
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
