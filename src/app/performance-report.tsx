import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTaskStore } from "../store/taskStore";
import { Spacing, Radius } from "../constants/theme";

const { width } = Dimensions.get("window");

const COLORS = {
  bg: "#0f172a", // Dark slate background
  card: "#1e293b", // Column background
  taskBg: "#0f172a", // Task card inside column
  border: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#fbbf24",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
};

export default function PerformanceReportScreen() {
  const tasks = useTaskStore((s) => s.tasks);

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isDone).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Breakdown by Priority
  const highPriority = tasks.filter((t) => t.priority === "Tinggi" || t.priority === "High");
  const mediumPriority = tasks.filter((t) => t.priority === "Sedang" || t.priority === "Medium");
  const lowPriority = tasks.filter((t) => t.priority === "Rendah" || t.priority === "Low");

  const highDone = highPriority.filter((t) => t.isDone).length;
  const mediumDone = mediumPriority.filter((t) => t.isDone).length;
  const lowDone = lowPriority.filter((t) => t.isDone).length;

  // Category counts
  const categoriesMap: Record<string, { total: number; done: number }> = {};
  tasks.forEach((t) => {
    const cat = t.category || "Umum";
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = { total: 0, done: 0 };
    }
    categoriesMap[cat].total += 1;
    if (t.isDone) categoriesMap[cat].done += 1;
  });

  const categories = Object.keys(categoriesMap);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: COLORS.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: COLORS.border, backgroundColor: "#162032" }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
          onPress={() => router.back()}
        >
          <Feather name="chevron-left" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>Laporan Kinerja</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Score Card */}
        <View style={[styles.mainScoreCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          <View style={styles.scoreRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.scoreBadge, { color: COLORS.blue, backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
                Performa Keseluruhan
              </Text>
              <Text style={[styles.completionRateText, { color: COLORS.text }]}>
                {completionRate}%
              </Text>
              <Text style={[styles.completionSub, { color: COLORS.textMuted }]}>
                {completedTasks} dari {totalTasks} tugas telah diselesaikan
              </Text>
            </View>

            <View style={styles.progressCircleContainer}>
              <View style={[styles.progressCircleBg, { borderColor: "rgba(59, 130, 246, 0.2)" }]}>
                <View
                  style={[
                    styles.progressCircleFill,
                    {
                      borderColor: COLORS.blue,
                      transform: [{ rotate: `${(completionRate / 100) * 360}deg` }],
                    },
                  ]}
                />
                <Feather name="award" size={28} color={COLORS.blue} />
              </View>
            </View>
          </View>

          {/* Progress Bar Line */}
          <View style={[styles.progressBarTrack, { backgroundColor: COLORS.bg }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${completionRate}%`, backgroundColor: COLORS.blue },
              ]}
            />
          </View>
        </View>

        {/* 3 Metric Cards */}
        <View style={styles.metricRow}>
          <View style={[styles.metricCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Feather name="check-circle" size={18} color={COLORS.green} />
            </View>
            <Text style={[styles.metricNumber, { color: COLORS.text }]}>{completedTasks}</Text>
            <Text style={[styles.metricLabel, { color: COLORS.textMuted }]}>Selesai</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
              <Feather name="clock" size={18} color={COLORS.amber} />
            </View>
            <Text style={[styles.metricNumber, { color: COLORS.text }]}>{pendingTasks}</Text>
            <Text style={[styles.metricLabel, { color: COLORS.textMuted }]}>Tertunda</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
              <Feather name="zap" size={18} color={COLORS.purple} />
            </View>
            <Text style={[styles.metricNumber, { color: COLORS.text }]}>3 Hari</Text>
            <Text style={[styles.metricLabel, { color: COLORS.textMuted }]}>Streak</Text>
          </View>
        </View>

        {/* Breakdown Prioritas */}
        <View style={[styles.sectionBox, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          <Text style={[styles.sectionHeading, { color: COLORS.text }]}>
            Penyelesaian Berdasarkan Prioritas
          </Text>

          {/* Tinggi */}
          <View style={styles.priorityItem}>
            <View style={styles.priorityHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={[styles.priorityDot, { backgroundColor: COLORS.rose }]} />
                <Text style={[styles.priorityName, { color: COLORS.text }]}>Prioritas Tinggi</Text>
              </View>
              <Text style={[styles.priorityRatio, { color: COLORS.textMuted }]}>
                {highDone} / {highPriority.length}
              </Text>
            </View>
            <View style={[styles.miniBarTrack, { backgroundColor: COLORS.bg }]}>
              <View
                style={[
                  styles.miniBarFill,
                  {
                    backgroundColor: COLORS.rose,
                    width: highPriority.length > 0 ? `${(highDone / highPriority.length) * 100}%` : "0%",
                  },
                ]}
              />
            </View>
          </View>

          {/* Sedang */}
          <View style={styles.priorityItem}>
            <View style={styles.priorityHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={[styles.priorityDot, { backgroundColor: COLORS.amber }]} />
                <Text style={[styles.priorityName, { color: COLORS.text }]}>Prioritas Sedang</Text>
              </View>
              <Text style={[styles.priorityRatio, { color: COLORS.textMuted }]}>
                {mediumDone} / {mediumPriority.length}
              </Text>
            </View>
            <View style={[styles.miniBarTrack, { backgroundColor: COLORS.bg }]}>
              <View
                style={[
                  styles.miniBarFill,
                  {
                    backgroundColor: COLORS.amber,
                    width: mediumPriority.length > 0 ? `${(mediumDone / mediumPriority.length) * 100}%` : "0%",
                  },
                ]}
              />
            </View>
          </View>

          {/* Rendah */}
          <View style={styles.priorityItem}>
            <View style={styles.priorityHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={[styles.priorityDot, { backgroundColor: COLORS.green }]} />
                <Text style={[styles.priorityName, { color: COLORS.text }]}>Prioritas Rendah</Text>
              </View>
              <Text style={[styles.priorityRatio, { color: COLORS.textMuted }]}>
                {lowDone} / {lowPriority.length}
              </Text>
            </View>
            <View style={[styles.miniBarTrack, { backgroundColor: COLORS.bg }]}>
              <View
                style={[
                  styles.miniBarFill,
                  {
                    backgroundColor: COLORS.green,
                    width: lowPriority.length > 0 ? `${(lowDone / lowPriority.length) * 100}%` : "0%",
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Kategori Tugas */}
        {categories.length > 0 && (
          <View style={[styles.sectionBox, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Text style={[styles.sectionHeading, { color: COLORS.text }]}>
              Statistik Kategori
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const info = categoriesMap[cat];
                const pct = info.total > 0 ? Math.round((info.done / info.total) * 100) : 0;
                return (
                  <View
                    key={cat}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: COLORS.bg, borderColor: COLORS.border },
                    ]}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={[styles.categoryTitle, { color: COLORS.text }]}>{cat}</Text>
                      <Text style={[styles.categoryPct, { color: COLORS.blue }]}>{pct}%</Text>
                    </View>
                    <Text style={[styles.categorySub, { color: COLORS.textMuted }]}>
                      {info.done} dari {info.total} selesai
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Productivity Insight Card */}
        <View style={[styles.insightCard, { backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: COLORS.blue }]}>
          <View style={styles.insightHeader}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={COLORS.blue} />
            <Text style={[styles.insightTitle, { color: COLORS.blue }]}>Evaluasi Produktivitas</Text>
          </View>
          <Text style={[styles.insightText, { color: COLORS.text }]}>
            {completionRate >= 80
              ? "Luar biasa! Tingkat penyelesaian tugas Anda sangat tinggi. Pertahankan konsistensi ini untuk mencapai target lebih cepat."
              : completionRate >= 50
              ? "Ritme kerja yang baik! Lebih dari separuh tugas Anda sudah selesai. Selesaikan tugas prioritas tinggi berikutnya untuk hasil optimal."
              : "Ayo mulai fokus! Buat prioritas pada tugas yang paling penting dan selesaikan satu per satu untuk meningkatkan tingkat penyelesaian."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: 40,
  },
  mainScoreCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  scoreBadge: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  completionRateText: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
  completionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  progressCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircleBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircleFill: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  progressBarTrack: {
    height: 8,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  metricRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    alignItems: "center",
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  sectionBox: {
    borderRadius: Radius.lg,
    padding: Spacing.md + 2,
    borderWidth: 1,
    gap: Spacing.md,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
  },
  priorityItem: {
    gap: 6,
  },
  priorityHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityName: {
    fontSize: 13,
    fontWeight: "600",
  },
  priorityRatio: {
    fontSize: 12,
    fontWeight: "500",
  },
  miniBarTrack: {
    height: 6,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  miniBarFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  categoryGrid: {
    gap: Spacing.sm,
  },
  categoryCard: {
    borderRadius: Radius.md,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    gap: 4,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  categoryPct: {
    fontSize: 12,
    fontWeight: "700",
  },
  categorySub: {
    fontSize: 11,
  },
  insightCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: 8,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  insightText: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.9,
  },
});
