import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../../store/taskStore";
import { useAppTheme } from "../../store/themeStore";

// The photo shows a very dark, sleek UI.
const COLORS = {
  bg: "#16181f", // Main background
  card: "#20232b", // Card background
  border: "#333742",
  text: "#ffffff",
  textMuted: "#a0a5b1",
  primary: "#4ade80", // The bright green FAB and active tab
  danger: "#ef4444", // Red badge / Overdue
  blue: "#3b82f6", // All task
  green: "#10b981", // Today's plan
  orange: "#f59e0b", // Due today
  purple: "#8b5cf6", // Upcoming
};

export default function HomeTab() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const { mode } = useAppTheme();

  // Forcing dark theme colors based on the design request
  const themeBg = COLORS.bg;
  const themeText = COLORS.text;
  
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Kerja");
  const [formPriority, setFormPriority] = useState("Sedang");
  const [formDue, setFormDue] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = query.trim().toLowerCase();
      return !q || t.title.toLowerCase().includes(q);
    });
  }, [tasks, query]);

  function submitForm() {
    if (!formTitle.trim()) return;
    addTask({
      title: formTitle.trim(),
      description: "",
      category: formCategory as any,
      priority: formPriority as any,
      deadline: formDue || "",
    });
    setFormTitle("");
    setFormDue("");
    setModalVisible(false);
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: themeBg }]}>
      {/* HEADER: Task Flow, Bell, Avatar */}
      <View style={styles.header}>
        <Text style={[styles.logoText, { color: themeText }]}>Task Flow</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setNotifVisible(true)} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={themeText} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={32} color={COLORS.textMuted} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
        {/* GREETING */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Home</Text>
          <Text style={styles.greetingSubtitle}>Welcome <Text style={{fontWeight: 'bold', color: themeText}}>Mukhamad Eko Arifudin</Text></Text>
        </View>

        {/* MY TASKS & SEARCH */}
        <View style={styles.myTasksSection}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor={COLORS.textMuted}
              style={[styles.searchInput, { color: themeText }]}
            />
          </View>
        </View>

        {/* SUMMARY BOXES (Horizontal Scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
          <SummaryBox icon="people-outline" title="All Task" count={tasks.length} color={COLORS.blue} />
          <SummaryBox icon="alert-circle-outline" title="Overdue" count={0} color={COLORS.danger} />
          <SummaryBox icon="calendar-outline" title="Today's Plan" count={0} color={COLORS.green} />
          <SummaryBox icon="calendar-clear-outline" title="Due Today" count={0} color={COLORS.orange} />
          <SummaryBox icon="time-outline" title="Upcoming" count={0} color={COLORS.purple} />
        </ScrollView>

        {/* TASK LIST */}
        <View style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <Text style={{color: COLORS.textMuted, textAlign: 'center', marginTop: 20}}>Belum ada tugas.</Text>
          ) : (
            filteredTasks.map((t, idx) => (
              <TaskCard key={t.id} item={t} index={idx} onToggle={() => toggleDone(t.id)} />
            ))
          )}
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color={COLORS.bg} />
      </TouchableOpacity>

      {/* MODAL ADD TASK */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: COLORS.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>Tugas Baru</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              autoFocus
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="Judul tugas..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.modalSubmit} onPress={submitForm}>
              <Text style={styles.modalSubmitText}>Simpan Tugas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL NOTIFIKASI */}
      <Modal visible={notifVisible} animationType="slide" transparent onRequestClose={() => setNotifVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: COLORS.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>Notifikasi</Text>
              <TouchableOpacity onPress={() => setNotifVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.textMuted}}>Tidak ada notifikasi baru.</Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// Komponen Kotak Ringkasan
function SummaryBox({ icon, title, count, color }: any) {
  return (
    <View style={[styles.summaryBox, { borderColor: color }]}>
      <Ionicons name={icon as any} size={24} color={color} style={{ marginBottom: 4 }} />
      <Text style={[styles.summaryTitle, { color: color }]}>{title}</Text>
      <Text style={[styles.summaryCount, { color: color }]}>{count}</Text>
    </View>
  );
}

// Komponen Kartu Tugas (Mirip di Screenshot)
function TaskCard({ item, index, onToggle }: any) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskCardHeader}>
        <Text style={styles.taskTag}>[TSK-{index + 101}]</Text>
        <Ionicons name="chevron-up" size={20} color={COLORS.textMuted} />
      </View>
      <Text style={styles.taskTitle}>{item.title}</Text>
      
      <View style={styles.taskTimerRow}>
        <View style={styles.pauseBtn}>
          <Ionicons name="pause" size={16} color={COLORS.danger} />
        </View>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>00:42:33</Text>
        </View>
      </View>

      <View style={styles.taskDetailsGrid}>
        <View style={styles.detailCell}>
          <Text style={styles.detailLabel}>Created Date</Text>
          <Text style={styles.detailValue}>Hari ini</Text>
        </View>
        <View style={styles.detailCell}>
          <Text style={styles.detailLabel}>Urgency</Text>
          <Text style={styles.detailValue}>{item.priority || "-"}</Text>
        </View>
        <View style={styles.detailCell}>
          <Text style={styles.detailLabel}>Project</Text>
          <Text style={styles.detailValue}>-</Text>
        </View>
        <View style={styles.detailCell}>
          <Text style={styles.detailLabel}>Assignee</Text>
          <Text style={styles.detailValue}>Mukhamad Eko Arifudin</Text>
        </View>
        <View style={styles.detailCell}>
          <Text style={styles.detailLabel}>Workspace</Text>
          <Text style={styles.detailValue}>Design Manager</Text>
        </View>
        <View style={styles.detailCell}>
          <Text style={styles.detailLabel}>Curr. Board</Text>
          <Text style={styles.detailValue}>{item.isDone ? "Done" : "In Progress"}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.toggleBtn, item.isDone && { backgroundColor: COLORS.primary }]} 
        onPress={onToggle}
      >
        <Text style={[styles.toggleBtnText, item.isDone && { color: COLORS.bg }]}>
          {item.isDone ? "Selesai (Batalkan?)" : "Selesaikan Tugas"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  notifBtn: {
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.bg,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  contentPad: {
    paddingBottom: 100, // Space for FAB
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  
  myTasksSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  summaryScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 16,
  },
  summaryBox: {
    width: 90,
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: "bold",
  },

  taskList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTag: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  taskTimerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  pauseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: "center",
    justifyContent: "center",
  },
  timerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "500",
  },
  taskDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  detailCell: {
    width: "50%",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  toggleBtn: {
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  toggleBtnText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // MODAL
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.6)", 
    justifyContent: "flex-end" 
  },
  modalSheet: { 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24, 
    paddingBottom: 40,
    gap: 16,
  },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 8 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  modalSubmit: { 
    marginTop: 16, 
    backgroundColor: COLORS.primary, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  modalSubmitText: { 
    color: COLORS.bg, 
    fontWeight: "bold", 
    fontSize: 16 
  },
});
