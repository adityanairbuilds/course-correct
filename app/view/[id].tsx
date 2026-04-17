import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCourseDistributions, CourseDistributions, CategoryCounts } from "../../lib/ratings";
import { CATEGORY_META, RatingCategory, RatingOption } from "../../lib/ratingOptions";

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

  useEffect(() => {
    async function load() {
      const [courseSnap, dist] = await Promise.all([
        getDoc(doc(db, "courses", courseId)),
        getCourseDistributions(courseId),
      ]);
      if (courseSnap.exists()) {
        setCourseName(courseSnap.data().name);
      }
      setDistributions(dist);
      setLoading(false);
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a56db" />
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
        </>
      )}
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
});
