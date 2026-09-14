import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../../store/themeStore";
import { useTaskStore } from "../../store/taskStore";
import Button from "../../components/Button";
import { Spacing, Radius, FontSize, PriorityColors } from "../../constants/theme";
import { formatDeadline, isOverdue } from "../../utils/date";

export default function TaskDetailScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getTaskById = useTaskStore((s) => s.getTaskById);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const task = getTaskById(id);

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={{ color: colors.text }}>Task tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const overdue = !task.isDone && isOverdue(task.deadline);

  const handleDelete = () => {
    Alert.alert(
      "Hapus Task",
      "Apakah kamu yakin ingin menghapus task ini? Tindakan ini tidak bisa dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await deleteTask(task.id);
            router.replace("/(tabs)" as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Detail Task</Text>
        <Pressable onPress={() => router.push(`/${task.taskType === 'Team' ? 'add-team-task' : 'add-task'}?id=${task.id}` as any)} hitSlop={8}>
          <Feather name="edit-2" size={20} color="#3b82f6" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: task.isDone ? colors.text : "transparent",
                borderColor: colors.text,
              },
            ]}
          >
            <Feather
              name={task.isDone ? "check-circle" : "circle"}
              size={14}
              color={task.isDone ? colors.background : colors.text}
            />
            <Text
              style={[
                styles.statusText,
                { color: task.isDone ? colors.background : colors.text },
              ]}
            >
              {task.isDone ? "Selesai" : "Belum Selesai"}
            </Text>
          </View>
          {overdue && (
            <Text style={[styles.overdueTag, { color: colors.text }]}>Terlambat</Text>
          )}
        </View>

        {/* Judul */}
        <Text
          style={[
            styles.title,
            { color: colors.text, textDecorationLine: task.isDone ? "line-through" : "none" },
          ]}
        >
          {task.title}
        </Text>

        {/* Info grid */}
        <View style={[styles.infoCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Deadline</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatDeadline(task.deadline)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <View
              style={[styles.priorityDot, { backgroundColor: PriorityColors[task.priority] }]}
            />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Priority</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{task.priority}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Feather name="bell" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reminder</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {task.reminder ? "Aktif" : "Nonaktif"}
            </Text>
          </View>
        </View>

        {/* Deskripsi */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Deskripsi</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {task.description || "Tidak ada deskripsi."}
          </Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Button
          label={task.isDone ? "Tandai Belum Selesai" : "Mark as Done"}
          variant="primary"
          onPress={() => toggleDone(task.id)}
        />
        <View style={styles.actionRow}>
          <Button
            label="Edit"
            variant="outline"
            onPress={() => router.push(`/${task.taskType === 'Team' ? 'add-team-task' : 'add-task'}?id=${task.id}` as any)}
            style={{ flex: 1 }}
          />
          <Button
            label="Delete"
            variant="danger"
            onPress={handleDelete}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
  },
  overdueTag: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "800",
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  infoValue: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  divider: {
    height: 1,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  descriptionSection: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  description: {
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  actions: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});
