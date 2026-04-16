import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../lib/firebase";
import { getSavedSchoolId, saveSchoolId } from "../lib/user";

interface Course {
  id: string;
  name: string;
  department: string;
}

interface Section {
  title: string;
  data: Course[];
}

export default function Courses() {
  const router = useRouter();
  const navigation = useNavigation();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        data: s.data.filter((c) => c.name.toLowerCase().includes(q)),
      }))
      .filter((s) => s.data.length > 0);
  }, [searchQuery, sections]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    const schoolId = await getSavedSchoolId();
    if (!schoolId) {
      router.replace("/onboarding");
      return;
    }

    const [coursesSnap, schoolsSnap] = await Promise.all([
      getDocs(
        query(
          collection(db, "courses"),
          where("schoolId", "==", schoolId),
          orderBy("department"),
          orderBy("name")
        )
      ),
      getDocs(collection(db, "schools")),
    ]);

    const school = schoolsSnap.docs.find((d) => d.id === schoolId);
    if (school) setSchoolName(school.data().name);

    const courses: Course[] = coursesSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Course, "id">),
    }));

    const grouped: Record<string, Course[]> = {};
    for (const c of courses) {
      if (!grouped[c.department]) grouped[c.department] = [];
      grouped[c.department].push(c);
    }

    const secs: Section[] = Object.keys(grouped)
      .sort()
      .map((dept) => ({ title: dept, data: grouped[dept] }));

    setSections(secs);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    navigation.setOptions({
      title: schoolName || "Courses",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/about")}
          style={{ marginRight: 4, padding: 6 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>ⓘ</Text>
        </TouchableOpacity>
      ),
    });
  }, [schoolName, navigation, router]);

  function openDialog(course: Course) {
    setSelectedCourse(course);
  }

  function closeDialog() {
    setSelectedCourse(null);
  }

  function goRate() {
    if (!selectedCourse) return;
    closeDialog();
    router.push(`/rate/${selectedCourse.id}`);
  }

  function goView() {
    if (!selectedCourse) return;
    closeDialog();
    router.push(`/view/${selectedCourse.id}`);
  }

  async function changeSchool() {
    await saveSchoolId("");
    router.replace("/onboarding");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select a course to rate or view ratings</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a56db" style={{ marginTop: 60 }} />
      ) : (
        <SectionList
          sections={filteredSections}
          ListEmptyComponent={
            <Text style={styles.emptySearch}>No courses match "{searchQuery}"</Text>
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
          renderItem={({ item, index, section }) => {
            const isFirst = index === 0;
            const isLast = index === section.data.length - 1;
            return (
              <TouchableOpacity
                style={[
                  styles.courseRow,
                  isFirst && styles.courseRowFirst,
                  isLast && styles.courseRowLast,
                ]}
                onPress={() => openDialog(item)}
              >
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            <TouchableOpacity style={styles.changeSchool} onPress={changeSchool}>
              <Text style={styles.changeSchoolText}>Change School</Text>
            </TouchableOpacity>
          }
        />
      )}

      {/* Course Action Dialog */}
      <Modal
        visible={selectedCourse !== null}
        transparent
        animationType="fade"
        onRequestClose={closeDialog}
      >
        <Pressable style={styles.overlay} onPress={closeDialog}>
          <Pressable style={styles.dialog}>
            <Text style={styles.dialogCourseName} numberOfLines={2}>
              {selectedCourse?.name}
            </Text>
            <Text style={styles.dialogDept}>{selectedCourse?.department}</Text>

            <View style={styles.dialogActions}>
              <TouchableOpacity style={[styles.dialogBtn, styles.rateBtn]} onPress={goRate}>
                <Text style={styles.rateBtnText}>Rate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dialogBtn, styles.viewBtn]} onPress={goView}>
                <Text style={styles.viewBtnText}>View Ratings</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={closeDialog}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f3f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    padding: 0,
  },
  emptySearch: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 14,
    color: "#888",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#1a56db",
    marginRight: 10,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sectionCount: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  sectionFooter: {
    height: 12,
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  courseRowFirst: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  courseRowLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  courseName: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 20,
    color: "#bbb",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 16,
  },
  changeSchool: {
    margin: 24,
    alignItems: "center",
  },
  changeSchoolText: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "underline",
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  dialog: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dialogCourseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  dialogDept: {
    fontSize: 13,
    color: "#888",
    marginBottom: 24,
  },
  dialogActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  rateBtn: {
    backgroundColor: "#1a56db",
  },
  rateBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  viewBtn: {
    backgroundColor: "#f0f4ff",
    borderWidth: 1.5,
    borderColor: "#1a56db",
  },
  viewBtnText: {
    color: "#1a56db",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: "#999",
    fontSize: 14,
  },
});
