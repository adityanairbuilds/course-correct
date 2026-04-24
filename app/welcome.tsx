import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { markWelcomeSeen } from "../lib/user";

const FEATURES = [
  {
    emoji: "📚",
    title: "Workload & Difficulty",
    desc: "Understand how much time and effort a course actually takes.",
  },
  {
    emoji: "📊",
    title: "GPA Impact",
    desc: "See how students rate the grading and overall difficulty.",
  },
  {
    emoji: "🔒",
    title: "Completely Anonymous",
    desc: "No accounts, no names. Just honest feedback from real students.",
  },
];


export default function Welcome() {
  const router = useRouter();

  async function handleGetStarted() {
    await markWelcomeSeen();
    router.replace("/onboarding");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.appName}>Course Correct</Text>
          <Text style={styles.headline}>
            Pick your courses for next year with confidence.
          </Text>
          <Text style={styles.subheadline}>
            Real ratings from students at your school who've already taken them —
            so you know what to expect.
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleGetStarted}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 36,
  },
  top: {
    marginBottom: 8,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginBottom: 20,
  },
  appName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a56db",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  headline: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    lineHeight: 36,
    marginBottom: 14,
  },
  subheadline: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  features: {
    gap: 24,
    marginTop: 32,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  featureEmoji: {
    fontSize: 26,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  btn: {
    backgroundColor: "#1a56db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
