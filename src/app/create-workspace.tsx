import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Modal,
  FlatList
} from "react-native";
import CustomModal from "../components/CustomModal";
import { useAppTheme } from "../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Dummy dropdown options
const DUMMY_TAGS = ["Urgent", "Design", "Development", "Bug"];
const DUMMY_PROJECTS = ["Project Alpha", "Project Beta", "Admin Project"];
const DUMMY_TEMPLATES = ["Scrum Template", "Kanban Template", "Blank Template"];
const DUMMY_STORY_POINTS = ["Fibonacci", "Linear", "T-Shirt Sizes"];
const DUMMY_SKILLS = ["Frontend", "Backend", "UI/UX", "QA"];
const DUMMY_MANAGERS = ["Ferry Samsuhadi", "Muhammad Nurtannio", "Bob"];
const DUMMY_STATUS = ["Active", "Inactive", "Archived"];
const DUMMY_DURATIONS = ["15 Minutes", "30 Minutes", "60 Minutes", "120 Minutes"];

const COLORS_SWATCHES = [
  "#1e3a8a", "#064e3b", "#7f1d1d", "#1e293b", "#312e81", "#451a03", "#dc2626", "#9a3412", "#6b21a8", "#6ee7b7", 
  "#fbbf24", "#d97706", "#f97316", "#be185d", "#8b5cf6", "#0f766e", "#4d7c0f", "#4c1d95", "#15803d", "#475569", 
  "#a16207", "#0369a1", "#84cc16", "#f87171", "#94a3b8", "#60a5fa", "#38bdf8", "#818cf8", "#f472b6", "#2563eb", 
  "#cbd5e1", "#2dd4bf", "#fef08a"
];

export default function CreateWorkspaceScreen() {
  const { colors } = useAppTheme();
  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: "#0f52ba", // A strong professional blue for Request button
    lightGray: "rgba(0,0,0,0.04)",
    white: "#ffffff",
    danger: "#ef4444",
  }), [colors]);
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  // Form States
  const [tag, setTag] = useState("");
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [workspaceType, setWorkspaceType] = useState<"open" | "private">("open");
  const [template, setTemplate] = useState("");
  const [description, setDescription] = useState("");
  const [workspaceCode, setWorkspaceCode] = useState("");
  const [storyPoint, setStoryPoint] = useState("Fibonacci");
  const [skill, setSkill] = useState("");
  const [manager, setManager] = useState("");
  const [status, setStatus] = useState("Active");
  const [duration, setDuration] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1e3a8a");

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [activeSelection, setActiveSelection] = useState("");

  // Custom Modal States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "info" as "info"|"success"|"error" });
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | undefined>(undefined);

  const showAlert = (title: string, message: string, type: "info"|"success"|"error" = "info", onConfirm?: () => void) => {
    setAlertConfig({ title, message, type });
    setOnConfirmAction(() => onConfirm);
    setAlertVisible(true);
  };

  const openModal = (mTitle: string, options: string[], type: string) => {
    setModalTitle(mTitle);
    setModalOptions(options);
    setActiveSelection(type);
    setModalVisible(true);
  };

  const handleSelectOption = (option: string) => {
    switch(activeSelection) {
      case "tag": setTag(option); break;
      case "project": setProject(option); break;
      case "template": setTemplate(option); break;
      case "storyPoint": setStoryPoint(option); break;
      case "skill": setSkill(option); break;
      case "manager": setManager(option); break;
      case "status": setStatus(option); break;
      case "duration": setDuration(option); break;
    }
    setModalVisible(false);
  };

  const handleSave = () => {
    if (!title.trim() || !template.trim() || !workspaceCode.trim() || !manager.trim() || !duration.trim()) {
      showAlert("Error", "Mohon isi semua field yang wajib (bertanda *)", "error");
      return;
    }
    
    showAlert(
      "Sukses", 
      `Workspace '${title}' berhasil dibuat!`,
      "success",
      () => {
        setAlertVisible(false);
        router.back();
      }
    );
  };

  // Reusable Select Field Component
  const SelectField = ({ label, value, placeholder, required = false, onPress }: any) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label} {required && <Text style={{color: COLORS.danger}}>*</Text>}</Text>
      <TouchableOpacity style={styles.selectInput} onPress={onPress}>
        <Text style={value ? styles.inputText : styles.inputTextMuted}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Workspace</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <SelectField 
            label="Tag" 
            value={tag} 
            placeholder="Select Tags" 
            onPress={() => openModal("Select Tags", DUMMY_TAGS, "tag")} 
          />

          <SelectField 
            label="Project" 
            value={project} 
            placeholder="Select Projects" 
            onPress={() => openModal("Select Projects", DUMMY_PROJECTS, "project")} 
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Title <Text style={{color: COLORS.danger}}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Workspace Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Workspace Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity 
                style={[styles.typeBox, workspaceType === "open" && styles.typeBoxActive]}
                onPress={() => setWorkspaceType("open")}
              >
                <View style={styles.radioOuter}>
                  {workspaceType === "open" && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text style={styles.typeTitle}>Open for others</Text>
                  <Text style={styles.typeSubtitle}>Visible to company members</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeBox, workspaceType === "private" && styles.typeBoxActive]}
                onPress={() => setWorkspaceType("private")}
              >
                <View style={styles.radioOuter}>
                  {workspaceType === "private" && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text style={styles.typeTitle}>Private</Text>
                  <Text style={styles.typeSubtitle}>Only visible to you</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <SelectField 
            label="Workspace Template" 
            required 
            value={template} 
            placeholder="Select a Template" 
            onPress={() => openModal("Select a Template", DUMMY_TEMPLATES, "template")} 
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* ROW: Workspace Code & Story Point Type */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Workspace Code <Text style={{color: COLORS.danger}}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={workspaceCode}
                onChangeText={setWorkspaceCode}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <SelectField 
                label="Story Point Type" 
                required 
                value={storyPoint} 
                placeholder="Fibonacci" 
                onPress={() => openModal("Select Story Point Type", DUMMY_STORY_POINTS, "storyPoint")} 
              />
            </View>
          </View>

          {/* ROW: Skill & Project Manager */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <SelectField 
                label="Skill" 
                value={skill} 
                placeholder="Select Skills" 
                onPress={() => openModal("Select Skills", DUMMY_SKILLS, "skill")} 
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <SelectField 
                label="Project Manager" 
                required 
                value={manager} 
                placeholder="Select a Project Manager" 
                onPress={() => openModal("Select a Project Manager", DUMMY_MANAGERS, "manager")} 
              />
            </View>
          </View>

          {/* ROW: Workspace Status & Target Duration */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <SelectField 
                label="Workspace Status" 
                value={status} 
                placeholder="Active" 
                onPress={() => openModal("Select Workspace Status", DUMMY_STATUS, "status")} 
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <SelectField 
                label="Target Duration" 
                required 
                value={duration} 
                placeholder="Select a duration" 
                onPress={() => openModal("Select Target Duration", DUMMY_DURATIONS, "duration")} 
              />
            </View>
          </View>

          {/* Color Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS_SWATCHES.map((hex, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorBox, 
                    { backgroundColor: hex },
                    selectedColor === hex && styles.colorBoxSelected
                  ]}
                  onPress={() => setSelectedColor(hex)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
            <Ionicons name="close" size={16} color={COLORS.text} style={{ marginRight: 6 }} />
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
            <Ionicons name="save-outline" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={styles.btnSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* DROPDOWN MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => handleSelectOption(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* CUSTOM ALERT MODAL */}
      <CustomModal 
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
        onConfirm={onConfirmAction}
        confirmText={onConfirmAction ? "Lanjutkan" : undefined}
      />

    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: COLORS.text 
  },
  content: { 
    flex: 1, 
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  formGroup: { 
    marginBottom: 16,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: COLORS.text, 
    marginBottom: 8 
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
    color: COLORS.text,
    fontSize: 14,
  },
  textArea: { 
    height: 80, 
    paddingTop: 12 
  },
  selectInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    color: COLORS.text,
    fontSize: 14,
  },
  inputTextMuted: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  typeBoxActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(15, 82, 186, 0.05)",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  typeSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorBox: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  colorBoxSelected: {
    borderWidth: 3,
    borderColor: COLORS.text, // high contrast border for selected
  },
  footer: { 
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: 12,
  },
  btnCancel: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  btnCancelText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  btnSave: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  btnSaveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  }
});
