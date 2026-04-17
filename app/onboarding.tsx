import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { saveSchoolId } from "../lib/user";

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
}

export default function Onboarding() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function fetchSchools() {
    setLoading(true);
    setError(false);
    try {
      const q = query(collection(db, "schools"), orderBy("name"));
      const snap = await getDocs(q);
      const data: School[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<School, "id">),
      }));
      setSchools(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSchools(); }, []);

  async function selectSchool(school: School) {
    setSelecting(school.id);
    await saveSchoolId(school.id);
    router.replace("/courses");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Correct</Text>
        <Text style={styles.subtitle}>Pick your high school to get started</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a56db" style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Could not load schools.</Text>
          <Text style={styles.errorSub}>Check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchSchools}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.schoolRow}
              onPress={() => selectSchool(item)}
              disabled={selecting !== null}
            >
              <View style={styles.schoolInfo}>
                <Text style={styles.schoolName}>{item.name}</Text>
                <Text style={styles.schoolLocation}>
                  {item.city}, {item.state}
                </Text>
              </View>
              {selecting === item.id && (
                <ActivityIndicator size="small" color="#1a56db" />
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: "#1a56db",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#c7d8fc",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  schoolRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  schoolLocation: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
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
