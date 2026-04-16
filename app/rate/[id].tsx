import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getUserId } from "../../lib/user";
import { getUserRating, submitRating } from "../../lib/ratings";
import {
  CATEGORY_META,
  RatingCategory,
  RatingOption,
} from "../../lib/ratingOptions";

const CATEGORIES: RatingCategory[] = ["overall", "homeworkLoad", "hoursPerWeek"];

export default function RatePage() {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selections, setSelections] = useState<Record<RatingCategory, number | null>>({
    overall: null,
    homeworkLoad: null,
    hoursPerWeek: null,
  });

  useEffect(() => {
    async function load() {
      const [userId, courseSnap] = await Promise.all([
        getUserId(),
        getDoc(doc(db, "courses", courseId)),
      ]);

      if (courseSnap.exists()) {
        setCourseName(courseSnap.data().name);
      }

      const existing = await getUserRating(userId, courseId);
      if (existing) {
        setSelections({
          overall: existing.overall,
          homeworkLoad: existing.homeworkLoad,
          hoursPerWeek: existing.hoursPerWeek,
        });
      }

      setLoading(false);
    }
    load();
  }, [courseId]);

  function pick(category: RatingCategory, value: number) {
    setSelections((prev) => ({ ...prev, [category]: value }));
  }

  async function handleSubmit() {
    if (
      selections.overall === null ||
      selections.homeworkLoad === null ||
      selections.hoursPerWeek === null
    ) {
      Alert.alert("Incomplete", "Please select an option for all categories.");
      return;
    }

    setSubmitting(true);
    try {
      const userId = await getUserId();
      await submitRating(userId, courseId, {
        overall: selections.overall!,
        homeworkLoad: selections.homeworkLoad!,
        hoursPerWeek: selections.hoursPerWeek!,
      });
      Alert.alert("Submitted!", "Your rating has been saved.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not save your rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a56db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.courseName}>{courseName}</Text>

      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        return (
          <View key={cat} style={styles.section}>
            <Text style={styles.sectionLabel}>{meta.label}</Text>
            <View style={styles.pillRow}>
              {meta.options.map((opt: RatingOption) => {
                const selected = selections[cat] === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.pill, selected && styles.pillSelected]}
                    onPress={() => pick(cat, opt.value)}
                  >
                    <Text
                      style={[styles.pillText, selected && styles.pillTextSelected]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Submit Rating</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#d0d5dd",
    backgroundColor: "#fff",
  },
  pillSelected: {
    backgroundColor: "#1a56db",
    borderColor: "#1a56db",
  },
  pillText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  pillTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  submitBtn: {
    backgroundColor: "#1a56db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
