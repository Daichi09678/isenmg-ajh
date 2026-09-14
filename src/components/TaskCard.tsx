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
          borderColor: colors.border,
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
            <View style={[styles.checkInner, { 
              borderColor: task.isDone ? colors.accent : colors.textSecondary, 
              backgroundColor: task.isDone ? colors.accent : "transparent" 
            }]}>
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
        <Pressable 
          onPress={() => onDelete(task.id)} 
          hitSlop={8} 
          style={({ pressed }) => [
            styles.deleteBtn,
            { backgroundColor: 'transparent' },
            pressed && { opacity: 0.5 }
          ]}
        >
          <Feather name="trash-2" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.priorityBadge,
              { 
                backgroundColor: task.isDone 
                  ? 'transparent' 
                  : `${PriorityColors[task.priority]}15`,
                borderColor: task.isDone ? colors.border : 'transparent',
                borderWidth: task.isDone ? 1 : 0
              },
            ]}
          >
            <View style={[styles.priorityDot, { backgroundColor: task.isDone ? colors.textSecondary : PriorityColors[task.priority] }]} />
            <Text style={[styles.priorityText, { color: task.isDone ? colors.textSecondary : PriorityColors[task.priority] }]}>
              {task.priority}
            </Text>
          </View>
        </View>
        
        <View style={styles.deadlineBox}>
          <Feather name="clock" size={14} color={colors.textSecondary} />
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
    borderRadius: Radius.lg, // 24px
    padding: Spacing.lg,
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
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: "700",
    lineHeight: 24,
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
    borderRadius: Radius.full,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: Spacing.xl + 4,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deadlineBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deadline: {
    fontSize: 13,
    fontWeight: "600",
  },
});
