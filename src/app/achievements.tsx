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
import { useAppTheme } from "../store/themeStore";
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

export default function AchievementsScreen() {
  const { mode, colors } = useAppTheme();
  const tasks = useTaskStore((s) => s.tasks);

  const isDark = mode === "dark";

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
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.back()}
        >
          <Feather name="chevron-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pencapaian & Badge</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Level & XP Hero Card */}
        <View style={[styles.levelCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.levelHeader}>
            <View style={[styles.levelBadgeWrap, { backgroundColor: colors.accent }]}>
              <MaterialCommunityIcons name="trophy-variant" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[styles.levelText, { color: colors.text }]}>Level {currentLevel}</Text>
                <View style={[styles.rankTag, { backgroundColor: isDark ? "rgba(217,105,31,0.2)" : "#fdede2" }]}>
                  <Text style={[styles.rankTagText, { color: colors.accent }]}>
                    {currentLevel >= 3 ? "Produktif Handal" : currentLevel >= 2 ? "Produktif Aktif" : "Penjelajah Pemula"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.xpCount, { color: colors.textSecondary }]}>
                {currentXp} Total XP Terkumpul
              </Text>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.xpProgressContainer}>
            <View style={styles.xpRatioRow}>
              <Text style={[styles.xpRatioText, { color: colors.textSecondary }]}>
                Menuju Level {currentLevel + 1}
              </Text>
              <Text style={[styles.xpRatioText, { color: colors.accent, fontWeight: "700" }]}>
                {xpInCurrentLevel} / {xpPerLevel} XP
              </Text>
            </View>
            <View style={[styles.xpTrack, { backgroundColor: isDark ? "#4a3219" : "#ebdcc7" }]}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${levelProgressPct}%`, backgroundColor: colors.accent },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Badge Summary Header */}
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Daftar Lencana
          </Text>
          <View style={[styles.unlockedTag, { backgroundColor: isDark ? "#33200c" : "#f1e6d0" }]}>
            <Text style={[styles.unlockedTagText, { color: colors.text }]}>
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
                    backgroundColor: colors.surface,
                    borderColor: b.isUnlocked ? colors.accent : colors.border,
                    opacity: b.isUnlocked ? 1 : 0.75,
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeIconBox,
                    {
                      backgroundColor: b.isUnlocked
                        ? isDark
                          ? "rgba(217,105,31,0.2)"
                          : "#fdede2"
                        : isDark
                        ? "#33200c"
                        : "#e8decb",
                    },
                  ]}
                >
                  <Feather
                    name={b.icon}
                    size={24}
                    color={b.isUnlocked ? colors.accent : colors.textSecondary}
                  />
                  {!b.isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Feather name="lock" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[styles.badgeName, { color: colors.text }]}>{b.title}</Text>
                    <View style={[styles.rewardTag, { backgroundColor: isDark ? "#241209" : "#f5ebd8" }]}>
                      <Text style={[styles.rewardText, { color: colors.accent }]}>+{b.rewardXp} XP</Text>
                    </View>
                  </View>

                  <Text style={[styles.badgeDesc, { color: colors.textSecondary }]}>
                    {b.description}
                  </Text>

                  {/* Progress Bar inside badge */}
                  <View style={styles.badgeProgressRow}>
                    <View style={[styles.badgeMiniTrack, { backgroundColor: isDark ? "#4a3219" : "#ebdcc7" }]}>
                      <View
                        style={[
                          styles.badgeMiniFill,
                          {
                            backgroundColor: b.isUnlocked ? "#10B981" : colors.accent,
                            width: `${(b.progress / b.maxProgress) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.badgeProgressText, { color: colors.textSecondary }]}>
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
    backgroundColor: "#78716c",
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
