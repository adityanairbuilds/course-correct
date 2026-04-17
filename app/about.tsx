import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.accent} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Para({ children }: { children: string }) {
  return <Text style={styles.para}>{children}</Text>;
}

export default function About() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

      <Section title="About the App">
        <Para>
          Course Correct is a student-built tool that lets high schoolers share anonymous,
          aggregate feedback on courses — helping peers make more informed decisions about
          their class schedules.
        </Para>
        <Para>
          Ratings are entirely anonymous. The app does not collect any personally identifiable
          information. No names, emails, or accounts are required or stored.
        </Para>
        <Para>
          Course Correct is not a teacher rating app. Feedback is focused solely on the course
          itself — its workload, difficulty, and overall experience — not on any individual
          instructor.
        </Para>
        <Para>
          The goal is simple: give students access to honest, peer-sourced information so they
          can choose courses that are the right fit for them.
        </Para>
      </Section>

      <Section title="Privacy Policy">
        <Para>
          This app does not collect any personally identifiable information. Read our full
          privacy policy for details.
        </Para>
        <TouchableOpacity onPress={() => Linking.openURL("https://adityanairbuilds.github.io/course-correct/privacy.html")}>
          <Text style={styles.devLink}>View Privacy Policy</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Terms and Disclaimer">
        <Para>
          All ratings are submitted voluntarily and anonymously by students. Course Correct does
          not verify, moderate, or endorse any individual rating.
        </Para>
        <Para>
          Ratings reflect the personal experiences of individual students and may not represent
          the experience of all students in a course. Results should be used as one of many
          inputs when making scheduling decisions.
        </Para>
        <Para>
          Course Correct is an independent student project and is not affiliated with, endorsed
          by, or connected to any school, school district, or educational institution.
        </Para>
        <Para>
          This app is provided for informational purposes only. The developer makes no guarantees
          about the accuracy, completeness, or reliability of any ratings or content within the app.
        </Para>
        <Para>
          By using this app, you agree not to submit false, misleading, or harmful content. Misuse
          of the app may result in removal of submitted ratings.
        </Para>
      </Section>

      <Section title="About the Developer">
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>Name</Text>
          <Text style={styles.devValue}>Aditya Nair</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>Class</Text>
          <Text style={styles.devValue}>Class of 2028</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>School</Text>
          <Text style={styles.devValue}>Del Norte High School{"\n"}San Diego, CA</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>Contact</Text>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:support.coursecorrect@gmail.com")}>
            <Text style={styles.devLink}>support.coursecorrect@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </Section>

      <Text style={styles.version}>Course Correct · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  accent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#1a56db",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  para: {
    fontSize: 14,
    color: "#444",
    lineHeight: 21,
    marginBottom: 12,
  },
  devRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  devLabel: {
    width: 70,
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  devValue: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
    lineHeight: 20,
  },
  devLink: {
    fontSize: 14,
    color: "#1a56db",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#bbb",
    marginTop: 8,
  },
});
