import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  bg: "#0f172a", // Dark slate background
  card: "#1e293b", // Column background
  taskBg: "#0f172a", // Task card inside column
  border: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#fbbf24",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
};

const ACTIVE_MEMBERS = [
  { id: "1", name: "Muhammad Ifrozin", initials: "MI", role: "Lead Developer", color: "#3b82f6" },
  { id: "2", name: "Vrika Nurrahman", initials: "VN", role: "QA Engineer", color: "#10b981" },
  { id: "3", name: "Farid Abdul Aziz", initials: "FA", role: "DevOps Engineer", color: "#8b5cf6" },
  { id: "4", name: "Puspita Sari", initials: "PS", role: "Backend Developer", color: "#f59e0b" },
];

export default function MonitoringScreen() {
  const [isPaused, setIsPaused] = useState(false);

  const backlogCount = 7;
  const doingCount = 21;
  const mrCount = 0;
  const testingCount = 272;
  const doneCount = 327;
  const totalCount = backlogCount + doingCount + mrCount + testingCount + doneCount;
  const progressPercent = Math.round((doneCount / totalCount) * 100);

  const showMembersModal = () => {
    Alert.alert(
      "Anggota Tergabung di Monitoring",
      `4 Anggota sedang mengakses monitoring ini secara real-time:\n\n• Muhammad Ifrozin - Lead Developer (Online)\n• Vrika Nurrahman - QA Engineer (Online)\n• Farid Abdul Aziz - DevOps (Online)\n• Puspita Sari - Backend Developer (Online)\n• +2 Anggota lainnya`,
      [{ text: "Tutup", style: "cancel" }]
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* BAR MONITORING: Header, Avatar Anggota, Tools, & Progress Bar */}
      <View style={styles.monitoringBar}>
        {/* Top Row: Title + Project Status & Avatar Anggota in the top right */}
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={styles.headerTitle}>Mobile Asabri</Text>
              <View style={styles.liveBadge}>
                <View style={[styles.liveDot, isPaused && { backgroundColor: COLORS.yellow }]} />
                <Text style={[styles.liveText, isPaused && { color: COLORS.yellow }]}>
                  {isPaused ? "Paused" : "Live"}
                </Text>
              </View>
            </View>
            <Text style={styles.headerSub}>Workspace Task Monitoring</Text>
          </View>

          {/* Avatar Anggota: Foto profil / inisial orang-orang yang sudah tergabung & akses monitoring */}
          <TouchableOpacity 
            style={styles.avatarGroup}
            activeOpacity={0.7}
            onPress={showMembersModal}
          >
            <View style={styles.avatarStack}>
              {ACTIVE_MEMBERS.map((member, idx) => (
                <View 
                  key={member.id} 
                  style={[
                    styles.memberAvatar, 
                    { backgroundColor: member.color, marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx }
                  ]}
                >
                  <Text style={styles.avatarText}>{member.initials}</Text>
                </View>
              ))}
              <View style={[styles.memberAvatar, styles.avatarMore, { marginLeft: -8, zIndex: 1 }]}>
                <Text style={styles.avatarMoreText}>+2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress Bar: Persentase kemajuan keseluruhan proyek/workspace */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="pie-chart-outline" size={14} color={COLORS.green} />
              <Text style={styles.progressLabel}>Kemajuan Proyek</Text>
            </View>
            <Text style={styles.progressPercent}>{progressPercent}% Selesai</Text>
          </View>
          
          <View style={styles.progressBarTrack}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercent}%` }
              ]} 
            />
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statsSummary}>
              <Text style={{ color: COLORS.green, fontWeight: "700" }}>{doneCount}</Text> dari {totalCount} tasks
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={styles.statMini}><Text style={{ color: COLORS.blue }}>●</Text> Doing: {doingCount}</Text>
              <Text style={styles.statMini}><Text style={{ color: COLORS.yellow }}>●</Text> Test: {testingCount}</Text>
              <Text style={styles.statMini}><Text style={{ color: COLORS.green }}>●</Text> Done: {doneCount}</Text>
            </View>
          </View>
        </View>

        {/* Tools Row: Semua tools monitoring yang dibutuhkan langsung ada di sini */}
        <View style={styles.toolsRow}>
          <TouchableOpacity 
            style={[styles.toolBtn, { backgroundColor: COLORS.blue }]}
            onPress={() => router.push("/export-tasks")}
          >
            <Ionicons name="download-outline" size={14} color={COLORS.text} />
            <Text style={styles.toolBtnText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtn, { backgroundColor: COLORS.green }]}
            onPress={() => router.push("/add-task")}
          >
            <Ionicons name="add" size={15} color={COLORS.text} />
            <Text style={styles.toolBtnText}>New Task</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtnOutline, isPaused && { borderColor: COLORS.yellow }]}
            onPress={() => setIsPaused(!isPaused)}
          >
            <Ionicons name={isPaused ? "play" : "pause"} size={13} color={isPaused ? COLORS.yellow : COLORS.textMuted} />
            <Text style={[styles.toolBtnOutlineText, isPaused && { color: COLORS.yellow }]}>
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolIconBtn}
            onPress={() => Alert.alert("Filter", "Memfilter task berdasarkan tag, assignee, dan status.")}
          >
            <Ionicons name="filter-outline" size={15} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolIconBtn}
            onPress={() => Alert.alert("Sinkronisasi", "Data monitoring tugas telah diperbarui ke status terkini.")}
          >
            <Ionicons name="refresh-outline" size={15} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Kanban Board Columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardScroll}>
        <BoardColumn title="Backlog" count={backlogCount} color={COLORS.blue}>
          <TaskCard title="Menambah reverse tunnel dari server dev ke vps mitreka" tag="ABR-55" author="Farid Abdul Aziz" />
          <TaskCard title="[CMS-API] Pengecekan RBAC endpoints" tag="ABR-573" author="Puspita Sari" />
        </BoardColumn>
        
        <BoardColumn title="Doing" count={doingCount} color={COLORS.text}>
          <TaskCard title="Testing SPTB" desc="melakukan cek aplikasi SPTB dengan testcase" tag="ABR-469" author="Vrika Nurrahman" />
          <TaskCard title="[API-CORE SERVICE] Survey" tag="ABR-542" author="Muhammad Ifrozin" />
        </BoardColumn>

        <BoardColumn title="MR" count={mrCount} color={COLORS.text}>
          <View style={styles.dropZone}>
            <Text style={styles.dropText}>Drop task here</Text>
          </View>
          <TouchableOpacity 
            style={styles.newTaskBtn}
            onPress={() => router.push("/add-task")}
          >
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>New task</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Testing" count={testingCount} color={COLORS.yellow}>
          <TaskCard title="bug fix foto profile tidak berdasarkan swafoto" tag="ABR-631" author="Muhammad Ifrozin" />
        </BoardColumn>
        
        <BoardColumn title="Done" count={doneCount} color={COLORS.green}>
          <TaskCard title="diskusi terkait bisnis proses OTP saat registrasi asmbo" tag="ABR-653" author="Muhammad Ifrozin" />
        </BoardColumn>
      </ScrollView>
    </SafeAreaView>
  );
}

function BoardColumn({ title, count, color, children }: any) {
  return (
    <View style={styles.column}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={[styles.columnTitle, { color }]}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {children}
      </ScrollView>
    </View>
  );
}

function TaskCard({ title, desc, tag, author }: any) {
  return (
    <TouchableOpacity 
      style={styles.taskCard}
      activeOpacity={0.8}
      onPress={() => Alert.alert(`Task ${tag}`, `${title}\n\nDibuat oleh: ${author}`)}
    >
      <Text style={styles.taskTitle}>{title}</Text>
      {desc ? <Text style={styles.taskDesc} numberOfLines={2}>{desc}</Text> : null}
      
      <View style={styles.taskFooter}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={12} color="#000" />
        </View>
        <View style={{ alignItems: "flex-end", flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text style={styles.taskTag}>{tag}</Text>
            <Ionicons name="chatbubble-outline" size={12} color={COLORS.textMuted} />
          </View>
          <Text style={styles.taskAuthor}>Created by {author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  monitoringBar: { 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 16, 
    backgroundColor: "#162032", 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border 
  },
  headerTop: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  liveBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    backgroundColor: "rgba(16, 185, 129, 0.15)", 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)"
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
  liveText: { fontSize: 10, fontWeight: "bold", color: COLORS.green },
  
  // Avatar Anggota
  avatarGroup: { paddingLeft: 8 },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  memberAvatar: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: "#162032", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  avatarText: { fontSize: 10, fontWeight: "bold", color: "#fff" },
  avatarMore: { backgroundColor: "#334155" },
  avatarMoreText: { fontSize: 10, fontWeight: "bold", color: COLORS.textMuted },

  // Progress Bar
  progressContainer: { 
    backgroundColor: "rgba(15, 23, 42, 0.6)", 
    borderRadius: 10, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "rgba(51, 65, 85, 0.5)",
    marginBottom: 12
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  progressLabel: { fontSize: 11, fontWeight: "600", color: COLORS.textMuted },
  progressPercent: { fontSize: 12, fontWeight: "bold", color: COLORS.green },
  progressBarTrack: { height: 6, backgroundColor: "#334155", borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  progressBarFill: { height: "100%", backgroundColor: COLORS.green, borderRadius: 3 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statsSummary: { fontSize: 10, color: COLORS.textMuted },
  statMini: { fontSize: 10, color: COLORS.textMuted },

  // Tools Row
  toolsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  toolBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 6 
  },
  toolBtnText: { fontSize: 11, fontWeight: "600", color: COLORS.text },
  toolBtnOutline: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(30, 41, 59, 0.5)"
  },
  toolBtnOutlineText: { fontSize: 11, fontWeight: "600", color: COLORS.textMuted },
  toolIconBtn: { 
    width: 28, 
    height: 28, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    alignItems: "center", 
    justifyContent: "center" 
  },

  // Board
  boardScroll: { padding: 16, gap: 16, paddingBottom: 100 },
  column: { width: 280, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, maxHeight: "100%" },
  columnTitle: { fontSize: 14, fontWeight: "bold" },
  countBadge: { backgroundColor: "rgba(0,0,0,0.25)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { fontSize: 11, fontWeight: "bold", color: COLORS.textMuted },
  taskCard: { backgroundColor: COLORS.taskBg, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  taskTitle: { fontSize: 13, fontWeight: "600", color: COLORS.text, marginBottom: 6 },
  taskDesc: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  taskFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#ccc", alignItems: "center", justifyContent: "center" },
  taskTag: { fontSize: 11, color: COLORS.textMuted, fontWeight: "600" },
  taskAuthor: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  dropZone: { borderWidth: 1, borderColor: COLORS.border, borderStyle: "dashed", borderRadius: 8, padding: 16, alignItems: "center", marginBottom: 12 },
  dropText: { fontSize: 12, color: COLORS.textMuted },
  newTaskBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: COLORS.bg, padding: 12, borderRadius: 8 },
  newTaskText: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600" },
});
