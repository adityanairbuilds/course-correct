import { Redirect } from "expo-router";

// TESTING: always show welcome screen
export default function SplashRedirect() {
  return <Redirect href="/welcome" />;
}

// Production routing (restore when done testing):
// import { useEffect } from "react";
// import { useRouter } from "expo-router";
// import { getSavedSchoolId, hasSeenWelcome } from "../lib/user";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
//
// export default function SplashRedirect() {
//   const router = useRouter();
//   useEffect(() => {
//     async function redirect() {
//       const seen = await hasSeenWelcome();
//       if (!seen) { router.replace("/welcome"); return; }
//       const schoolId = await getSavedSchoolId();
//       router.replace(schoolId ? "/courses" : "/onboarding");
//     }
//     redirect();
//   }, []);
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#1a56db" />
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
// });
