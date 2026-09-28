import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTaskStore } from "../store/taskStore";
import { useAppTheme } from "../store/themeStore";

export default function AddNewTaskModal() {
  const { colors, mode } = useAppTheme();
  
  // Custom refined palette to match the elegant UI requirements
  const COLORS = {
    bg: mode === 'dark' ? '#121212' : '#ffffff',
    text: mode === 'dark' ? '#f1f5f9' : '#334155', // Dark slate for pro look
    textMuted: mode === 'dark' ? '#94a3b8' : '#94a3b8',
    border: mode === 'dark' ? '#334155' : '#e2e8f0', // Soft border
    inputBg: mode === 'dark' ? '#1e293b' : '#ffffff',
    primary: '#10b981', // Solid elegant green
    ghost: 'transparent',
    danger: '#ef4444',
  };

  const addTask = useTaskStore(s => s.addTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) newErrors.title = "Task Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    let priority: any = "Medium";
    if (isImportant) priority = "High";
    
    let urgency: any = "Sedang";
    if (isUrgent) urgency = "Tinggi";
    
    addTask({
      title: title.trim(),
      description: description.trim(),
      deadline: dueDate ? dueDate.toISOString() : "",
      priority: priority,
      urgency: urgency,
      isImportant: isImportant,
      isUrgent: isUrgent,
      taskType: "Personal"
    });
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>Add New Task</Text>
            <TouchableOpacity 
              style={[styles.closeButton, { borderColor: COLORS.textMuted }]} 
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* TASK TITLE */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              Task Title <Text style={{ color: COLORS.danger }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input, 
                { backgroundColor: COLORS.inputBg, borderColor: errors.title ? COLORS.danger : COLORS.border, color: COLORS.text }
              ]}
              placeholder="Enter task title..."
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={(txt) => { setTitle(txt); setErrors({}); }}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* DESCRIPTION */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>Description</Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea,
                { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }
              ]}
              placeholder="Add a more detailed description..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* DUE DATE */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>Due Date</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowPicker(true)}
              style={[styles.dateInputContainer, { backgroundColor: COLORS.inputBg, borderColor: COLORS.border }]}
            >
              <Text style={[styles.dateText, { color: dueDate ? COLORS.text : COLORS.textMuted }]}>
                {dueDate ? formatDate(dueDate) : "No Due Date"}
              </Text>
              <View style={[styles.dateIconWrapper, { borderLeftColor: COLORS.border }]}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textMuted} />
              </View>
            </TouchableOpacity>
          </View>

          {/* FLAGS */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text, marginBottom: 12 }]}>Flags</Text>
            
            <View style={styles.flagRow}>
              <Switch
                value={isImportant}
                onValueChange={setIsImportant}
                trackColor={{ false: COLORS.border, true: COLORS.textMuted }}
                thumbColor={isImportant ? '#ffffff' : '#ffffff'}
                ios_backgroundColor={COLORS.border}
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
              />
              <Text style={[styles.flagLabel, { color: COLORS.text }]}>Is Important</Text>
            </View>

            <View style={styles.flagRow}>
              <Switch
                value={isUrgent}
                onValueChange={setIsUrgent}
                trackColor={{ false: COLORS.border, true: COLORS.textMuted }}
                thumbColor={isUrgent ? '#ffffff' : '#ffffff'}
                ios_backgroundColor={COLORS.border}
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
              />
              <Text style={[styles.flagLabel, { color: COLORS.text }]}>Is Urgent</Text>
            </View>
          </View>

        </ScrollView>

        {/* FOOTER ACTIONS */}
        <View style={[styles.footerRow, { backgroundColor: COLORS.bg, borderTopColor: COLORS.border }]}>
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="close-outline" size={20} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.cancelBtnText, { color: COLORS.primary }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: COLORS.primary }]} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-outline" size={20} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* DATE PICKER MODAL */}
        {showPicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowPicker(Platform.OS === 'ios');
              if (date) setDueDate(date);
              if (Platform.OS === 'android') setShowPicker(false);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Space for footer
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateIconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderLeftWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flagLabel: {
    fontSize: 15,
    marginLeft: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4,
  },
  footerRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff', // Usually footer is solid to overlay content
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 16,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});