import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../store/themeStore";
import { useTaskStore } from "../../store/taskStore";
import { FilterType, Task } from "../../types/task";
import TaskCard from "../../components/TaskCard";
import StatCard from "../../components/StatCard";
import FilterTabs from "../../components/FilterTabs";
import EmptyState from "../../components/EmptyState";
import { Spacing, FontSize, Radius, Shadows } from "../../constants/theme";
import { formatFullDate } from "../../utils/date";

export default function HomeScreen() {
  const { colors, mode, toggleTheme } = useAppTheme();
  const tasks = useTaskStore((s) => s.tasks);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [filter, setFilter] = useState<FilterType>("All");

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.isDone).length;
    const pending = total - done;
    return { total, done, pending };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "Active":
        return tasks.filter((t) => !t.isDone);
      case "Completed":
        return tasks.filter((t) => t.isDone);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Hapus Task",
      "Apakah kamu yakin ingin menghapus task ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => deleteTask(id),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Premium dengan Gradient */}
      <LinearGradient
        colors={colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>TaskFlow</Text>
              <Text style={styles.headerDate}>{formatFullDate()}</Text>
            </View>
            <Pressable
              onPress={toggleTheme}
              style={[styles.themeToggle, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            >
              <Feather
                name={mode === "dark" ? "sun" : "moon"}
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Statistik */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} icon="list" />
          <StatCard label="Active" value={stats.pending} icon="clock" />
          <StatCard label="Done" value={stats.done} icon="check-circle" />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterWrapper}>
          <FilterTabs active={filter} onChange={setFilter} />
        </View>

        {/* Task List */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: Task }) => (
            <TaskCard task={item} onToggleDone={toggleDone} onDelete={handleDelete} />
          )}
          ListEmptyComponent={
            <EmptyState
              title={filter === "All" ? "Belum ada task saat ini" : `Tidak ada task ${filter.toLowerCase()}`}
            />
          }
        />
      </View>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/add-task" as any)}
        style={[styles.fab, Shadows.medium]}
      >
        <LinearGradient
          colors={colors.gradientSecondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={28} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingBottom: Spacing.xl,
  },
  headerSafeArea: {
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerDate: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontWeight: "500",
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.sm, // Mengurangi efek overlap agar card lebih ke bawah
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterWrapper: {
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: 120, // Extra padding for Bottom Tabs + FAB
  },
  fab: {
    position: "absolute",
    bottom: 90, // Above bottom tabs
    right: Spacing.lg,
    borderRadius: Radius.full,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
