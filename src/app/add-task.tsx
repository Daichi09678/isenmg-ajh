import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppTheme } from "../store/themeStore";
import { useTaskStore } from "../store/taskStore";
import { Priority } from "../types/task";
import Button from "../components/Button";
import { Spacing, Radius, FontSize, PriorityColors } from "../constants/theme";
import { formatDeadline } from "../utils/date";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export default function AddEditTaskScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const getTaskById = useTaskStore((s) => s.getTaskById);

  const existingTask = id ? getTaskById(id) : undefined;
  const isEditMode = !!existingTask;

  const [title, setTitle] = useState(existingTask?.title ?? "");
  const [description, setDescription] = useState(existingTask?.description ?? "");
  const [deadline, setDeadline] = useState<Date>(
    existingTask ? new Date(existingTask.deadline) : new Date(Date.now() + 3600 * 1000)
  );
  const [priority, setPriority] = useState<Priority>(existingTask?.priority ?? "Medium");
  const [reminder, setReminder] = useState(existingTask?.reminder ?? false);
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) newErrors.title = "Judul task wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline.toISOString(),
      priority,
      reminder,
    };

    if (isEditMode && existingTask) {
      await updateTask(existingTask.id, payload);
    } else {
      await addTask(payload);
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDeadline(selectedDate);
    if (Platform.OS === "android") setShowPicker(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Pressable onPress={handleCancel} hitSlop={8}>
            <Feather name="x" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isEditMode ? "Edit Task" : "Tambah Task"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          {/* Judul Task */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Judul Task</Text>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({});
              }}
              placeholder="Mis: Selesaikan laporan mingguan"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.title ? colors.text : colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            />
            {errors.title && (
              <Text style={[styles.errorText, { color: colors.text }]}>
                {errors.title}
              </Text>
            )}
          </View>

          {/* Deskripsi */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Deskripsi</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tambahkan detail task (opsional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              style={[
                styles.input,
                styles.textArea,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            />
          </View>

          {/* Deadline */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Deadline</Text>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={[
                styles.input,
                styles.dateInput,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <Text style={{ color: colors.text }}>{formatDeadline(deadline.toISOString())}</Text>
              <Feather name="calendar" size={18} color={colors.textSecondary} />
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={deadline}
                mode="datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Priority */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => {
                const isActive = p === priority;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.priorityChip,
                      {
                        borderColor: isActive ? colors.text : colors.border,
                        backgroundColor: isActive ? colors.text : "transparent",
                      },
                    ]}
                  >
                    <View
                      style={[styles.priorityDot, { backgroundColor: isActive ? colors.background : PriorityColors[p] }]}
                    />
                    <Text
                      style={[
                        styles.priorityChipText,
                        { color: isActive ? colors.background : colors.text },
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Reminder Toggle */}
          <View style={[styles.field, styles.reminderRow]}>
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Reminder</Text>
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Ingatkan saya sebelum deadline
              </Text>
            </View>
            <Switch
              value={reminder}
              onValueChange={setReminder}
              trackColor={{ false: colors.border, true: colors.text }}
              thumbColor={colors.background}
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          <Button label="Batal" variant="outline" onPress={handleCancel} style={{ flex: 1 }} />
          <Button label="Simpan" variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      </KeyboardAvoidingView>
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
  form: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  hint: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    fontSize: FontSize.xs,
  },
  priorityRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  priorityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityChipText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
});
