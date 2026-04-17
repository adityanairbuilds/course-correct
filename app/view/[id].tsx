import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCourseDistributions, CourseDistributions, CategoryCounts } from "../../lib/ratings";
import { CATEGORY_META, RatingCategory, RatingOption, TAGS } from "../../lib/ratingOptions";

const CATEGORIES: RatingCategory[] = ["overall", "homeworkLoad", "hoursPerWeek"];

const VALUE_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#f59e0b",
  4: "#f97316",
  5: "#ef4444",
};

function DistributionCard({
  title,
  options,
  counts,
  total,
}: {
  title: string;
  options: RatingOption[];
  counts: CategoryCounts;
  total: number;
}) {
  const maxCount = Math.max(...options.map((o) => counts[o.value] ?? 0), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardDivider} />
      {options.map((opt) => {
        const count = counts[opt.value] ?? 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        const barPct = (count / maxCount) * 100;

        return (
          <View key={opt.value} style={styles.row}>
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${barPct}%`, backgroundColor: VALUE_COLORS[opt.value] }]} />
            </View>
            <Text style={styles.pctLabel}>
              {count > 0 ? `${Math.round(pct)}%` : "—"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ViewPage() {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  const [courseName, setCourseName] = useState("");
  const [distributions, setDistributions] = useState<CourseDistributions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTagInfo, setShowTagInfo] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [courseSnap, dist] = await Promise.all([
        getDoc(doc(db, "courses", courseId)),
        getCourseDistributions(courseId),
      ]);
      if (courseSnap.exists()) {
        setCourseName(courseSnap.data().name);
      }
      setDistributions(dist);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [courseId]);

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
        <Text style={styles.errorText}>Could not load ratings.</Text>
        <Text style={styles.errorSub}>Check your connection and try again.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasRatings = distributions && distributions.total > 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.courseName}>{courseName}</Text>

      {!hasRatings ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No ratings yet.</Text>
          <Text style={styles.emptySubtext}>Be the first to rate this course!</Text>
        </View>
      ) : (
        <>
          <Text style={styles.countLabel}>
            Based on {distributions!.total}{" "}
            {distributions!.total === 1 ? "rating" : "ratings"}
          </Text>

          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <DistributionCard
                key={cat}
                title={meta.label}
                options={meta.options}
                counts={distributions![cat]}
                total={distributions!.total}
              />
            );
          })}

          {/* Tags */}
          {(() => {
            const activeTags = TAGS.filter((t) => (distributions!.tags[t.value] ?? 0) > 0);
            if (activeTags.length === 0) return null;
            return (
              <View style={styles.card}>
                <View style={styles.tagHeaderRow}>
                  <Text style={styles.cardTitle}>Tags</Text>
                  <TouchableOpacity onPress={() => setShowTagInfo(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.infoIcon}>ⓘ</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cardDivider} />
                <View style={styles.tagPillRow}>
                  {activeTags.map((tag) => (
                    <View key={tag.value} style={styles.tagPill}>
                      <Text style={styles.tagPillLabel}>{tag.label}</Text>
                      <View style={styles.tagPillBadge}>
                        <Text style={styles.tagPillCount}>{distributions!.tags[tag.value]}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })()}
        </>
      )}

      {/* Tag Info Modal */}
      <Modal visible={showTagInfo} transparent animationType="fade" onRequestClose={() => setShowTagInfo(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowTagInfo(false)}>
          <Pressable style={styles.infoDialog}>
            <Text style={styles.infoTitle}>About Tags</Text>
            <Text style={styles.infoIntro}>
              Tags describe the nature of a course, selected by students who have taken it.
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
    marginBottom: 8,
  },
  countLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionLabel: {
    width: 100,
    fontSize: 13,
    color: "#444",
    fontWeight: "500",
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#eef0f5",
    borderRadius: 100,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#1a56db",
    borderRadius: 100,
  },
  pctLabel: {
    width: 32,
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    textAlign: "right",
  },
  emptyBox: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
  },
  tagHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoIcon: {
    fontSize: 18,
    color: "#1a56db",
  },
  tagPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    borderRadius: 100,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    gap: 6,
  },
  tagPillLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a56db",
  },
  tagPillBadge: {
    backgroundColor: "#1a56db",
    borderRadius: 100,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  tagPillCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
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
});
