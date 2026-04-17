import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
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
  TAGS,
} from "../../lib/ratingOptions";

const CATEGORIES: RatingCategory[] = ["overall", "homeworkLoad", "hoursPerWeek"];

export default function RatePage() {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showTagInfo, setShowTagInfo] = useState(false);
  const [selections, setSelections] = useState<Record<RatingCategory, number | null>>({
    overall: null,
    homeworkLoad: null,
    hoursPerWeek: null,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  async function load() {
    setLoading(true);
    setError(false);
    try {
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
        setSelectedTags(existing.tags ?? []);
      }
    } catch (e) {
      console.error("Rate page load error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [courseId]);

  function pick(category: RatingCategory, value: number) {
    setSelections((prev) => ({ ...prev, [category]: value }));
  }

  function toggleTag(value: string) {
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
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
        tags: selectedTags,
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Could not load course.</Text>
        <Text style={styles.errorSub}>Check your connection and try again.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
                    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      {/* Tags Section */}
      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Tags <Text style={styles.optional}>(Optional)</Text></Text>
          <TouchableOpacity onPress={() => setShowTagInfo(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.tagSubtext}>Select all that apply to this course.</Text>
        <View style={styles.pillRow}>
          {TAGS.map((tag) => {
            const selected = selectedTags.includes(tag.value);
            return (
              <TouchableOpacity
                key={tag.value}
                style={[styles.pill, selected && styles.pillSelected]}
                onPress={() => toggleTag(tag.value)}
              >
                <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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

      {/* Tag Info Modal */}
      <Modal visible={showTagInfo} transparent animationType="fade" onRequestClose={() => setShowTagInfo(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowTagInfo(false)}>
          <Pressable style={styles.infoDialog}>
            <Text style={styles.infoTitle}>About Tags</Text>
            <Text style={styles.infoIntro}>
              Tags describe the nature of a course. Select any that match your experience — they help other students know what to expect.
            </Text>
            <View style={styles.infoDivider} />
            <ScrollView style={styles.infoScroll} showsVerticalScrollIndicator={false}>
              {TAGS.map((tag) => (
                <View key={tag.value} style={styles.infoRow}>
                  <Text style={styles.infoTagLabel}>{tag.label}</Text>
                  <Text style={styles.infoTagDesc}>{tag.description}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.infoCloseBtn} onPress={() => setShowTagInfo(false)}>
              <Text style={styles.infoCloseBtnText}>Got it</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  optional: {
    fontSize: 12,
    fontWeight: "500",
    color: "#999",
    textTransform: "none",
  },
  infoIcon: {
    fontSize: 18,
    color: "#1a56db",
  },
  tagSubtext: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
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
  // Error
  errorText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#1a56db",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  // Tag Info Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  infoDialog: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    maxHeight: "85%",
    flexShrink: 1,
  },
  infoScroll: {
    flexGrow: 0,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  infoIntro: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoTagLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  infoTagDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  infoCloseBtn: {
    backgroundColor: "#1a56db",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  infoCloseBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
