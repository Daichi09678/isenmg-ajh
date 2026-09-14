import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Animated, TextInput, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTaskStore } from "../../store/taskStore";
import { useUserStore } from "../../store/userStore";

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

const BlinkingDot = () => {
  const opacity = React.useRef(new Animated.Value(0.2)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green, opacity }} />;
};

const BlinkingLiveDot = ({ isPaused }: { isPaused: boolean }) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;
  
  React.useEffect(() => {
    if (isPaused) {
      opacity.setValue(1);
      return;
    }
    
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1000, useNativeDriver: true })
      ])
    );
    animation.start();
    
    return () => animation.stop();
  }, [isPaused]);

  return (
    <Animated.View 
      style={[
        styles.liveDot, 
        isPaused && { backgroundColor: COLORS.yellow },
        { opacity }
      ]} 
    />
  );
};

export default function MonitoringScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const addComment = useTaskStore((s) => s.addComment);
  const { name } = useUserStore();

  const [isPaused, setIsPaused] = useState(false);

  const teamTasks = tasks.filter((t) => t.taskType === "Team");
  const backlogTasks = teamTasks.filter((t) => t.status === "Backlog");
  const doingTasks = teamTasks.filter((t) => t.status === "Doing");
  const mrTasks = teamTasks.filter((t) => t.status === "MR");
  const testingTasks = teamTasks.filter((t) => t.status === "Testing");
  const doneTasks = teamTasks.filter((t) => t.status === "Done");

  const backlogCount = backlogTasks.length;
  const doingCount = doingTasks.length;
  const mrCount = mrTasks.length;
  const testingCount = testingTasks.length;
  const doneCount = doneTasks.length;
  const totalCount = teamTasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [taskDetail, setTaskDetail] = useState<any>(null);
  const [quickUpdateColumn, setQuickUpdateColumn] = useState<string | null>(null);
  const [quickUpdateText, setQuickUpdateText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Member Invite State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [joinRequests, setJoinRequests] = useState([
     { id: '101', email: 'johndoe@gmail.com', name: 'John Doe', requestedRole: 'Viewer' }
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }, 1500);
  };

  const handleQuickUpdate = () => {
    if (!quickUpdateText.trim() || !quickUpdateColumn) return;
    
    useTaskStore.getState().addTask({
      title: quickUpdateText.trim(),
      description: "",
      deadline: new Date().toISOString(),
      category: "Kerja" as any,
      priority: "Sedang" as any,
      taskType: "Team",
      status: quickUpdateColumn as any,
      members: [name || "Anda"],
    });
    setQuickUpdateColumn(null);
    setQuickUpdateText("");
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
                <BlinkingLiveDot isPaused={isPaused} />
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
            onPress={() => setMembersModalVisible(true)}
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
            onPress={() => router.push("/add-team-task")}
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
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter-outline" size={15} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolIconBtn}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Ionicons name="refresh-outline" size={15} color={isSyncing ? COLORS.green : COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sync Toast */}
        {showToast && (
          <View style={{ position: 'absolute', top: 16, right: 16, backgroundColor: COLORS.green, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, zIndex: 50, elevation: 5 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Data tersinkronisasi</Text>
          </View>
        )}
      </View>

      {/* Kanban Board Columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardScroll}>
        <BoardColumn title="Backlog" count={backlogCount} color={COLORS.blue}>
          {backlogTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Backlog")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Doing" count={doingCount} color={COLORS.text}>
          {doingTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Doing")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>

        <BoardColumn title="MR" count={mrCount} color={COLORS.text}>
          {mrTasks.length === 0 && (
            <View style={styles.dropZone}>
              <Text style={styles.dropText}>Drop task here</Text>
            </View>
          )}
          {mrTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("MR")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Testing" count={testingCount} color={COLORS.yellow}>
          {testingTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Testing")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Done" count={doneCount} color={COLORS.green}>
          {doneTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Done")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
      </ScrollView>

      {/* CUSTOM MODALS */}
      {/* 1. Modal Anggota */}
      <Modal visible={membersModalVisible} animationType="fade" transparent onRequestClose={() => setMembersModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anggota Tergabung</Text>
              <TouchableOpacity onPress={() => setMembersModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}} showsVerticalScrollIndicator={false}>
              
              {/* Join Requests Section */}
              {joinRequests.length > 0 && (
                 <View style={{marginBottom: 20}}>
                    <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Permintaan Bergabung</Text>
                    {joinRequests.map(req => (
                       <View key={req.id} style={{backgroundColor: COLORS.bg, padding: 12, borderRadius: 8, marginBottom: 8}}>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                             <View>
                               <Text style={{color: COLORS.text, fontWeight: 'bold', fontSize: 13}}>{req.name}</Text>
                               <Text style={{color: COLORS.textMuted, fontSize: 11}}>{req.email}</Text>
                             </View>
                             <TouchableOpacity onPress={() => setJoinRequests(joinRequests.map(r => r.id === req.id ? {...r, requestedRole: r.requestedRole === 'Viewer' ? 'Editor' : 'Viewer'} : r))} style={{backgroundColor: COLORS.card, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border}}>
                               <Text style={{color: COLORS.textMuted, fontSize: 11}}>{req.requestedRole}</Text>
                             </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', gap: 8, marginTop: 12}}>
                             <TouchableOpacity onPress={() => setJoinRequests(joinRequests.filter(r => r.id !== req.id))} style={{flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: COLORS.border}}>
                               <Text style={{color: COLORS.text, fontSize: 12, fontWeight: 'bold'}}>Tolak</Text>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={() => setJoinRequests(joinRequests.filter(r => r.id !== req.id))} style={{flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6, backgroundColor: COLORS.blue}}>
                               <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>Terima</Text>
                             </TouchableOpacity>
                          </View>
                       </View>
                    ))}
                 </View>
              )}

              {/* Invite Section */}
              <View style={{marginBottom: 20}}>
                <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Undang Anggota</Text>
                <View style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
                   <TextInput
                     placeholder="Masukkan email..."
                     placeholderTextColor={COLORS.textMuted}
                     value={inviteEmail}
                     onChangeText={setInviteEmail}
                     style={{flex: 1, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, color: COLORS.text, fontSize: 12}}
                   />
                   <TouchableOpacity onPress={() => setInviteRole(inviteRole === 'Viewer' ? 'Editor' : 'Viewer')} style={{backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center'}}>
                     <Text style={{color: COLORS.textMuted, fontSize: 12}}>{inviteRole}</Text>
                   </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {setInviteEmail("");}} style={{backgroundColor: COLORS.blue, paddingVertical: 10, borderRadius: 8, alignItems: 'center'}}>
                   <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>Kirim Undangan</Text>
                </TouchableOpacity>
              </View>

              <Text style={{color: COLORS.textMuted, fontSize: 12, marginBottom: 16}}>
                {ACTIVE_MEMBERS.length} Anggota sedang mengakses monitoring ini secara real-time.
              </Text>
              {ACTIVE_MEMBERS.map(m => (
                <View key={m.id} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12}}>
                  <View style={[styles.memberAvatar, {backgroundColor: m.color, width: 36, height: 36, borderRadius: 18}]}>
                     <Text style={{color: '#fff', fontWeight: 'bold'}}>{m.initials}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{color: COLORS.text, fontWeight: 'bold'}}>{m.name}</Text>
                    <Text style={{color: COLORS.textMuted, fontSize: 12}}>{m.role}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                    <BlinkingDot />
                    <Text style={{color: COLORS.green, fontSize: 12}}>Online</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2. Modal Filter */}
      <Modal visible={filterModalVisible} animationType="slide" transparent onRequestClose={() => setFilterModalVisible(false)}>
        <View style={[styles.modalBackdrop, { justifyContent: 'flex-end' }]}>
          <View style={[styles.modalContent, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Task</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8, marginTop: 12}}>Prioritas</Text>
            <View style={{flexDirection: 'row', gap: 8, marginBottom: 16}}>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>High</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Medium</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Low</Text></View>
            </View>
            <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Status</Text>
            <View style={{flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap'}}>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Backlog</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Doing</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Testing</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Done</Text></View>
            </View>
            <TouchableOpacity style={styles.applyFilterBtn} onPress={() => setFilterModalVisible(false)}>
               <Text style={{color: '#fff', fontWeight: 'bold'}}>Terapkan Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Modal Task Detail */}
      <Modal visible={!!taskDetail} animationType="slide" transparent onRequestClose={() => setTaskDetail(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>T-{taskDetail?.id}</Text>
              <TouchableOpacity onPress={() => setTaskDetail(null)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>{taskDetail?.title}</Text>
              {taskDetail?.description ? <Text style={{color: COLORS.textMuted, marginBottom: 16}}>{taskDetail.description}</Text> : null}
              
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20}}>
                 <Ionicons name="person-circle" size={24} color={COLORS.textMuted} />
                 <Text style={{color: COLORS.text, fontSize: 14}}>Ditugaskan kepada <Text style={{fontWeight: 'bold'}}>{taskDetail?.members?.[0] || 'Unknown'}</Text></Text>
              </View>

              <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Ubah Status</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24}}>
                {["Backlog", "Doing", "MR", "Testing", "Done"].map(status => (
                  <TouchableOpacity 
                    key={status}
                    style={[styles.filterChip, taskDetail?.status === status && { backgroundColor: COLORS.blue, borderColor: COLORS.blue }]}
                    onPress={() => {
                      updateTaskStatus(taskDetail.id, status as any);
                      setTaskDetail({ ...taskDetail, status });
                    }}
                  >
                    <Text style={[styles.filterChipText, taskDetail?.status === status && { color: '#fff' }]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 12}}>Riwayat Progres & Komentar</Text>
              {taskDetail?.comments?.map((c: any) => (
                <View key={c.id} style={{backgroundColor: COLORS.taskBg, padding: 12, borderRadius: 8, marginBottom: 8}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                    <Text style={{color: COLORS.blue, fontWeight: 'bold', fontSize: 13}}>{c.author}</Text>
                    <Text style={{color: COLORS.textMuted, fontSize: 11}}>{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  </View>
                  <Text style={{color: COLORS.text, fontSize: 14}}>{c.text}</Text>
                </View>
              ))}
              {(!taskDetail?.comments || taskDetail.comments.length === 0) && (
                <Text style={{color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic', marginBottom: 16}}>Belum ada komentar.</Text>
              )}
            </ScrollView>

            <View style={{flexDirection: 'row', gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border}}>
              <TextInput 
                placeholder="Balas / Tulis update..."
                placeholderTextColor={COLORS.textMuted}
                style={{flex: 1, backgroundColor: COLORS.taskBg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text}}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity 
                style={{backgroundColor: COLORS.green, borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center'}}
                onPress={() => {
                  if (commentText.trim()) {
                    addComment(taskDetail.id, name || "Anda", commentText.trim());
                    // Optimistically update local task detail state
                    setTaskDetail({
                      ...taskDetail,
                      comments: [...(taskDetail.comments || []), { id: Date.now().toString(), author: name || "Anda", text: commentText.trim(), createdAt: new Date().toISOString() }]
                    });
                    setCommentText("");
                  }
                }}
              >
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Modal Quick Update Progres */}
      <Modal visible={!!quickUpdateColumn} animationType="slide" transparent onRequestClose={() => setQuickUpdateColumn(null)}>
        <View style={[styles.modalBackdrop, { justifyContent: 'flex-end' }]}>
          <View style={[styles.modalContent, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Aktivitas: {quickUpdateColumn}</Text>
              <TouchableOpacity onPress={() => setQuickUpdateColumn(null)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.textMuted, marginBottom: 12}}>Catat apa saja yang baru Anda lakukan untuk progres tim. Ini akan ditambahkan sebagai kartu baru di kolom {quickUpdateColumn}.</Text>
            
            <TextInput 
              placeholder="Saya baru saja menyelesaikan..."
              placeholderTextColor={COLORS.textMuted}
              style={{backgroundColor: COLORS.taskBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: COLORS.text, minHeight: 100, textAlignVertical: 'top', marginBottom: 16}}
              multiline
              value={quickUpdateText}
              onChangeText={setQuickUpdateText}
              autoFocus
            />
            
            <TouchableOpacity 
              style={[styles.applyFilterBtn, { backgroundColor: COLORS.green }]} 
              onPress={handleQuickUpdate}
            >
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Simpan Progres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

function TaskCard({ title, desc, tag, author, commentCount, onSelect }: any) {
  return (
    <TouchableOpacity 
      style={styles.taskCard}
      activeOpacity={0.8}
      onPress={onSelect}
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
            {commentCount > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="chatbubble-outline" size={12} color={COLORS.textMuted} />
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>{commentCount}</Text>
              </View>
            )}
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
  
  // Custom Modals
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  filterChip: { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterChipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  applyFilterBtn: { backgroundColor: COLORS.blue, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
});
