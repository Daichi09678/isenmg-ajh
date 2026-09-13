import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Task } from "../types/task";
import { useAppTheme } from "../store/themeStore";
import { Spacing, Radius, FontSize, PriorityColors, Shadows } from "../constants/theme";
import { formatDeadline } from "../utils/date";

interface TaskCardProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggleDone, onDelete }: TaskCardProps) {
  const { colors, mode } = useAppTheme();
  
  const currentShadow = mode === 'light' ? Shadows.light : {};

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { 
          backgroundColor: colors.surface, 
          borderColor: mode === 'dark' ? colors.border : "transparent",
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        },
        currentShadow
      ]}
      onPress={() => router.push(`/task/${task.id}` as any)}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => onToggleDone(task.id)} hitSlop={12} style={styles.checkButton}>
            <View style={[styles.checkInner, { borderColor: task.isDone ? colors.accent : colors.textSecondary, backgroundColor: task.isDone ? colors.accent : "transparent" }]}>
              {task.isDone && <Feather name="check" size={14} color="#FFFFFF" />}
            </View>
          </Pressable>
          <Text
            style={[
              styles.title,
              {
                color: task.isDone ? colors.textSecondary : colors.text,
                textDecorationLine: task.isDone ? "line-through" : "none",
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>
        <Pressable onPress={() => onDelete(task.id)} hitSlop={8} style={styles.deleteBtn}>
          <Feather name="trash-2" size={18} color="#EF4444" />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: `${PriorityColors[task.priority]}15` },
            ]}
          >
            <View style={[styles.priorityDot, { backgroundColor: PriorityColors[task.priority] }]} />
            <Text style={[styles.priorityText, { color: PriorityColors[task.priority] }]}>
              {task.priority}
            </Text>
          </View>
        </View>
        
        <View style={styles.deadlineBox}>
          <Feather name="clock" size={12} color={colors.textSecondary} />
          <Text style={[styles.deadline, { color: colors.textSecondary }]}>
            {formatDeadline(task.deadline)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    flex: 1,
    marginRight: Spacing.sm,
  },
  checkButton: {
    paddingTop: 2,
  },
  checkInner: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: "600",
    lineHeight: 24,
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: Radius.full,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: Spacing.xl + 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  deadlineBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deadline: {
    fontSize: FontSize.xs,
    fontWeight: "500",
  },
});
