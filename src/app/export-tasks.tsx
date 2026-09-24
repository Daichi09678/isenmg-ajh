import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Switch,
  Platform,
  useWindowDimensions,
  Modal,
  FlatList,
} from "react-native";
import CustomModal from "../components/CustomModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppTheme } from "../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Dummy Data for Dropdowns
const DUMMY_TAGS = ["Urgent", "Bug", "Feature", "Enhancement"];
const DUMMY_WORKSPACES = ["2026 - BKPM", "Admin Project", "Aplikasi Desain"];

const DUMMY_MEMBERS = ["Ferry Samsuhadi", "Bob", "Muhammad Nurtannio"];

export default function ExportTasksScreen() {
  const { colors } = useAppTheme();

  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: colors.accent || "#3b82f6",
    blue: "#3b82f6",
    orange: "#f97316",
    lightGray: "rgba(0,0,0,0.05)",
    white: "#ffffff"
  }), [colors]);

  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  // States
  const [exportType, setExportType] = useState("Daily"); // Daily, Filter
  const [dateFilter, setDateFilter] = useState("Due Date"); // All, Due Date, Done Date
  const [evidenceOnly, setEvidenceOnly] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);

  // Lists
  const [availableColumns, setAvailableColumns] = useState(["Assignee", "Checklist", "Comment", "Created At", "Created By", "Description", "Due Date", "End Date", "Priority"]);
  const [selectedColumns, setSelectedColumns] = useState(["Date", "Day", "Completed", "Workspace", "Board"]);

  // Dropdown States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [activeSelection, setActiveSelection] = useState("");
  
  // Selected Values
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  
  // Date Picker States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 30));
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [showNativePicker, setShowNativePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  // Custom Modal States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "info" as "info"|"success"|"error" });

  const showAlert = (title: string, message: string, type: "info"|"success"|"error" = "info") => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };
  
  const displayDateRange = dateFilter === "All" 
    ? "All Dates" 
    : `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const openModal = (title: string, options: string[], type: string) => {
    setModalTitle(title);
    setModalOptions(options);
    setActiveSelection(type);
    setModalVisible(true);
  };

  const selectOption = (option: string) => {
    if (activeSelection === "tag") setSelectedTag(option);
    if (activeSelection === "workspace") setSelectedWorkspace(option);
    if (activeSelection === "member") setSelectedMember(option);
    setModalVisible(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowNativePicker(Platform.OS === 'ios'); // On iOS we might keep it open if inline, but let's just hide it for now
    if (Platform.OS !== 'ios') setShowNativePicker(false);
    
    if (selectedDate) {
      if (pickerMode === "start") setStartDate(selectedDate);
      else setEndDate(selectedDate);
    }
  };

  const openNativePicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    setShowNativePicker(true);
  };

  const moveItem = (item: string, fromList: "available" | "selected") => {
    if (fromList === "available") {
      setAvailableColumns(prev => prev.filter(i => i !== item));
      setSelectedColumns(prev => [...prev, item]);
    } else {
      setSelectedColumns(prev => prev.filter(i => i !== item));
      setAvailableColumns(prev => [...prev, item]);
    }
  };

  const moveAll = (to: "selected" | "available") => {
    if (to === "selected") {
      setSelectedColumns(prev => [...prev, ...availableColumns]);
      setAvailableColumns([]);
    } else {
      setAvailableColumns(prev => [...prev, ...selectedColumns]);
      setSelectedColumns([]);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Export Tasks to Excel</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ROW 1: Export Type & Date Filter */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Export Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioItem} onPress={() => setExportType("Daily")}>
                <Ionicons name={exportType === "Daily" ? "radio-button-on" : "radio-button-off"} size={18} color={exportType === "Daily" ? COLORS.primary : COLORS.textMuted} />
                <Text style={styles.radioText}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioItem} onPress={() => setExportType("Filter")}>
                <Ionicons name={exportType === "Filter" ? "radio-button-on" : "radio-button-off"} size={18} color={exportType === "Filter" ? COLORS.primary : COLORS.textMuted} />
                <Text style={styles.radioText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Filter by Date</Text>
            <View style={styles.segmentedControl}>
              {["All", "Due Date", "Done Date"].map((opt) => (
                <TouchableOpacity 
                  key={opt}
                  style={[styles.segmentBtn, dateFilter === opt && styles.segmentBtnActive]}
                  onPress={() => setDateFilter(opt)}
                >
                  <Text style={[styles.segmentText, dateFilter === opt && styles.segmentTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ROW 2: Date Range & Tags */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Date Range</Text>
            <TouchableOpacity 
              style={[styles.inputContainer, dateFilter === "All" && { backgroundColor: COLORS.lightGray }]} 
              onPress={() => dateFilter !== "All" && setDateModalVisible(true)}
              disabled={dateFilter === "All"}
            >
              <Text style={dateFilter === "All" ? styles.inputTextMuted : styles.inputText}>{displayDateRange}</Text>
              <View style={styles.inputIconBox}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Tags</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => openModal("Select Tags", DUMMY_TAGS, "tag")}>
              <Text style={selectedTag ? styles.inputText : styles.inputTextMuted}>{selectedTag || "Select Tags"}</Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* DUAL LIST BOX */}
        <View style={styles.section}>
          <Text style={styles.label}>Columns to Export</Text>
          <View style={styles.dualListBox}>
            
            <View style={styles.listBox}>
              <Text style={styles.listHeader}>Available Columns ({availableColumns.length})</Text>
              {availableColumns.length === 0 ? (
                <View style={styles.listContent}>
                  <Text style={styles.listEmptyText}>No columns</Text>
                </View>
              ) : (
                <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
                  {availableColumns.map((col, idx) => (
                    <TouchableOpacity key={idx} onPress={() => moveItem(col, "available")}>
                      <Text style={styles.listItem}>{col}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.listControls}>
              <TouchableOpacity style={styles.controlBtn} onPress={() => showAlert("Tip", "Tap item di list untuk memindahkannya", "info")}><Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} /></TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={() => moveAll("selected")}><Ionicons name="play-forward" size={14} color={COLORS.textMuted} /></TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={() => showAlert("Tip", "Tap item di list untuk memindahkannya", "info")}><Ionicons name="chevron-back" size={14} color={COLORS.textMuted} /></TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={() => moveAll("available")}><Ionicons name="play-back" size={14} color={COLORS.textMuted} /></TouchableOpacity>
            </View>

            <View style={styles.listBox}>
              <Text style={styles.listHeader}>Selected Columns ({selectedColumns.length})</Text>
              {selectedColumns.length === 0 ? (
                <View style={styles.listContent}>
                  <Text style={styles.listEmptyText}>No columns selected</Text>
                </View>
              ) : (
                <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
                  {selectedColumns.map((col, idx) => (
                    <TouchableOpacity key={idx} onPress={() => moveItem(col, "selected")}>
                      <Text style={styles.listItemSelected}>{col}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>

        {/* ROW 3: Workspaces & Members */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Workspaces</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => openModal("Select Workspace", DUMMY_WORKSPACES, "workspace")}>
              <Text style={selectedWorkspace ? styles.inputText : styles.inputTextMuted}>{selectedWorkspace || "Select Workspaces"}</Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Members</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => openModal("Select Member", DUMMY_MEMBERS, "member")}>
              <Text style={selectedMember ? styles.inputText : styles.inputTextMuted}>{selectedMember || "Select Members"}</Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TOGGLES */}
        <View style={styles.togglesRow}>
          <View style={styles.toggleItem}>
            <Switch
              value={evidenceOnly}
              onValueChange={setEvidenceOnly}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#FFFFFF'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text style={styles.toggleText}>Evidence Only</Text>
          </View>
          <View style={styles.toggleItem}>
            <Switch
              value={showAllDates}
              onValueChange={setShowAllDates}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#FFFFFF'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text style={styles.toggleText}>Show All Dates</Text>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity style={[styles.btn, styles.btnOrange]} onPress={() => showAlert("Template", "Memuat template...", "info")}>
            <Ionicons name="push-outline" size={16} color={COLORS.white} />
            <Text style={styles.btnTextWhite}>Load Template</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => showAlert("Template", "Menyimpan template...", "success")}>
            <Ionicons name="save-outline" size={16} color={COLORS.white} />
            <Text style={styles.btnTextWhite}>Save Template</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerRow}>
          <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => router.back()}>
            <Ionicons name="close" size={16} color={COLORS.text} />
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => showAlert("Export", "Menjalankan proses export tugas Anda...", "success")}>
            <Ionicons name="eye-outline" size={16} color={COLORS.white} />
            <Text style={styles.btnTextWhite}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM SHEET MODAL (DUMMY) */}
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
                <TouchableOpacity style={styles.modalOption} onPress={() => selectOption(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* DATE RANGE MODAL */}
      <Modal visible={dateModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { paddingBottom: 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date Range</Text>
              <TouchableOpacity onPress={() => setDateModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerRow}>
              <View style={styles.col}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => openNativePicker("start")}>
                  <Text style={styles.inputText}>{formatDate(startDate)}</Text>
                  <Ionicons name="calendar" size={18} color={COLORS.primary} style={{ marginRight: 12 }} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.datePickerRow, { marginTop: 16, marginBottom: 24 }]}>
              <View style={styles.col}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => openNativePicker("end")}>
                  <Text style={styles.inputText}>{formatDate(endDate)}</Text>
                  <Ionicons name="calendar" size={18} color={COLORS.primary} style={{ marginRight: 12 }} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setDateModalVisible(false)}>
              <Text style={styles.btnTextWhite}>Apply Date Range</Text>
            </TouchableOpacity>
            
            {showNativePicker && (
              <DateTimePicker
                value={pickerMode === "start" ? startDate : endDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={pickerMode === "start" ? endDate : undefined}
                minimumDate={pickerMode === "end" ? startDate : undefined}
              />
            )}
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
      />

    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  closeBtn: { 
    padding: 6, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  content: { 
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
    gap: 8,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  // Radio
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  radioText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  // Segmented Control
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  segmentTextActive: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  // Inputs
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    height: 40,
    paddingLeft: 12,
  },
  inputText: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  inputTextMuted: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  inputIconBox: {
    width: 40,
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownIcon: {
    paddingRight: 10,
  },
  // Dual List Box
  dualListBox: {
    flexDirection: "row",
    height: 180,
    gap: 8,
  },
  listBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    padding: 8,
  },
  listHeader: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  listContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listEmptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  listScroll: {
    flex: 1,
  },
  listItem: {
    fontSize: 12,
    color: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
    marginBottom: 4,
    borderRadius: 4,
  },
  listItemSelected: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "rgba(14, 165, 233, 0.1)", // Light tint of primary
    marginBottom: 4,
    borderRadius: 4,
  },
  listControls: {
    justifyContent: "center",
    gap: 8,
  },
  controlBtn: {
    width: 28,
    height: 28,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  // Toggles
  togglesRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  // Footer
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
    backgroundColor: COLORS.card,
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 6,
    gap: 6,
  },
  btnOrange: {
    backgroundColor: COLORS.orange,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnOutline: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnTextWhite: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "bold",
  },
  btnText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "50%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  datePickerRow: {
    flexDirection: "row",
    gap: 12,
  }
});
