import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppTheme } from "../store/themeStore";

// Checkbox Component
const Checkbox = ({ label, checked, onChange, COLORS }: any) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onChange(!checked)} activeOpacity={0.7}>
    <Ionicons 
      name={checked ? "checkbox" : "square-outline"} 
      size={22} 
      color={checked ? COLORS.primary : COLORS.textMuted} 
    />
    <Text style={[styles.checkboxLabel, { color: checked ? COLORS.text : COLORS.textMuted }]}>{label}</Text>
  </TouchableOpacity>
);

export default function FilterTasksScreen() {
  const { colors } = useAppTheme();

  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: colors.accent || "#3b82f6",
    white: "#ffffff",
    lightGray: "rgba(0,0,0,0.05)",
  }), [colors]);

  const s = React.useMemo(() => getStyles(COLORS), [COLORS]);

  // States
  const [keyword, setKeyword] = useState("");
  const [flags, setFlags] = useState({ urgent: false, important: false });
  const [status, setStatus] = useState({ new: false, doing: false, done: false });
  
  const [assigner, setAssigner] = useState("");
  const [assignee, setAssignee] = useState("");
  
  const [members, setMembers] = useState({ noMembers: false, assignedToMe: false, selectMembers: false });
  
  const [dates, setDates] = useState({ createdRange: false, noDates: false, selectStatus: false, customRange: false });
  const [priorities, setPriorities] = useState({ noPriorities: false, selectPriorities: false });
  const [labels, setLabels] = useState({ noLabels: false, selectLabels: false });

  // Dropdown Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [activeSelection, setActiveSelection] = useState("");

  const openDropdown = (title: string, options: string[], type: string) => {
    setModalTitle(title);
    setModalOptions(options);
    setActiveSelection(type);
    setModalVisible(true);
  };

  const selectOption = (option: string) => {
    if (activeSelection === "assigner") setAssigner(option);
    if (activeSelection === "assignee") setAssignee(option);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Filter Tasks</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Ionicons name="close" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        
        {/* KEYWORD SECTION */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Keyword</Text>
          <View style={s.inputWrapper}>
            <TextInput 
              style={s.input}
              placeholder="Enter keywords..."
              placeholderTextColor={COLORS.textMuted}
              value={keyword}
              onChangeText={setKeyword}
            />
          </View>
          
          <Text style={s.subTitle}>Flags</Text>
          <View style={s.row}>
            <Checkbox label="Urgent" checked={flags.urgent} onChange={(v: boolean) => setFlags({...flags, urgent: v})} COLORS={COLORS} />
            <Checkbox label="Important" checked={flags.important} onChange={(v: boolean) => setFlags({...flags, important: v})} COLORS={COLORS} />
          </View>

          <Text style={s.subTitle}>Status</Text>
          <View style={s.row}>
            <Checkbox label="New" checked={status.new} onChange={(v: boolean) => setStatus({...status, new: v})} COLORS={COLORS} />
            <Checkbox label="Doing" checked={status.doing} onChange={(v: boolean) => setStatus({...status, doing: v})} COLORS={COLORS} />
            <Checkbox label="Done" checked={status.done} onChange={(v: boolean) => setStatus({...status, done: v})} COLORS={COLORS} />
          </View>
        </View>

        {/* PEOPLE & ATTRIBUTES SECTION */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>People & Attributes</Text>
          
          <Text style={s.subTitle}>Assigner</Text>
          <TouchableOpacity style={s.dropdown} onPress={() => openDropdown("Select Assigner", ["Alice", "Bob", "Charlie"], "assigner")}>
            <Text style={assigner ? s.dropdownText : s.dropdownTextMuted}>{assigner || "Select assigner"}</Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <Text style={s.subTitle}>Assignee</Text>
          <TouchableOpacity style={s.dropdown} onPress={() => openDropdown("Select Assignee", ["Dave", "Eve", "Frank"], "assignee")}>
            <Text style={assignee ? s.dropdownText : s.dropdownTextMuted}>{assignee || "Select assignee"}</Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* MEMBERS SECTION */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Members (Collaborators)</Text>
          <View style={s.col}>
            <Checkbox label="No members" checked={members.noMembers} onChange={(v: boolean) => setMembers({...members, noMembers: v})} COLORS={COLORS} />
            <Checkbox label="Tasks assigned to me" checked={members.assignedToMe} onChange={(v: boolean) => setMembers({...members, assignedToMe: v})} COLORS={COLORS} />
            <Checkbox label="Select members" checked={members.selectMembers} onChange={(v: boolean) => setMembers({...members, selectMembers: v})} COLORS={COLORS} />
          </View>
        </View>

        {/* DATES SECTION */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Dates</Text>
          <Checkbox label="Created Date Range" checked={dates.createdRange} onChange={(v: boolean) => setDates({...dates, createdRange: v})} COLORS={COLORS} />
          
          <Text style={[s.subTitle, { marginTop: 16 }]}>Due Date</Text>
          <View style={s.col}>
            <Checkbox label="No dates" checked={dates.noDates} onChange={(v: boolean) => setDates({...dates, noDates: v})} COLORS={COLORS} />
            <Checkbox label="Select Status" checked={dates.selectStatus} onChange={(v: boolean) => setDates({...dates, selectStatus: v})} COLORS={COLORS} />
            <Checkbox label="Custom range date" checked={dates.customRange} onChange={(v: boolean) => setDates({...dates, customRange: v})} COLORS={COLORS} />
          </View>
        </View>

        {/* PRIORITIES & LABELS ROW */}
        <View style={s.twoColRow}>
          <View style={[s.card, { flex: 1 }]}>
            <Text style={s.sectionTitle}>Priorities</Text>
            <View style={s.col}>
              <Checkbox label="No Priorities" checked={priorities.noPriorities} onChange={(v: boolean) => setPriorities({...priorities, noPriorities: v})} COLORS={COLORS} />
              <Checkbox label="Select Priorities" checked={priorities.selectPriorities} onChange={(v: boolean) => setPriorities({...priorities, selectPriorities: v})} COLORS={COLORS} />
            </View>
          </View>
          
          <View style={[s.card, { flex: 1 }]}>
            <Text style={s.sectionTitle}>Labels</Text>
            <View style={s.col}>
              <Checkbox label="No labels" checked={labels.noLabels} onChange={(v: boolean) => setLabels({...labels, noLabels: v})} COLORS={COLORS} />
              <Checkbox label="Select Labels" checked={labels.selectLabels} onChange={(v: boolean) => setLabels({...labels, selectLabels: v})} COLORS={COLORS} />
            </View>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={s.footer}>
        <TouchableOpacity style={[s.btn, s.btnOutline]} onPress={() => {
            setKeyword("");
            setFlags({ urgent: false, important: false });
            setStatus({ new: false, doing: false, done: false });
            setAssigner("");
            setAssignee("");
            setMembers({ noMembers: false, assignedToMe: false, selectMembers: false });
            setDates({ createdRange: false, noDates: false, selectStatus: false, customRange: false });
            setPriorities({ noPriorities: false, selectPriorities: false });
            setLabels({ noLabels: false, selectLabels: false });
        }}>
          <Ionicons name="refresh" size={16} color={COLORS.text} />
          <Text style={s.btnText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={() => router.back()}>
          <Ionicons name="checkmark" size={18} color={COLORS.white} />
          <Text style={s.btnTextWhite}>Apply Filter</Text>
        </TouchableOpacity>
      </View>

      {/* DROPDOWN MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={s.modalOption} onPress={() => selectOption(item)}>
                  <Text style={s.modalOptionText}>{item}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 6,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  }
});

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  closeBtn: { 
    padding: 6, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  content: { 
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  col: {
    flexDirection: "column",
    gap: 6,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    height: 48,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: COLORS.text,
  },
  dropdownTextMuted: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  // Footer
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 12,
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnOutline: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnTextWhite: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  btnText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
