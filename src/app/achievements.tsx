import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTaskStore } from "../store/taskStore";
import { Spacing, Radius } from "../constants/theme";

interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardXp: number;
}

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

export default function AchievementsScreen() {
  const tasks = useTaskStore((s) => s.tasks);

  const totalDone = tasks.filter((t) => t.isDone).length;
  const hasHighPriorityDone = tasks.some(
    (t) => (t.priority === "Tinggi" || t.priority === "High") && t.isDone
  );
  const categoriesCount = new Set(tasks.map((t) => t.category || "Umum")).size;

  // Gamification XP calculation
  const xpPerTask = 100;
  const streakBonusXp = 150;
  const currentXp = totalDone * xpPerTask + streakBonusXp;
  const xpPerLevel = 400;
  const currentLevel = Math.floor(currentXp / xpPerLevel) + 1;
  const xpInCurrentLevel = currentXp % xpPerLevel;
  const levelProgressPct = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

  const badges: BadgeItem[] = [
    {
      id: "first_task",
      title: "Langkah Pertama",
      description: "Selesaikan 1 tugas pertamamu.",
      icon: "check-circle",
      isUnlocked: totalDone >= 1,
      progress: Math.min(totalDone, 1),
      maxProgress: 1,
      rewardXp: 100,
    },
    {
      id: "focus_streak",
      title: "Fokus Konsisten",
      description: "Pertahankan streak harian selama 3 hari berturut-turut.",
      icon: "zap",
      isUnlocked: true,
      progress: 3,
      maxProgress: 3,
      rewardXp: 150,
    },
    {
      id: "tri_task",
      title: "Produktif Aktif",
      description: "Selesaikan minimal 3 tugas.",
      icon: "trending-up",
      isUnlocked: totalDone >= 3,
      progress: Math.min(totalDone, 3),
      maxProgress: 3,
      rewardXp: 200,
    },
    {
      id: "task_master",
      title: "Master Tugas",
      description: "Selesaikan total 5 tugas.",
      icon: "award",
      isUnlocked: totalDone >= 5,
      progress: Math.min(totalDone, 5),
      maxProgress: 5,
      rewardXp: 300,
    },
    {
      id: "priority_slayer",
      title: "Penakluk Prioritas",
      description: "Selesaikan tugas dengan tingkat prioritas Tinggi.",
      icon: "shield",
      isUnlocked: hasHighPriorityDone,
      progress: hasHighPriorityDone ? 1 : 0,
      maxProgress: 1,
      rewardXp: 250,
    },
    {
      id: "well_organized",
      title: "Rapi & Teratur",
      description: "Kelola tugas di setidaknya 2 kategori berbeda.",
      icon: "folder",
      isUnlocked: categoriesCount >= 2,
      progress: Math.min(categoriesCount, 2),
      maxProgress: 2,
      rewardXp: 150,
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

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
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>Pencapaian & Badge</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Level & XP Hero Card */}
        <View style={[styles.levelCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          <View style={styles.levelHeader}>
            <View style={[styles.levelBadgeWrap, { backgroundColor: COLORS.amber }]}>
              <MaterialCommunityIcons name="trophy-variant" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[styles.levelText, { color: COLORS.text }]}>Level {currentLevel}</Text>
                <View style={[styles.rankTag, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
                  <Text style={[styles.rankTagText, { color: COLORS.amber }]}>
                    {currentLevel >= 3 ? "Produktif Handal" : currentLevel >= 2 ? "Produktif Aktif" : "Penjelajah Pemula"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.xpCount, { color: COLORS.textMuted }]}>
                {currentXp} Total XP Terkumpul
              </Text>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.xpProgressContainer}>
            <View style={styles.xpRatioRow}>
              <Text style={[styles.xpRatioText, { color: COLORS.textMuted }]}>
                Menuju Level {currentLevel + 1}
              </Text>
              <Text style={[styles.xpRatioText, { color: COLORS.amber, fontWeight: "700" }]}>
                {xpInCurrentLevel} / {xpPerLevel} XP
              </Text>
            </View>
            <View style={[styles.xpTrack, { backgroundColor: COLORS.bg }]}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${levelProgressPct}%`, backgroundColor: COLORS.amber },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Badge Summary Header */}
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryTitle, { color: COLORS.text }]}>
            Daftar Lencana
          </Text>
          <View style={[styles.unlockedTag, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <Text style={[styles.unlockedTagText, { color: COLORS.blue }]}>
              {unlockedCount} / {badges.length} Terbuka
            </Text>
          </View>
        </View>

        {/* Badges List */}
        <View style={styles.badgesList}>
          {badges.map((b) => {
            return (
              <View
                key={b.id}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: COLORS.card,
                    borderColor: b.isUnlocked ? COLORS.blue : COLORS.border,
                    opacity: b.isUnlocked ? 1 : 0.75,
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeIconBox,
                    {
                      backgroundColor: b.isUnlocked
                        ? "rgba(59, 130, 246, 0.15)"
                        : "rgba(148, 163, 184, 0.1)",
                    },
                  ]}
                >
                  <Feather
                    name={b.icon}
                    size={24}
                    color={b.isUnlocked ? COLORS.blue : COLORS.textMuted}
                  />
                  {!b.isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Feather name="lock" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[styles.badgeName, { color: COLORS.text }]}>{b.title}</Text>
                    <View style={[styles.rewardTag, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                      <Text style={[styles.rewardText, { color: COLORS.green }]}>+{b.rewardXp} XP</Text>
                    </View>
                  </View>

                  <Text style={[styles.badgeDesc, { color: COLORS.textMuted }]}>
                    {b.description}
                  </Text>

                  {/* Progress Bar inside badge */}
                  <View style={styles.badgeProgressRow}>
                    <View style={[styles.badgeMiniTrack, { backgroundColor: COLORS.bg }]}>
                      <View
                        style={[
                          styles.badgeMiniFill,
                          {
                            backgroundColor: b.isUnlocked ? COLORS.green : COLORS.blue,
                            width: `${(b.progress / b.maxProgress) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.badgeProgressText, { color: COLORS.textMuted }]}>
                      {b.progress}/{b.maxProgress}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
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
  levelCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  levelBadgeWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    fontSize: 20,
    fontWeight: "800",
  },
  rankTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rankTagText: {
    fontSize: 11,
    fontWeight: "700",
  },
  xpCount: {
    fontSize: 12,
    marginTop: 2,
  },
  xpProgressContainer: {
    gap: 6,
  },
  xpRatioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpRatioText: {
    fontSize: 11,
    fontWeight: "500",
  },
  xpTrack: {
    height: 8,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  unlockedTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  unlockedTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgesList: {
    gap: Spacing.sm + 2,
  },
  badgeCard: {
    flexDirection: "row",
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    alignItems: "center",
    gap: 14,
  },
  badgeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  lockOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#334155",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "700",
  },
  badgeDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  rewardTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: "800",
  },
  badgeProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  badgeMiniTrack: {
    flex: 1,
    height: 5,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  badgeMiniFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  badgeProgressText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
