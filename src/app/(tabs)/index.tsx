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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "../../store/taskStore";
import { useAppTheme } from "../../store/themeStore";
import { useUserStore } from "../../store/userStore";

export default function HomeTab() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const acceptJoinRequest = useTaskStore((s) => s.acceptJoinRequest);
  const { mode, colors } = useAppTheme();
  const { name, avatarUrl } = useUserStore();

  const COLORS = useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: colors.accent,
    danger: "#ef4444",
    blue: "#3b82f6",
    green: "#10b981",
    orange: "#f59e0b",
    purple: "#8b5cf6",
  }), [colors]);

  const styles = useMemo(() => getStyles(COLORS), [COLORS]);

  const themeBg = COLORS.bg;
  const themeText = COLORS.text;
  
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Kerja");
  const [formPriority, setFormPriority] = useState("Sedang");
  const [formDue, setFormDue] = useState("");

  const personalTasks = useMemo(() => tasks.filter(t => t.taskType !== "Team"), [tasks]);

  const filteredTasks = useMemo(() => {
    if (!query) return personalTasks;
    return personalTasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  }, [personalTasks, query]);

  const [currentTime, setCurrentTime] = useState("");
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wibDate = new Date(utc + (3600000 * 7));
      const h = String(wibDate.getHours()).padStart(2, '0');
      const m = String(wibDate.getMinutes()).padStart(2, '0');
      const s = String(wibDate.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s} WIB`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Text style={[styles.logoText, { color: themeText }]}>Task Flow</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.timerPill, { backgroundColor: COLORS.green }]}>
            <Ionicons name="time-outline" size={12} color={COLORS.bg} />
            <Text style={[styles.timerPillText, { color: COLORS.bg }]}>{currentTime}</Text>
          </View>
          <View style={styles.teamBadge}>
            <Ionicons name="people" size={12} color={COLORS.primary} />
            <Text style={styles.teamBadgeText}>3</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={themeText} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text style={{ color: COLORS.text, fontWeight: "bold", fontSize: 14 }}>{name ? name.charAt(0).toUpperCase() : "?"}</Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
        {/* GREETING */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Home</Text>
          <Text style={styles.greetingSubtitle}>Welcome <Text style={{fontWeight: 'bold', color: themeText}}>{name || "User"}</Text></Text>
        </View>

        {/* MY TASKS & SEARCH */}
        <View style={styles.myTasksSection}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search Task..."
                placeholderTextColor={COLORS.textMuted}
                style={[styles.searchInput, { color: themeText }]}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => {}}>
              <Ionicons name="options-outline" size={22} color={themeText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SUMMARY BOXES (Horizontal Scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
          <SummaryBox title="All Task" count="0 / 1" color={COLORS.blue} />
          <SummaryBox title="Overdue" count="0 / 0" color={COLORS.danger} />
          <SummaryBox title="Today's Plan" count="0 / 0" color={COLORS.green} />
          <SummaryBox title="Due Today" count="0 / 0" color={COLORS.orange} />
          <SummaryBox title="Upcoming" count="0 / 0" color={COLORS.purple} />
        </ScrollView>

        {/* TASK LIST */}
        <View style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <Text style={{color: COLORS.textMuted, textAlign: 'center', marginTop: 20}}>Belum ada tugas.</Text>
          ) : (
            filteredTasks.map((t, idx) => (
              <TouchableOpacity key={t.id} activeOpacity={0.8} onPress={() => setSelectedTask(t)}>
                <TaskCard item={t} index={idx} onToggle={() => toggleDone(t.id)} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add-task")} activeOpacity={0.8}>
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


      {/* MODAL DETAIL TUGAS */}
      <Modal visible={!!selectedTask} animationType="slide" transparent onRequestClose={() => setSelectedTask(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: COLORS.card, maxHeight: "80%" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>Detail Tugas</Text>
              <TouchableOpacity onPress={() => setSelectedTask(null)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            
            {selectedTask && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Header Row: Category & Status */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                   <View style={{ backgroundColor: COLORS.blue + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                     <Text style={{ color: COLORS.blue, fontWeight: "600", fontSize: 12 }}>{selectedTask.category || "Kerja"}</Text>
                   </View>
                   <View style={{ backgroundColor: selectedTask.isDone ? COLORS.green + '20' : COLORS.orange + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                     <Text style={{ color: selectedTask.isDone ? COLORS.green : COLORS.orange, fontWeight: "600", fontSize: 12 }}>
                       {selectedTask.isDone ? "Selesai" : "In Progress"}
                     </Text>
                   </View>
                </View>

                {/* Title & Priority */}
                <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.text, marginBottom: 12 }}>
                  {selectedTask.title}
                </Text>
                
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name="flag" size={16} color={selectedTask.priority === "Tinggi" ? COLORS.danger : COLORS.primary} />
                    <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>{selectedTask.priority}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name="calendar" size={16} color={COLORS.textMuted} />
                    <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>{selectedTask.deadline || "Tidak ada tenggat"}</Text>
                  </View>
                </View>

                {/* Deskripsi */}
                <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 8 }}>Deskripsi</Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
                  {selectedTask.description || "Tidak ada deskripsi detail untuk tugas ini. Anda dapat menambahkan deskripsi lebih lanjut nanti."}
                </Text>

                {/* Anggota Tergabung */}
                <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 12 }}>
                  Anggota Tim ({selectedTask.members?.length || 0})
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {selectedTask.members?.map((m: string, idx: number) => (
                    <View key={idx} style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, padding: 6, borderRadius: 20, paddingRight: 16, borderWidth: 1, borderColor: COLORS.border }}>
                      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                        <Text style={{ color: COLORS.bg, fontWeight: "bold", fontSize: 12 }}>{m.charAt(0).toUpperCase()}</Text>
                      </View>
                      <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: "500" }}>{m}</Text>
                    </View>
                  ))}
                  {(!selectedTask.members || selectedTask.members.length === 0) && (
                    <Text style={{ color: COLORS.textMuted, fontSize: 13, fontStyle: "italic" }}>Belum ada anggota yang bergabung.</Text>
                  )}
                </View>

                {/* Permintaan Bergabung */}
                {selectedTask.joinRequests && selectedTask.joinRequests.length > 0 && (
                  <>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 12 }}>
                      Permintaan Bergabung ({selectedTask.joinRequests.length})
                    </Text>
                    <View style={{ marginBottom: 16 }}>
                      {selectedTask.joinRequests.map((email: string, idx: number) => (
                        <View key={idx} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8, backgroundColor: COLORS.bg, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.orange, alignItems: "center", justifyContent: "center" }}>
                              <Text style={{ color: COLORS.bg, fontWeight: "bold", fontSize: 14 }}>{email.charAt(0).toUpperCase()}</Text>
                            </View>
                            <View>
                              <Text style={{ color: COLORS.text, fontWeight: "600", fontSize: 14 }}>{email.split('@')[0]}</Text>
                              <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{email}</Text>
                            </View>
                          </View>
                          <TouchableOpacity 
                            style={{ backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                            onPress={() => {
                              acceptJoinRequest(selectedTask.id, email);
                              setSelectedTask({
                                ...selectedTask,
                                members: [...(selectedTask.members || []), email],
                                joinRequests: selectedTask.joinRequests.filter((e: string) => e !== email)
                              });
                            }}
                          >
                            <Text style={{ color: COLORS.bg, fontWeight: "bold", fontSize: 13 }}>Terima</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
  // Komponen Kotak Ringkasan
  function SummaryBox({ title, count, color }: any) {
    return (
      <View style={[styles.summaryBox, { borderColor: color }]}>
        <Text style={[styles.summaryTitle, { color }]}>{title}</Text>
        <Text style={[styles.summaryCount, { color }]}>{count}</Text>
      </View>
    );
  }

  // Komponen Kartu Tugas (Mirip di Screenshot)
  function TaskCard({ item, index, onToggle }: any) {
    return (
      <View style={styles.taskCard}>
        <View style={styles.taskHeaderRow}>
          <View style={[styles.pauseBtn, { backgroundColor: index % 2 === 0 ? COLORS.danger : COLORS.green }]}>
            <Ionicons name={index % 2 === 0 ? "pause" : "play"} size={14} color={COLORS.bg} />
          </View>
          <Text style={styles.taskTag}>[DGM-{index + 223}]</Text>
          <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
          <Ionicons name="ellipsis-vertical" size={18} color={COLORS.textMuted} style={{marginLeft: 'auto'}} />
        </View>

        <View style={styles.taskDetailsGrid}>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Created Date</Text>
            <Text style={styles.detailValue}>11 Sep 2026</Text>
          </View>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>-</Text>
          </View>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Urgency</Text>
            <Text style={styles.detailValue}>-</Text>
          </View>
        </View>

        <View style={styles.taskFooter}>
          <View style={styles.avatarGroup}>
             <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>E</Text></View>
             <View style={[styles.miniAvatar, {marginLeft: -8, backgroundColor: COLORS.blue}]}><Text style={styles.miniAvatarText}>M</Text></View>
          </View>
          <View style={styles.tagGroup}>
             <Text style={styles.projectTag}>Design Manager</Text>
             <Text style={styles.statusTag}>In Progress</Text>
          </View>
        </View>
      </View>
    );
  }


}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  logoBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timerPillText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  teamBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  teamBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
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
    fontSize: 14,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 16,
  },
  summaryBox: {
    width: 130,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'transparent',
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 16,
    fontWeight: "bold",
  },

  taskList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pauseBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  taskTag: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginRight: 8,
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.blue,
  },
  taskDetailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginBottom: 12,
  },
  detailCell: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  miniAvatarText: {
    color: COLORS.bg,
    fontSize: 10,
    fontWeight: "bold",
  },
  tagGroup: {
    flexDirection: "row",
    gap: 8,
  },
  projectTag: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.blue,
  },
  statusTag: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.text,
  },

  fab: {
    position: "absolute",
    bottom: 90,
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
