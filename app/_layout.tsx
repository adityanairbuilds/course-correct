import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a56db" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="courses" options={{ title: "Courses" }} />
      <Stack.Screen name="rate/[id]" options={{ title: "Rate Course" }} />
      <Stack.Screen name="view/[id]" options={{ title: "Course Ratings" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
    </Stack>
  );
}
