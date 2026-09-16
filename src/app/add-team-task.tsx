import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useAppTheme } from "../store/themeStore";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTaskStore } from "../store/taskStore";
import { Priority, Urgency } from "../types/task";
import { formatDeadline } from "../utils/date";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];
const URGENCIES: Urgency[] = ["Rendah", "Sedang", "Tinggi", "Kritis"];
const ESTIMATED_TIMES = ["1 Jam", "4 Jam", "1 Hari", "2 Hari"];

const Palette = {
  bg: "#0f172a",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  primary: "#3b82f6",
  border: "#334155",
  surface: "#1e293b",
  surfaceAlt: "rgba(30, 41, 59, 0.5)",
};

export default function AddEditTeamTaskScreen() {
  const { colors, mode } = useAppTheme();
  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    taskBg: colors.background,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#fbbf24",
    purple: "#8b5cf6",
    amber: "#f59e0b",
    rose: "#f43f5e",
    accent: colors.accent,
    white: colors.surface === "#ffffff" ? "#ffffff" : colors.text,
    danger: "#ef4444",
    primary: colors.accent,
    surface: colors.surface,
    surfaceAlt: mode === 'dark' ? "rgba(30, 41, 59, 0.5)" : "rgba(241, 245, 249, 0.5)",
  }), [colors, mode]);
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

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
  const [estimatedTime, setEstimatedTime] = useState(existingTask?.estimatedTime ?? "");
  const [priority, setPriority] = useState<Priority>(existingTask?.priority ?? "Medium");
  const [urgency, setUrgency] = useState<Urgency | undefined>(existingTask?.urgency);
  const [reminder, setReminder] = useState(existingTask?.reminder ?? false);
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
      estimatedTime,
      priority,
      urgency,
      reminder,
      taskType: "Team" as const,
      status: existingTask?.status || "Backlog",
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={handleCancel}
              hitSlop={8}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather name="x" size={20} color={COLORS.text} />
            </Pressable>
            <Text style={styles.headerTitle}>
              {isEditMode ? "Edit Tugas Tim" : "Tugas Tim Baru"}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Hero / Header Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroBadge}>
              <Feather name="star" size={12} color={COLORS.primary} />
              <Text style={styles.heroBadgeText}>
                {isEditMode ? "UPDATE" : "WORKSPACE"}
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              {isEditMode ? "Perbarui Tugas" : "Kolaborasi Tim"}
            </Text>
            <Text style={styles.heroSubtitle}>
              {isEditMode
                ? "Sesuaikan kembali tugas tim yang sudah dibuat."
                : "Tambahkan tugas ke Backlog untuk dikerjakan bersama tim Anda."}
            </Text>
          </View>

          <View style={styles.card}>
            {/* Judul Task */}
            <View style={styles.field}>
              <Text style={styles.label}>Judul Tugas</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'title' && styles.inputFocused,
                  errors.title && styles.inputError,
                ]}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color={focusedInput === 'title' ? COLORS.primary : COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (errors.title) setErrors({});
                  }}
                  onFocus={() => setFocusedInput('title')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Mis: Menyelesaikan desain laporan"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                  autoCorrect={false}
                />
              </View>
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>

            {/* Deskripsi */}
            <View style={styles.field}>
              <Text style={styles.label}>Deskripsi Singkat</Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.textAreaContainer,
                  focusedInput === 'desc' && styles.inputFocused
                ]}
              >
                <Feather
                  name="align-left"
                  size={18}
                  color={focusedInput === 'desc' ? COLORS.primary : COLORS.textMuted}
                  style={[styles.inputIcon, { marginTop: 16 }]}
                />
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setFocusedInput('desc')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Tambahkan catatan atau detail..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={4}
                  style={[styles.input, styles.textArea]}
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Deadline */}
            <View style={styles.field}>
              <Text style={styles.label}>Tenggat Waktu</Text>
              <Pressable
                onPress={() => setShowPicker(true)}
                style={({ pressed }) => [
                  styles.inputContainer,
                  pressed && { backgroundColor: COLORS.surfaceAlt },
                ]}
              >
                <Feather
                  name="calendar"
                  size={18}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <Text style={styles.dateText}>
                  {formatDeadline(deadline.toISOString())}
                </Text>
                <Feather
                  name="chevron-down"
                  size={18}
                  color={COLORS.textMuted}
                  style={{ marginRight: 16 }}
                />
              </Pressable>
            </View>

            {/* Priority */}
            <View style={styles.field}>
              <Text style={styles.label}>Tingkat Prioritas</Text>
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => {
                  const isActive = p === priority;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.priorityChip,
                        isActive && styles.priorityChipActive,
                      ]}
                    >
                      {isActive && (
                        <Feather name="check-circle" size={14} color="#fff" />
                      )}
                      <Text
                        style={[
                          styles.priorityChipText,
                          isActive && styles.priorityChipTextActive,
                        ]}
                      >
                        {p === "High"
                          ? "Tinggi"
                          : p === "Medium"
                          ? "Sedang"
                          : "Rendah"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Urgency */}
            <View style={styles.field}>
              <Text style={styles.label}>Tingkat Urgensi</Text>
              <View style={styles.priorityRow}>
                {URGENCIES.map((u) => {
                  const isActive = u === urgency;
                  return (
                    <Pressable
                      key={u}
                      onPress={() => setUrgency(u)}
                      style={[
                        styles.priorityChip,
                        isActive && {
                          backgroundColor: "#ef4444",
                          borderColor: "#ef4444",
                        },
                      ]}
                    >
                      {isActive && (
                        <Feather name="alert-circle" size={12} color="#fff" />
                      )}
                      <Text
                        style={[
                          styles.priorityChipText,
                          isActive && styles.priorityChipTextActive,
                          { fontSize: 11 },
                        ]}
                      >
                        {u}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Estimated Time */}
            <View style={styles.field}>
              <Text style={styles.label}>Estimasi Waktu Pengerjaan</Text>
              <View style={styles.priorityRow}>
                {ESTIMATED_TIMES.map((time) => {
                  const isActive = time === estimatedTime;
                  return (
                    <Pressable
                      key={time}
                      onPress={() => setEstimatedTime(isActive ? "" : time)}
                      style={[
                        styles.priorityChip,
                        isActive && styles.priorityChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityChipText,
                          isActive && styles.priorityChipTextActive,
                          { fontSize: 11 },
                        ]}
                      >
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Reminder Toggle */}
            <View style={styles.reminderRow}>
              <View style={styles.reminderTextContainer}>
                <View style={styles.reminderIconWrapper}>
                  <Feather
                    name="bell"
                    size={20}
                    color={reminder ? COLORS.primary : COLORS.textMuted}
                  />
                </View>
                <View>
                  <Text style={styles.reminderTitle}>Pasang Pengingat</Text>
                  <Text style={styles.reminderSubtitle}>
                    Notifikasi sebelum tenggat waktu
                  </Text>
                </View>
              </View>
              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={"#fff"}
                ios_backgroundColor={COLORS.border}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.btnCancel,
                pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.btnCancelText}>Batal</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.btnSave,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.btnSaveText}>
                {isEditMode ? "Simpan Perubahan" : "Simpan Tugas"}
              </Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DateTimePicker dipindah ke luar ScrollView agar tidak mengganggu layout */}
      {showPicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  form: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 32,
    alignItems: "flex-start",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    marginBottom: 16,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    gap: 24,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingRight: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  textAreaContainer: {
    alignItems: "flex-start",
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 120,
    paddingTop: 16,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginLeft: 4,
    fontWeight: "500",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: COLORS.surfaceAlt,
  },
  priorityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  priorityChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  priorityChipTextActive: {
    color: "#fff",
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 4,
  },
  reminderTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  reminderIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 2,
  },
  reminderSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 24,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  btnSave: {
    flex: 1.5,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSaveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});